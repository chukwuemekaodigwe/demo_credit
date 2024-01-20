"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const util_1 = require("../helpers/util");
const model = new wallet_model_1.default();
exports.default = {
    createWallet: (req, res, next) => {
        const user = req.jwt.user;
        const data = {
            user_id: user,
            walletId: (0, util_1.generateRandom)(),
            balance: 0.00
        };
        model.CreateResource(data)
            .then(result => {
            return (0, util_1.resourceCreatedResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    getUserWallet: (req, res, next) => {
        const user = req.params.user ? req.params.user : req.jwt.user;
        model.ReadSingleResource({ user_id: user })
            .then(result => {
            return (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    getWalletById: (req, res, next) => {
        const id = req.params.id;
        const user = req.jwt.user;
        model.ReadSingleResource({ id: id, user_id: user })
            .then(result => {
            return (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    deleteWallet: (req, res, next) => {
        const wallet = req.params.id;
        const user = req.jwt.user;
        model.DeleteResource({ user_id: user })
            .then(result => {
            return (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
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
};
