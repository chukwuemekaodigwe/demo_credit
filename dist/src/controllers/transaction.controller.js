"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const util_1 = require("../helpers/util");
const express_validator_1 = require("express-validator");
const DEPOSIT = 1;
const WITHDRWAL = 2;
const TRANSFER = 3;
exports.default = {
    addDeposit: (req, res, next) => {
        const reqData = (0, express_validator_1.matchedData)(req); // accessing the santized data from 'express-validator'
        const user = req.jwt.user; // user_id from the jsonwebtoken decrypted crdentials
        const timestamp = new Date().getTime().toString();
        const model = new transaction_model_1.default();
        (0, util_1.getWalletFromUserId)(user).then(wallet => {
            const data = {
                user_id: user,
                transactiontype: DEPOSIT,
                amount: (reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Deposit by User | ${reqData.comments}`,
                beneficiary: wallet.walletId
            };
            model.AddTransaction(data).then(result => {
                (0, util_1.resourceCreatedResponse)(result, res);
            })
                .catch(err => {
                next(err);
            });
        }).catch(err => {
            next(err);
        });
    },
    addWithdrawal: (req, res, next) => {
        const reqData = (0, express_validator_1.matchedData)(req);
        const user = req.jwt.user;
        const timestamp = new Date().getTime().toString();
        const model = new transaction_model_1.default();
        (0, util_1.getWalletFromUserId)(user).then(wallet => {
            const data = {
                user_id: user,
                transactiontype: WITHDRWAL,
                amount: -(reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `Withdrawal by user, Comment: ${reqData.comments}`,
                beneficiary: wallet.walletId
            };
            model.AddTransaction(data).then((result) => {
                (0, util_1.resourceCreatedResponse)(result, res);
            })
                .catch(err => {
                next(err);
            });
        })
            .catch(err => {
            next(err);
        });
    },
    addTransfer: (req, res, next) => {
        const reqData = (0, express_validator_1.matchedData)(req);
        const user = req.jwt.user;
        const timestamp = new Date().getTime().toString();
        const model = new transaction_model_1.default();
        (0, util_1.getUserFromWalletId)(reqData.beneficiary).then(beneficiary => {
            const data = {
                user_id: user,
                transactiontype: TRANSFER,
                amount: -(reqData.amount),
                transactionId: `#${user}${timestamp}`, // Combining user_id and timestamp to ensure it's unique and simple
                comment: `${reqData.comments}`,
                beneficiary: beneficiary.walletId,
            };
            model.AddTransaction(data).then(result => {
                model.AddTransaction(Object.assign(Object.assign({}, data), { user_id: beneficiary.user_id, amount: reqData.amount, beneficiary: undefined, comment: `Transfer Sent by ${req.jwt.email} | ${reqData.comments}` })).then(result2 => result2);
                return (0, util_1.resourceCreatedResponse)(result, res);
            })
                .catch(err => {
                next(err);
            });
        })
            .catch(err => {
            return (0, util_1.errResponse)({
                errtype: 'Invalid Request' + err,
                message: 'Beneficiary not found, please cross check wallet Id',
                statusCode: 400,
                response: res
            });
        });
    },
    getUserTransactions: (req, res, next) => {
        const user = req.params.user ? req.params.user : req.jwt.user;
        const model = new transaction_model_1.default();
        model.ReadResource({ user_id: user }).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    getTransactionById: (req, res, next) => {
        const id = req.params.id;
        const user = req.jwt.user;
        const model = new transaction_model_1.default();
        model.ReadSingleResource({ id: id, user_id: user }).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    deleteTransaction: (req, res, next) => {
        const model = new transaction_model_1.default();
        const user = req.jwt.user;
        model.DeleteResource({ id: req.params.id, user_id: user }).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
};
