"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./src/helpers/config"));
const config = {
    client: 'mysql',
    connection: {
        host: config_1.default.DB_HOST,
        user: config_1.default.DB_USERNAME,
        password: config_1.default.DB_PASSWORD,
        database: config_1.default.DB_NAME
    },
    migrations: {
        tableName: 'migrations',
        directory: './src/database/migrations'
    },
    seeds: {
        directory: './src/database/seeds'
    }
};
exports.default = config;
