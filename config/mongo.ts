import mongoose from 'mongoose';

class Mongo {
    async config() {
        try {
            await mongoose.connect('mongodb://localhost:27017/cnpj')
            console.log('MongoDB Connected!')
        } catch (error) {
            console.log('MongoDB Connection Error!')
        }
    }
}

export default new Mongo()
