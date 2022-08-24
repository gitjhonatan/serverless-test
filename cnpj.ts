import { Handler } from "aws-lambda";
import redis from "./config/redis";
import CNPJModel from "./models/cnpj.model"
import LambdaHTTPResponse from "./interfaces/lambda-response.interface";
import receitawsService from "./services/receitaws.service";
import AppConfig from './config/index'
import MongoRegistro from './interfaces/mongo-registro.interface'

export const post: Handler = async (req) => {
    AppConfig.load()
    const { id, name, cnpj } = JSON.parse(req.body)
    if (!id || !name || !cnpj)
        return new Promise((resolve) => {
            resolve({
                statusCode: 400,
                body: JSON.stringify({
                    "message": "Faltando campos obrigatórios"
                })
            });
        });

    const redis_objeto = {
        id,
        name,
        cnpj,
        status: 'Aguardando Processamento',
        data: {}
    }
    const mongo_insert = await CNPJModel.create(redis_objeto)


    const response = {
        statusCode: 200,
        body: req.body
    };

    // await redis.add(id, redis_objeto)

    return new Promise((resolve) => {
        resolve(response);
    });
};

export const get: Handler = async (req) => {
    let message: string
    let status_code: number

    const id = req.queryStringParameters?.id
    const registro: object = id ? JSON.parse(await redis.get(id)) : {}

    if (!id) {
        status_code = 400
        message = "Faltando o campo { id }"
    }

    else if (!registro) {
        message = "Registro não encontrado"
        status_code = 400
    }

    else {
        message = "Registro encontrado"
        status_code = 200
    }

    return new Promise((resolve) => {
        resolve(JSON.stringify({
            statusCode: status_code,
            body: {
                message,
                data: registro
            }
        }))
    });
};

export const popula: Handler = async (req) => {
    AppConfig.load()

    const cnpjs_aguardando = await CNPJModel.find({ status: 'Aguardando Processamento' }).limit(3)

    // a api é free e só aceita 3 requisições por minuto
    cnpjs_aguardando.forEach(async (registro_aguardando: MongoRegistro) => {
        console.log("processando")
        const cnpj_info = await receitawsService.getCNPJInfo(registro_aguardando.cnpj)
        const registro_processado = {
            ...registro_aguardando.toJSON(),
            data: cnpj_info,
            status:'OK'
        }
        console.log(registro_processado)
        CNPJModel.updateOne(registro_aguardando.toJSON(), registro_processado)
    })

    // return new Promise((resolve) => {
    //     resolve(JSON.stringify({
    //         statusCode: status_code,
    //         body: {
    //             message,
    //             data: registro
    //         }
    //     }))
    // });
};