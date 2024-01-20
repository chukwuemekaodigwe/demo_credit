"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validators_1 = __importDefault(require("./validators"));
const middlewares_1 = __importDefault(require("./middlewares"));
const controllers_1 = __importDefault(require("./controllers"));
const route = express_1.default.Router();
route.get('/', (req, res) => res.send(`Welcome to Demo Credit API`));
route.post('/users', validators_1.default.UserValidator.validationRules(), validators_1.default.UserValidator.hasValidFields, controllers_1.default.User.createUser);
route.get('/users/:id?/', [
    validators_1.default.ValidParams.validationRules(),
    validators_1.default.ValidParams.validParam,
    middlewares_1.default.auth.hasValidToken,
    controllers_1.default.User.singleUser
]);
route.patch('/users/:id?', validators_1.default.UserValidator.validationRules(), validators_1.default.UserValidator.hasValidFields, middlewares_1.default.auth.hasValidToken, controllers_1.default.User.updateUser);
route.delete('/users/:id?', [
    validators_1.default.ValidParams.validationRules(),
    validators_1.default.ValidParams.validParam,
    middlewares_1.default.auth.hasValidToken,
    controllers_1.default.User.deleteUser
]);
route.post('/login', validators_1.default.ValidLoginFields.validationRules(), validators_1.default.ValidLoginFields.hasValidFields, middlewares_1.default.auth.VerifyCredentials, controllers_1.default.Auth.login);
route.post('/wallets', [
    middlewares_1.default.auth.hasValidToken,
    middlewares_1.default.transactions.hasNoWallet,
    controllers_1.default.Wallet.createWallet
]);
/**
 * Used to access the auth user wallet
 */
route.get('/wallets', [
    middlewares_1.default.auth.hasValidToken,
    middlewares_1.default.transactions.hasWallet,
    controllers_1.default.Wallet.getUserWallet
]);
route.delete('/wallets', [
    middlewares_1.default.transactions.hasWallet,
    middlewares_1.default.auth.hasValidToken,
    controllers_1.default.Wallet.deleteWallet
]);
route.post('/transactions/deposit', validators_1.default.ValidTransactionFields.validationRules(), validators_1.default.ValidTransactionFields.hasValidFields, middlewares_1.default.auth.hasValidToken, middlewares_1.default.transactions.hasWallet, controllers_1.default.Transaction.addDeposit);
route.post('/transactions/withdraw', validators_1.default.ValidTransactionFields.validationRules(), validators_1.default.ValidTransactionFields.hasValidFields, middlewares_1.default.auth.hasValidToken, middlewares_1.default.transactions.hasWallet, middlewares_1.default.transactions.hasEnoughBal, controllers_1.default.Transaction.addWithdrawal);
route.post('/transactions/transfer', validators_1.default.ValidTransactionFields.validationRules(), validators_1.default.IsValidForTransfer(), validators_1.default.ValidTransactionFields.hasValidFields, middlewares_1.default.auth.hasValidToken, middlewares_1.default.transactions.hasWallet, middlewares_1.default.transactions.hasEnoughBal, controllers_1.default.Transaction.addTransfer);
route.get('/transactions/:id', [
    validators_1.default.ValidParams.validationRules(),
    validators_1.default.ValidParams.validParam,
    middlewares_1.default.auth.hasValidToken,
    middlewares_1.default.transactions.hasWallet,
    controllers_1.default.Transaction.getTransactionById
]);
route.get('/transactions', [
    middlewares_1.default.auth.hasValidToken,
    middlewares_1.default.transactions.hasWallet,
    controllers_1.default.Transaction.getUserTransactions
]);
route.delete('/transactions/:id', [
    validators_1.default.ValidParams.validationRules(),
    validators_1.default.ValidParams.validParam,
    middlewares_1.default.auth.hasValidToken,
    middlewares_1.default.transactions.hasWallet,
    controllers_1.default.Transaction.deleteTransaction
]);
route.get('/wallets/:id', [
    validators_1.default.ValidParams.validationRules(),
    validators_1.default.ValidParams.validParam,
    middlewares_1.default.auth.hasValidToken,
    controllers_1.default.Wallet.getWalletById
]);
exports.default = route;
