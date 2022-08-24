import { Document } from 'mongoose'

export default interface CNPJReceitaWSInterface extends Document {
    abertura: string,
    situacao: string,
    tipo: string,
    nome: string,
    fantasia: string
    porte: string,
    natureza_juridica: string,
    atividade_principal: Array<{
        code: string,
        text: string
    }>,
    logradouro: string,
    numero: string,
    municipio: string,
    bairro: string,
    uf: string,
    cep: string,
    email: string,
    telefone: string,
    data_situacao: string,
    cnpj: string,
    ultima_atualizacao: string,
    status: string,
    complemento: string,
    efr: string,
    motivo_situacao: string,
    situacao_especial: string,
    data_situacao_especial: string,
    atividades_secundarias: Array<{ code: string, text: string }>,
    capital_social: string,
    qsa: any,
    extra: object,
    billing: { free: boolean, database: boolean }
}