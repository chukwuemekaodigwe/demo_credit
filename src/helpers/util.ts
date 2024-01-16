import { getRandomValues } from "crypto"
import { Response } from "express"
import * as Crypto from 'node:crypto'
import Transaction from "../interfaces/transaction.interface"
import Wallet from "../interfaces/wallet.interface"
import WalletService from "../models/wallet.model"
import UserService from "../models/user.model"
import { RequestHandler } from 'express'
import User from "../interfaces/user.interface"
import TransactionService from "../models/transaction.model"
import jwt from 'jsonwebtoken'
import Config from './config'

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
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return response.status(404).send({
            message: 'No Result Found',
            statusCode: 404
        });
    }

    return response.status(200).send({
        message: 'Request Successful',
        result: data,
        statusCode: 200
    });
};


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

export const signJwt = (user: User): string => {
    const data = {
        user: user.id,
        email: user.email,
        provider: 'email'
    };
    let token = jwt.sign(data, Config.jwtSecret);
    return token
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
    const transactiontypes = ['Deposit', 'Withdrawal', 'Transfer']
    if(Array.isArray(record)){
        return record.map((el)=>{
            //el.transactiontype = transactiontypes[el.transactiontype - 1]
        })
    }
}

export const CreateUserForTest = (data:User): Promise<User> => {
    return new Promise((resolve, reject)=>{
        const model = new UserService()
        model.CreateResource(data)
        .then(user =>{
            resolve(user)
        })
        .catch(err=>{
            reject(err)
        })       
    })
}

export const CreateUserAndWalletForTest = (data: User):Promise<User&Wallet> => {
    return new Promise((resolve, reject) => {
        CreateUserForTest(data).then((result)=>{
            const newWallet:Wallet = {
                user_id: result.id,
                walletId: generateRandom(),
                balance: 200.00
            }
            const walletModel = new WalletService()
            walletModel.CreateResource(newWallet)
            .then((res)=>{
                resolve({...res, ...result})
            })
            .catch((err)=>{
                reject(err)
            })
        })
    })
}

export const DeleteUserResource = (userid:number) => {
    return new Promise((resolve, reject) => {
        const usermodel = new UserService()
        const walletmodel = new WalletService()
        const transactionmodel = new TransactionService()

        usermodel.DeleteResource({id: userid})
        walletmodel.DeleteResource({user_id: userid})
        transactionmodel.DeleteResource({user_id: userid})

        resolve(true)
    })
}