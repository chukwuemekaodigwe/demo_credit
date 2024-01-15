import knex, { Knex } from "knex";
import CrudServiceHelper from "../helpers/CrudService.helper";
import db from '../database/connection'
import Transaction from "../interfaces/transaction.interface";
import Wallet from "../interfaces/wallet.interface";
import WalletService from "./wallet.model";
import User from "../interfaces/user.interface";

type Data = Wallet & Transaction & User
export default class TransactionService extends CrudServiceHelper {

    constructor() {
        super('transactions')
    }

    public AddTransaction(data: Transaction) : Promise<Data> {

        return new Promise((resolve, reject) => {

            db.transaction(function (trx) {
                return trx
                    .insert(data)
                    .into('transactions')
                    .then((res) => {
                        trx
                            .increment('balance', data.amount)
                            .where('user_id', data.user_id)
                            .into('wallets')
                            .then(r => r)
                            .catch(e => e)

                            trx.select('*').from('transactions').where('id', res[0]).first().then(result=>{
                                resolve(result)
                            })
                            .catch(err=>{
                                reject(err)
                            })
                            
                        //resolve(res[0])
                    })
                    .catch((err) => {
                        reject(err)
                    })
            })
        })
    }

    public ReadResource(option: object): Promise<Array<Data>> {
        return new Promise((resolve, reject)=>{
            db.select('*')
            .from('transactions')
            //.join('users', 'users.id', 'transactions.beneficiary')
            //.join('wallets', 'wallets.user_id', 'transactions.beneficiary')
            .then(result=>{
                resolve(result)
            })
            .catch(error=>{
                reject(error)
            })
        })
    }
}
