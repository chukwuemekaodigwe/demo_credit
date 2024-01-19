import dotenv from 'dotenv'
dotenv.config()

export default {
    port: process.env.PORT || '8000',
    env: process.env.NODE_ENV || 'dev',
    jwtSecret: process.env.JWTSECRET || 'lendSqr_demoApp',
    DB_HOST: process.env.DB_HOST || '127.0.0.1',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || 'password',
    DB_NAME: process.env.DB_NAME || 'lendsqr_democredit',

}


