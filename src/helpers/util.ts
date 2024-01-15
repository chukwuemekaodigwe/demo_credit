import { getRandomValues } from "crypto"
import { Response } from "express"
import db from '../database/connection'
import * as Crypto from 'node:crypto'
import WalletService from "../models/wallet.model"
import Wallet from "../interfaces/wallet.interface"
import Transaction from "../interfaces/transaction.interface"

import { RequestHandler } from 'express'


export const generateRandom = (): string => {
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

export const errResponse = ({ errtype, message, statusCode, response }: { errtype: string, message: string | Array<any>, statusCode: number, response: Response }) => {

    return response.status(statusCode).send({
        status: statusCode,
        error: errtype,
        message: message
    })
}

/**
 * JSON 404 response
 */


export const fourOhFour:RequestHandler = (_req: any, response: Response) => {
    return response.status(404).send({
        status: 404,
        error: 'Resource not found',
        
    })
}


export const hashPassword = (pwd): string => {

    let salt = Crypto.randomBytes(16).toString('base64')
    let hash = Crypto.createHmac('sha512', salt).update(pwd).digest('base64')
    let password = salt + "$" + hash;

    return password

}

export const getUserFromWalletId = (walletId: number): Promise<Wallet> => {
    const model = new WalletService()
    return new Promise((resolve, reject) => {
        
        model.ReadSingleResource({ walletId: walletId })
            .then((result) => {
                
                resolve(result)
            })
            .catch((err) => {
                //console.log(err)
                reject(err)
            })
    })
}

export const formatResult = (record : Transaction | Array<Transaction>) => {
    if(Array.isArray(record)){
        return record.map((el)=>{
            el.beneficiary
        })
    }
}