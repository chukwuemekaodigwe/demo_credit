import express, { Express } from "express";
import walletController from "./controllers/wallet.controller";
import transactionController from './controllers/transaction.controller'
import userController from './controllers/user.controller'

const route = express.Router()

route.post('/wallets', walletController.createWallet)
route.get('/wallets/:id', walletController.getWalletById)
route.get('/wallets/user/:user', walletController.getUserWallet)
route.delete('/wallets/:id', walletController.deleteWallet)

route.post('/transactions/deposit', transactionController.addDeposit)
route.post('/transactions/withdraw', transactionController.addWithdrawal)
route.post('/transactions/transfer', transactionController.addTransfer)
route.get('/transactions/:id', transactionController.getTransactionById)
route.get('/transactions/user/:user', transactionController.getUserTransactions)
//route.patch('/transactions/:id', transactionController.updateTransaction)
route.delete('/transactions/:id', transactionController.deleteTransaction)

route.post('/users', userController.createUser)
route.get('/users/:id', userController.singleUser)
route.patch('/users/:id', userController.updateUser)
route.delete('/users/:id', userController.deleteUser)

export default route