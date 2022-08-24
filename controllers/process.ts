import { Handler } from "aws-lambda";
import redis from "../config/redis";
import CNPJModel from "../models/cnpj.model"
import receitawsService from "../services/receitaws.service";
import AppConfig from '../config/index'
import MongoRegistro from '../interfaces/mongo-registro.interface'

export const handler: Handler = async (req) => {
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