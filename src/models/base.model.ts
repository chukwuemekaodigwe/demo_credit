import db from '../database/connection'
import Wallet from '../interfaces/wallet.interface'
import User from '../interfaces/user.interface'
import Transaction from '../interfaces/transaction.interface'


type Result = Wallet & User & Transaction
type Data = Wallet | User | Transaction

export default class BaseService {
    private resourcename

    constructor(resourcename: string) {
        this.resourcename = resourcename
    }

    public CreateResource(data:Data):Promise<Result> {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .insert(data)
                .then((res:number[]) => {
                    db.from(this.resourcename).select('*').where('id', res[0]).first().then(result => {
                        resolve(result)
                    })
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    public ReadResource(option:object):Promise<Array<Result>> {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .select()
                .where(option)
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    /**
     * 
     * @param option the where codition object
     * this makes the resource reusable with any conditon 
     * available to the child class
     * @returns object of the updated data
     */

    public ReadSingleResource(option: object):Promise<Result> {
        return new Promise((resolve, reject) => {
            
            db(this.resourcename)
                .select()
                .where(option)
                .first()
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
    /**
     * 
     * @param option the where condition object
     * @param data the updated data
     * @returns the result of the update
     */
    public UpdateResource(option: object, data: Data):Promise<Result> {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .where(option)
                .update(data)
                .then((res:number) => {
                    db.from(this.resourcename).select('*').where(option).first().then(result => {
                        resolve(result)
                    })

                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    /**
     * 
     * @param option The where condition objet
     * 
     * eg {id: idData}
     * @returns the deleted resource
     */
    public DeleteResource(option: object): Promise<number>{
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .where(option)
                .del()
                .then((res:number) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }


    public ResourceById(id: number):Promise<Result> {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .where('id', id)
                .first()
                .then(res => {
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })

        })
    }
}