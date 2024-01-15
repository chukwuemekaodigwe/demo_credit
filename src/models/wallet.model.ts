import CrudServiceHelper from "../helpers/CrudService.helper";
import Wallet from "../interfaces/wallet.interface";
import db from '../database/connection'
import User from "../interfaces/user.interface";

type Data = User & Wallet

export default class WalletService extends CrudServiceHelper {

    constructor() {
        super('wallets')
    }

    public getWalletDetail(option: object) {
          return new Promise((resolve, reject) => {

            db.select('*')
            .from('wallets')
            .join('users', 'users.id', 'wallets.user_id')
            .where(option)
            .first()
            .then((res: Data & { name: string }) => {
                
                res.name = `${res.lastname} ${res.firstname}`
                resolve(res)
            })
            .catch(err => {
                reject(err)
                console.log(err)
                
            })

          })            
    }
}