import { Request, Response, NextFunction } from 'express'
import WalletService from '../models/wallet.model'
import Wallet from '../interfaces/wallet.interface'
import { generateRandom, resourceCreatedResponse, successResponse } from '../helpers/util'

const model = new WalletService()

export default {
    createWallet: (req: Request & any, res: Response, next: NextFunction) => {
        const user = req.jwt.user
        const data: Wallet = {
            user_id: user,
            walletId: generateRandom(),
            balance: 0.00
        }
        model.CreateResource(data)
            .then(result => {
                return resourceCreatedResponse(result, res)
            })
            .catch(err => {
                next(err)
            })
    },

    getUserWallet: (req: Request & any, res: Response, next: NextFunction) => {
        const user = req.params.user ? req.params.user : req.jwt.user
        model.ReadSingleResource({ user_id: user })
            .then(result => {
                return successResponse(result, res)
            })
            .catch(err => {
                next(err)
            })
    },

    getWalletById: (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id
        model.ReadSingleResource({ id: id })
            .then(result => {
                return successResponse(result, res)
            })
            .catch(err => {
                next(err)
            })
    },

    deleteWallet: (req: Request, res: Response, next: NextFunction) => {
        const wallet = req.params.id
        model.DeleteResource({ id: wallet })
            .then(result => {
                return successResponse(result, res)
            })
            .catch(err => {
                next(err)
            })
    },

    // getWallets(req, res, next) {
    //     
    //     model.ReadResource().then(result => {
    //         return successResponse(result, res)
    //     })
    //         .catch(err => [
    //             next(err)
    //         ])
    // }

}