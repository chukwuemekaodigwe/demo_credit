import knex, { Knex } from "knex";
import CrudServiceHelper from "../helpers/CrudService.helper";
import db from '../database/connection'
import Transaction from "../interfaces/transaction.interface";
import Wallet from "../interfaces/wallet.interface";
import WalletService from "./wallet.model";


export default class TransactionService extends CrudServiceHelper {

    constructor() {
        super('transactions')
    }


    public AddTransaction(data: Transaction) {

        return new Promise((resolve, reject) => {
            new WalletService().getWalletDetail({ user_id: data.user_id }).then((wallet) => {
                db.transaction(function (trx) {
                    return trx
                        .returning('*')
                        .insert(data)
                        .into('transactions')
                        .then((res) => {
                            trx('wallets')
                                .where({ user_id: data.user_id })
                                .update({ balance: (wallet.balance + data.amount) })
                                .returning('*')
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err)
                        })
                })
            })
        })
    }

}