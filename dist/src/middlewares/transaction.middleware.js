"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasEnoughBal = exports.hasNoWallet = exports.hasWallet = void 0;
const express_validator_1 = require("express-validator");
const util_1 = require("../helpers/util");
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const model = new wallet_model_1.default();
const hasWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.jwt.user;
    model.ReadSingleResource({ user_id: user })
        .then((result) => {
        if (!result) {
            return (0, util_1.errResponse)({
                errtype: 'Not found',
                message: 'You have no wallet account yet, please create one to continue',
                statusCode: 404,
                response: res
            });
        }
        return next();
    })
        .catch((error) => {
        next(error);
    });
});
exports.hasWallet = hasWallet;
const hasNoWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.jwt.user;
    model.ReadSingleResource({ user_id: user })
        .then((result) => {
        if (!result) {
            return next();
        }
        else {
            return (0, util_1.errResponse)({
                errtype: 'Invalid Request',
                message: 'You can only open one wallet',
                statusCode: 400,
                response: res
            });
        }
    })
        .catch((error) => {
        next(error);
    });
});
exports.hasNoWallet = hasNoWallet;
const hasEnoughBal = (req, res, next) => {
    const reqData = (0, express_validator_1.matchedData)(req);
    const user = req.jwt.user;
    model.ReadSingleResource({ user_id: user }).then((result) => {
        if (result.balance >= reqData.amount) {
            next();
        }
        else {
            console.log({ 'bal': user });
            return (0, util_1.errResponse)({
                errtype: 'Invalid Request',
                message: 'You dont have enough balance to perform this transaction',
                statusCode: 400,
                response: res
            });
        }
    })
        .catch((error) => {
        next(error);
    });
};
exports.hasEnoughBal = hasEnoughBal;
