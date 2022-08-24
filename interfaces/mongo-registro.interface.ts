import CNPJReceitaWSInterface from './cnpj-receitaws.interface'
import { Document } from 'mongoose'

export default interface MongoRegistro extends Document {
    id: string,
    cnpj: string,
    status: string,
    data?: CNPJReceitaWSInterface | {}
}