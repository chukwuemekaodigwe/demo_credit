"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_model_1 = __importDefault(require("./base.model"));
const connection_1 = __importDefault(require("../database/connection"));
class TransactionService extends base_model_1.default {
    constructor() {
        super('transactions');
    }
    AddTransaction(data) {
        return new Promise((resolve, reject) => {
            connection_1.default.transaction(function (trx) {
                return trx
                    .insert(data)
                    .into('transactions')
                    .then((res) => {
                    trx
                        .increment('balance', data.amount)
                        .where('user_id', data.user_id)
                        .into('wallets')
                        .then(r => r)
                        .catch(e => e);
                    trx.select('*').from('transactions').where('id', res[0]).first().then(result => {
                        resolve(result);
                    })
                        .catch(err => {
                        reject(err);
                    });
                    //resolve(res[0])
                })
                    .catch((err) => {
                    reject(err);
                });
            });
        });
    }
    ReadResource(option) {
        return new Promise((resolve, reject) => {
            connection_1.default.select('*')
                .from('transactions')
                .where(option)
                //.join('users', 'users.id', 'transactions.beneficiary')
                //.join('wallets', 'wallets.user_id', 'transactions.beneficiary')
                .then(result => {
                resolve(result);
            })
                .catch(error => {
                reject(error);
            });
        });
    }
}
exports.default = TransactionService;
