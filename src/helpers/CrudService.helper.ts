import knex from '../database/connection'
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
            knex(this.resourcename)
                .insert(data)
                .select<Data>('*')
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    public ReadResource() {
        return new Promise((resolve, reject) => {
            knex(this.resourcename)
                .select()
                .returning('*')
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
    public ReadSingleResource(option: object) {
        return new Promise((resolve, reject) => {
            knex(this.resourcename)
                .returning('*')
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
     * @param option the where condition object
     * @param data the updated data
     * @returns the result of the update
     */
    public UpdateResource(option: object, data: Data) {
        return new Promise((resolve, reject) => {
            knex(this.resourcename)
                .where(option)
                .update(data)
                .returning<Data>('*')
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
     * @param option The where condition objet
     * 
     * eg {id: idData}
     * @returns the deleted resource
     */
    public DeleteResource(option: object) {
        return new Promise((resolve, reject) => {
            knex(this.resourcename)
                .where(option)
                .del()
                .returning('*')
                .then((res) => {
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }
}