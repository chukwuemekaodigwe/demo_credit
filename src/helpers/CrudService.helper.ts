import db from '../database/connection'
import Wallet from '../interfaces/wallet.interface'
import User from '../interfaces/user.interface'
import Transaction from '../interfaces/transaction.interface'


type Data = Wallet | User | Transaction

export default class CrudService {
    private resourcename

    constructor(resourcename: string) {
        this.resourcename = resourcename
    }

    public CreateResource(data: Data) {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .insert(data)
                .then((res) => {
                    db.from(this.resourcename).select('*').where('id', res[0]).first().then(result => {
                        resolve(result)
                    })
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    public ReadResource(option:object) {
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
 x    * 
     * @param option the where codition object
     * this makes the resource reusable with any conditon 
     * available to the child class
     * @returns object of the updated data
     */
    public ReadSingleResource(option: object) {
        return new Promise((resolve, reject) => {
            console.log(option)
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
    public UpdateResource(option: object, data: Data) {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .where(option)
                .update(data)
                .then((res) => {
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
    public DeleteResource(option: object) {
        return new Promise((resolve, reject) => {
            db(this.resourcename)
                .where(option)
                .del()
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }


    public ResourceById(id: number) {
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