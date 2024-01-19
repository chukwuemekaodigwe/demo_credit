import Transaction from '../interfaces/transaction.interface'
import Wallet from '../interfaces/wallet.interface'
import TransactionService from '../models/transaction.model'
import { successResponse, resourceCreatedResponse, getUserFromWalletId, getWalletFromUserId, errResponse } from '../helpers/util'
import { Request, Response, NextFunction } from 'express'
import { matchedData } from 'express-validator'

type Data = Wallet & Transaction
const DEPOSIT = 1
const WITHDRWAL = 2
const TRANSFER = 3

export default {
    addDeposit: (req: Request & any, res: Response, next: NextFunction) => {
        const reqData = matchedData(req)  // accessing the santized data from 'express-validator'
        const user = req.jwt.user // user_id from the jsonwebtoken decrypted crdentials
        const timestamp = new Date().getTime().toString()
        const model = new TransactionService()
        getWalletFromUserId(user).then(wallet => {

            const data: Transaction = {
                user_id: user,
                transactiontype: DEPOSIT,
                amount: (reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Deposit by User | ${reqData.comments}`,
                beneficiary: wallet.walletId
            }
            model.AddTransaction(data).then(result => {
                resourceCreatedResponse(result, res)
            })
                .catch(err => {
                    next(err)
                })
        }).catch(err => {
            next(err)
        })
    },


    addWithdrawal: (req: Request & any, res: Response, next: NextFunction) => {
        const reqData = matchedData(req)
        const user = req.jwt.user
        const timestamp = new Date().getTime().toString()
        const model = new TransactionService()
        getWalletFromUserId(user).then(wallet => {

            const data: Transaction = {
                user_id: user,
                transactiontype: WITHDRWAL,
                amount: -(reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Withdrawal by user, Comment: ${reqData.comments}`,
                beneficiary: wallet.walletId
            }
            model.AddTransaction(data).then((result) => {
                resourceCreatedResponse(result, res)
            })
                .catch(err => {
                    next(err)
                })
        })
            .catch(err => {
                next(err)
            })
    },


    addTransfer: (req: Request & any, res: Response, next: NextFunction) => {
        const reqData = matchedData(req)
        const user = req.jwt.user
        const timestamp = new Date().getTime().toString()
        const model = new TransactionService()

        getUserFromWalletId(reqData.beneficiary).then(beneficiary => {
            const data: Transaction = {
                user_id: user,
                transactiontype: TRANSFER,
                amount: -(reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `${reqData.comments}`,
                beneficiary: beneficiary.walletId,
            }
            model.AddTransaction(data).then(result => {
                model.AddTransaction({
                    ...data,
                    user_id: beneficiary.user_id,
                    amount: reqData.amount,
                    beneficiary: undefined,
                    comment: `Transfer Sent by ${req.jwt.email} | ${reqData.comments}`
                }).then(result2 => result2)

                return resourceCreatedResponse(result, res)

            })
                .catch(err => {
                    next(err)
                })
        })
            .catch(err => {
                return errResponse({
                    errtype: 'Invalid Request' + err,
                    message: 'Beneficiary not found, please cross check wallet Id',
                    statusCode: 400,
                    response: res
                })
            })
    },

    getUserTransactions: (req: Request & any, res: Response, next: NextFunction) => {
        const user = req.params.user ? req.params.user : req.jwt.user
        const model = new TransactionService()
        model.ReadResource({ user_id: user }).then(result => {

            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    getTransactionById: (req: Request & any, res: Response, next: NextFunction) => {
        const id = req.params.id
        const user = req.jwt.user
        const model = new TransactionService()
        model.ReadSingleResource({ id: id, user_id: user }).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    deleteTransaction: (req: Request & any, res: Response, next: NextFunction) => {
        const model = new TransactionService()
        const user = req.jwt.user

        model.DeleteResource({ id: req.params.id, user_id: user }).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

}