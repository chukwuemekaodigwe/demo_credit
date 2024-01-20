"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = __importDefault(require("./base.model"));
const connection_1 = __importDefault(require("../database/connection"));
class WalletService extends base_model_1.default {
    constructor() {
        super('wallets');
    }
    getWalletDetail(option) {
        return new Promise((resolve, reject) => {
            connection_1.default.select('*')
                .from('wallets')
                .join('users', 'users.id', 'wallets.user_id')
                .where(option)
                .first()
                .then((res) => {
                res.name = `${res.lastname} ${res.firstname}`;
                resolve(res);
            })
                .catch(err => {
                reject(err);
                console.log(err);
            });
        });
    }
}
exports.default = WalletService;
