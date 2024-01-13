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
        
          return  db.select<Data>('*')
                .from('wallets')
                .join('users', 'users.id', 'wallets.user_id')
                .where(option)
                .then((res: Data & { name: string }) => {
                    res.name = `${res.lastname} ${res.firstname}`
                    return res
                })
                .catch(err => {
                    throw new Error("Error on getWallet");
                    
                })
    
    }
}