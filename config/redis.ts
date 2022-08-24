import { createClient } from 'redis';

class Redis {
    private client;
    private url = process.env.REDIS_URL || 'redis://localhost:6379';

    constructor() {
        this.connect()
    }

    public async get(key) {
        return await this.client.get(key)
    }

    public add(key, value) {
        try {
            this.client.set(key, JSON.stringify(value));

            // if (!ttl) {
            //     this.client.expireat(key, parseInt(+new Date() / 1000) + 86400);
            // } else {
            //     this.client.expire(key, ttl);
            // }
        }
        catch (err) {
            console.log(err)
        }
    }

    public remove(key) {
        this.client.del(key);
    }

    private connect() {
        this.client = createClient({
            url: this.url
        });
        this.client.connect();
        this.client.setMaxListeners(0);
        this.client.on('error', err => {
            console.log('Error ' + err);
        });
    }
}

export default new Redis()