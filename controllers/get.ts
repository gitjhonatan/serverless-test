import { Handler } from "aws-lambda";
import AppConfig from '../config/index'
import CNPJModel from "../models/cnpj.model"

export const handler: Handler = async (req) => {
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