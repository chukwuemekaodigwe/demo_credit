import express, { Express } from "express";
import Validator from './validators'
import Middleware from './middlewares';
import Controller from './controllers'

const route = express.Router()

route.get('/', (req, res) => res.send(`Welcome to Demo Credit API`))
route.post('/users',
    Validator.UserValidator.validationRules(),
    Validator.UserValidator.hasValidFields,
    Controller.User.createUser
)
route.get('/users/:id?/', [
    Validator.ValidParams.validationRules(),
    Validator.ValidParams.validParam,
    Middleware.auth.hasValidToken,
    Controller.User.singleUser
])

route.patch('/users/:id?', 
    Validator.UserValidator.validationRules(),
    Validator.UserValidator.hasValidFields,
    Middleware.auth.hasValidToken,
    Controller.User.updateUser
)
route.delete('/users/:id?', [
    Validator.ValidParams.validationRules(),
    Validator.ValidParams.validParam,
    Middleware.auth.hasValidToken,
    Controller.User.deleteUser
])


route.post('/login',
    Validator.ValidLoginFields.validationRules(),
    Validator.ValidLoginFields.hasValidFields,
    Middleware.auth.VerifyCredentials,
    Controller.Auth.login
)

route.post('/wallets', [
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasNoWallet,
    Controller.Wallet.createWallet
])

/**
 * Used to access the auth user wallet
 */
route.get('/wallets', [
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Controller.Wallet.getUserWallet
])

route.delete('/wallets', [
    Middleware.transactions.hasWallet,
    Middleware.auth.hasValidToken,
    Controller.Wallet.deleteWallet
])

route.post('/transactions/deposit',
    Validator.ValidTransactionFields.validationRules(),
    Validator.ValidTransactionFields.hasValidFields,
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Controller.Transaction.addDeposit
)
route.post('/transactions/withdraw',
    Validator.ValidTransactionFields.validationRules(),
    Validator.ValidTransactionFields.hasValidFields,
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Middleware.transactions.hasEnoughBal,
    Controller.Transaction.addWithdrawal
)
route.post('/transactions/transfer',
    Validator.ValidTransactionFields.validationRules(),
    Validator.IsValidForTransfer(),
    Validator.ValidTransactionFields.hasValidFields,
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Middleware.transactions.hasEnoughBal,
    Controller.Transaction.addTransfer
)
route.get('/transactions/:id', [
    Validator.ValidParams.validationRules(),
    Validator.ValidParams.validParam,
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Controller.Transaction.getTransactionById
])

route.get('/transactions', [
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Controller.Transaction.getUserTransactions
])

route.delete('/transactions/:id', [
    Validator.ValidParams.validationRules(),
    Validator.ValidParams.validParam,
    Middleware.auth.hasValidToken,
    Middleware.transactions.hasWallet,
    Controller.Transaction.deleteTransaction
])


route.get('/wallets/:id', [
    Validator.ValidParams.validationRules(),
    Validator.ValidParams.validParam,
    Middleware.auth.hasValidToken,
    Controller.Wallet.getWalletById
])

export default route