import Mongo from "./mongo";
import Redis from "./redis";

class AppConfig {
    public load(): void{
        this.database()
    }
    private database(): void{
        Mongo.config()
    }
}

export default new AppConfig()
