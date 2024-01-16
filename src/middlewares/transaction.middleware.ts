import { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { errResponse } from "../helpers/util";
import WalletService from "../models/wallet.model";


const model = new WalletService()
export const hasWallet = async (req, res, next) => {
    const user = req.jwt.user
    model.ReadSingleResource({ user_id: user })
    .then((result) => {
         if (!result) {
            return errResponse({
                errtype: 'Not found',
                message: 'You have no wallet account yet, please create one to continue',
                statusCode: 404,
                response: res
            })
         }
         return next()
     })
         .catch((error) => {
             next(error)
         })
 }
 

 export const hasNoWallet = async (req, res, next) => {
    const user = req.jwt.user
    model.ReadSingleResource({ user_id: user })
    .then((result) => {
         if (!result) {
            
         return next()
         }else{
            return errResponse({
                errtype: 'Invalid Request',
                message: 'You can only open one wallet',
                statusCode: 400,
                response: res
            })
         }
     })
         .catch((error) => {
             next(error)
         })
 }


export const hasEnoughBal = (req:Request&any, res:Response, next:NextFunction) => {
    const reqData = matchedData(req)
    const user = req.jwt.user
    model.ReadSingleResource({user_id: user}).then((result)=>{
        if(result.balance >= reqData.amount){
            next()
        }else{
            return errResponse({
                errtype: 'Invalid Request',
                message: 'You dont have enough balance to perform this transaction',
                statusCode: 400,
                response: res
            })
        }
    })
    .catch((error)=>{
        next(error)
    })
}