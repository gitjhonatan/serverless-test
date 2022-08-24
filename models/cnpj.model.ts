import { Schema, model, Document } from "mongoose";
import CNPJReceitaWSInterface from "../interfaces/cnpj-receitaws.interface";
import MongoRegistro from "../interfaces/mongo-registro.interface";

const CNPJModel = new Schema({
    id: String,
    cnpj: String,
    status: String,
    data: Object
})

export default model<MongoRegistro>('cnpj', CNPJModel)
