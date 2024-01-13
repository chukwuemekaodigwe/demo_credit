import Transaction from '../interfaces/transaction.interface'
import Wallet from '../interfaces/wallet.interface'
import TransactionService from '../models/transaction.model'
import WalletService from '../models/wallet.model'
import { successResponse, resourceCreatedResponse, isEligible, userErrResponse } from '../helpers/util'

type Data = Wallet & Transaction
const DEPOSIT = 1
const WITHDRWAL = 2
const TRANSFER = 3

export default {

    addDeposit: (req, res, next) => {
        const user = req.body.user_id
        const timestamp = new Date().getTime().toString()
        const model = new TransactionService()
        const data: Transaction = {
            user_id: user,
            transactiontype: DEPOSIT,
            amount: (req.body.amount),
            transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
            comment: `${req.body.comments}`
        }
        model.AddTransaction(data).then(result => {
            resourceCreatedResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },


    addWithdrawal: (req, res, next) => {

        const user = req.body.user_id
        isEligible(user, req.body.amount).then(() => {
            const timestamp = new Date().getTime().toString()
            const model = new TransactionService()

            const data: Transaction = {
                user_id: user,
                transactiontype: WITHDRWAL,
                amount: -(req.body.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Withdrawal by user, Comment: ${req.body.comments}`
            }

            model.AddTransaction(data).then(async (result: number) => {
                resourceCreatedResponse(result, res)
            })
                .catch(err => {
                    next(err)
                })

        }).catch(() => {
            userErrResponse('You dont have effor balance to perform ths transaction', res)
        })
    },

    addTransfer: (req, res, next) => {

        const user = 1 //req.jwt.user

        const timestamp = new Date().getTime().toString()
        const model = new TransactionService()

        isEligible(user, req.body.amount).then(() => {
            const data: Transaction = {
                user_id: user,
                transactiontype: TRANSFER,
                amount: -(req.body.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Transfered by user `, //: ${req.jwt.email},\n\r ${req.body.comments}`,
                beneficiary: req.body.beneficiary,
            }

            model.AddTransaction(data).then(result => {
                model.AddTransaction({
                    ...data,
                    user_id: req.body.beneficiary,
                    amount: req.body.amount,
                    beneficiary: undefined,
                    //comments: `Sent by ${wallet.name}`
                })
                resourceCreatedResponse(result, res)
            })
                .catch(err => {
                    next(err)
                })
        })
            .catch(() => {
                userErrResponse('You dont have enough balance to perform this action', res)
            })
    },

    getUserTransactions: (req, res, next) => {
        const user = req.params.user
        const model = new TransactionService()
        model.ReadResource({ user_id: user }).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    getTransactionById: (req, res, next) => {
        const user = req.params.id
        const model = new TransactionService()
        model.ReadSingleResource({ id: user }).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },


    // updateTransaction: (req, res, next) => {
    //     const model = new TransactionService()
    //     const id = req.params.id
    //     const data:Transaction = {
    //         user_id: req.body.user,
    //         transactionId: req.body.transId,
    //         amount: req.body.amount,
    //         comment: req.body.comments,
    //         transactiontype: req.body.type
    //     }
    //     model.UpdateResource({ id: id }, data).then(result => {
    //         successResponse(result, res)
    //     })
    //         .catch(err => {
    //             next(err)
    //             console.log(err)
    //         })
    // },

    deleteTransaction: (req, res, next) => {
        const model = new TransactionService()
        model.DeleteResource({ id: req.params.id }).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

}