import axios from "axios";

class ReceitaWSService {
    public async getCNPJInfo(cnpj: string | number) {
        try {
            const req = await axios.get(`https://receitaws.com.br/v1/cnpj/${cnpj}`)
            return req.data
        }
        catch (err) {
            console.log('ReceitaWSService - error ')
            console.log(err)
            return {}
        }
    }
}

export default new ReceitaWSService()