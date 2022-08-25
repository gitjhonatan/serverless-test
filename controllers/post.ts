import { Handler } from "aws-lambda";
import { validateCNPJ } from "validations-br";
import AppConfig from '../config/index'
import CNPJModel from "../models/cnpj.model"

export const handler: Handler = async (req) => {
    AppConfig.load()
    const { id, name, cnpj } = JSON.parse(req.body)
    const numeros_cnpj = cnpj.replace(/\D+/g, '')
    if (!id || !name || !cnpj)
        return new Promise((resolve) => {
            resolve({
                statusCode: 400,
                body: JSON.stringify({
                    "message": "Faltando campos obrigatórios"
                })
            });
        });

    if (!validateCNPJ(numeros_cnpj))
        return new Promise((resolve) => {
            resolve({
                statusCode: 400,
                body: JSON.stringify({
                    "message": "CNPJ inválido"
                })
            });
        });

    const mongo_select = await CNPJModel.findOne({ id, name, cnpj: numeros_cnpj })

    if (mongo_select)
        return new Promise((resolve) => {
            resolve({
                "message": "Registro já postado",
                "data": mongo_select
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
        statusCode: 202,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message: "Registro ciado",
            data: { _id, ...redis_objeto }
        }),
    };

    return new Promise((resolve) => {
        resolve(response);
    });
};