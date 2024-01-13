import express, { Express } from "express";
import walletController from "./controllers/wallet.controller";
import transactionController from './controllers/transaction.controller'


const route = express.Router()

route.post('/wallets', walletController.createWallet)
route.get('/wallets/', walletController.getWallets)
route.get('/wallets/:id', walletController.getWalletById)
route.get('/wallets/user/:id', walletController.getUserWallet)
route.patch('/wallets/:id', walletController.createWallet)
route.delete('/wallets/:id', walletController.deleteWallet)
route.post('/transactions/deposit', transactionController.addDeposit)
route.post('/transactions/withdraw', transactionController.addWithdrawal)
route.post('/transactions/transfer', transactionController.addTransfer)
route.get('/transactions', transactionController.getUserTransactions)
route.patch('/transactions/:id', transactionController.updateTransaction)
route.delete('/transactions/:id', transactionController.deleteTransaction)


export default route