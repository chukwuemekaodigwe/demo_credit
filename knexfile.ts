import { Knex, knex } from "knex";

const config: Knex.Config = {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'lendsqr_democredit'
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
