import { Knex, knex } from "knex";
import env  from "./src/helpers/config";


const config: Knex.Config = {
    client: 'mysql',
    connection: {
        host: env.DB_HOST,
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_NAME
    },
    migrations: {
        
       tableName: 'migrations',
       directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds'
    }
};

 export default config
