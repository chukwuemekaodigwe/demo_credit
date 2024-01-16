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

    getWalletById: (req: Request&any, res: Response, next: NextFunction) => {
        const id = req.params.id
        const user = req.jwt.user
        model.ReadSingleResource({ id: id , user_id: user})
            .then(result => {
                return successResponse(result, res)
            })
            .catch(err => {
                next(err)
            })
    },

    deleteWallet: (req: Request&any, res: Response, next: NextFunction) => {
        const wallet = req.params.id
        const user = req.jwt.user
        model.DeleteResource({ id: wallet, user_id: user })
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