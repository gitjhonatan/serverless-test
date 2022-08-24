import { Handler } from "aws-lambda";
import redis from "./config/redis";
import CNPJModel from "./models/cnpj.model"
import LambdaHTTPResponse from "./interfaces/lambda-response.interface";
import receitawsService from "./services/receitaws.service";
import AppConfig from './config/index'
import MongoRegistro from './interfaces/mongo-registro.interface'
import { validateCNPJ } from 'validations-br';
import { Mongoose } from "mongoose";

export const post: Handler = async (req) => {
    AppConfig.load()
    const { id, name, cnpj } = JSON.parse(req.body)
    const numeros_cnpj = cnpj.replace(/\D+/g, '')
    if (!id || !name || !cnpj)
        return new Promise((resolve) => {
            resolve({
                body: JSON.stringify({
                    "message": "Faltando campos obrigatórios"
                })
            });
        });

    if (!validateCNPJ(numeros_cnpj))
        return new Promise((resolve) => {
            resolve({
                body: JSON.stringify({
                    "message": "CNPJ inválido"
                })
            });
        });


    const mongo_select = await CNPJModel.findOne({ id, name, cnpj: numeros_cnpj })

    if (mongo_select)
        return new Promise((resolve) => {
            resolve({
                body: JSON.stringify({
                    "message": "Registro já postado",
                    "data": mongo_select
                })
            });
        });

    const redis_objeto = {
        id,
        name,
        cnpj: numeros_cnpj,
        status: 'Aguardando Processamento',
        data: {}
    }

    const { _id } = await CNPJModel.create(redis_objeto)

    const response = {
        body: JSON.stringify({ _id, ...JSON.parse(req.body) })
    };
    return new Promise((resolve) => {
        resolve(response);
    });
};

export const get: Handler = async (req) => {
    AppConfig.load()

    let message: string
    let status_code: number

    const id = req.queryStringParameters?.id
    const registro: object | null = id ? await CNPJModel.findOne({ _id: id }) : {}

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
            message,
            data: registro || {}
        }))
    });
};

export const popula: Handler = async (req) => {
    AppConfig.load()

    const cnpjs_aguardando = await CNPJModel.find({ status: 'Aguardando Processamento' }).limit(3)

    // a api é free e só aceita 3 requisições por minuto
    cnpjs_aguardando.forEach(async (registro_aguardando: MongoRegistro) => {
        const cnpj_cache = await redis.get(registro_aguardando.cnpj)
        const cnpj_info = cnpj_cache ? JSON.parse(cnpj_cache) : await receitawsService.getCNPJInfo(registro_aguardando.cnpj)
        const registro_processado = {
            ...registro_aguardando.toJSON(),
            data: cnpj_info,
            status: 'OK'
        }

        if (!cnpj_cache)
            redis.add(registro_aguardando.cnpj, cnpj_info)

        await CNPJModel.updateOne(registro_aguardando.toJSON(), registro_processado)
    })
};