import { Handler } from "aws-lambda";
import AppConfig from '../config/index'
import CNPJModel from "../models/cnpj.model"
import mongoose from "mongoose";

export const handler: Handler = async (req) => {
    AppConfig.load()

    let message: string
    let status_code: number

    const id = req.queryStringParameters?.id
    const id_valido = mongoose.Types.ObjectId.isValid(id)
    const registro: object | null = id_valido ? await CNPJModel.findOne({ _id: id }) : {}

    if (!id) {
        status_code = 400
        message = "Faltando o campo { id }"
    }

    else if(!id_valido) {
        message = "Id inválido"
        status_code = 400
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
        resolve({
            statusCode: status_code,
            body: JSON.stringify({
                message,
                data: registro || {}
            })
        })

    });
};