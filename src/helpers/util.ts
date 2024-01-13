import { getRandomValues } from "crypto"
import { Response } from "express"
import db from '../database/connection'
import * as Crypto from 'node:crypto'
import WalletService from "../models/wallet.model"


export const generateRandom = () => {
    let random_byte = new Uint32Array(1)
    random_byte = getRandomValues(random_byte)

    let time = new Date().getTime().toString().substring(-3, 3)
    return `${random_byte}${time}`.padStart(15, '0')


}

export const resourceCreatedResponse = (data: any, response: Response) => {
    return response.status(201).send({
        mesaage: 'resource created successfully',
        result: data,
        statusCode: 201
    })
}

export const successResponse = (data: any, response: Response) => {
    return response.status(200).send({
        mesaage: 'Request Successful',
        result: data,
        statusCode: 200
    })
}


export const userErrResponse = (err: any, response: Response) => {
    return response.status(400).send({
        mesaage: 'An error occurred',
        result: err,
        statusCode: 400
    })
}

export const isEligible = (user: number, reqbal: number) => {
    return new Promise((resolve, reject) => {
        db.select<number>('balance')
            .from('wallets')
            .where('user_id', user)
            .first()
            .then(bal => {
                resolve(bal >= reqbal)
            })
            .catch(err => {
                console.log(err)
                reject(err)
            })

    })
}

export const hashPassword = (pwd) => {

    let salt = Crypto.randomBytes(16).toString('base64')
    let hash = Crypto.createHmac('sha512', salt).update(pwd).digest('base64')
    let password = salt + "$" + hash;

    return password

}
