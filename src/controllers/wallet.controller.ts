import WalletService from '../models/wallet.model'
import Wallet from '../interfaces/wallet.interface'
import { generateRandom, resourceCreatedResponse, successResponse } from '../helpers/util'

export default {
    createWallet(req, res, next) {
        const walletService = new WalletService()
        const data: Wallet = {
            user_id: 1,
            walletId: generateRandom(),
            balance: 0.00
        }
        walletService.CreateResource(data).then(result => {
            return resourceCreatedResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    getUserWallet(req, res, next) {
        //const user = req.jwt.user
        const user = req.params.user
        const walletService = new WalletService()
        walletService.ReadSingleResource({ user_id: user }).then(result => {
            return successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    getWalletById(req, res, next) {
        //const user = req.jwt.user
        const id = req.params.id
        const walletService = new WalletService()
        walletService.ReadSingleResource({ id: id }).then(result => {
            return successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    deleteWallet(req, res, next) {
        const wallet = req.params.id
        const walletService = new WalletService()
        walletService.DeleteResource({ id: wallet }).then(result => {
            return successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    // getWallets(req, res, next) {
    //     const walletService = new WalletService()
    //     walletService.ReadResource().then(result => {
    //         return successResponse(result, res)
    //     })
    //         .catch(err => [
    //             next(err)
    //         ])
    // }

}