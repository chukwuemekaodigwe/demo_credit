"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUserResource = exports.CreateUserAndWalletForTest = exports.CreateUserForTest = exports.formatResult = exports.getWalletFromUserId = exports.getUserFromWalletId = exports.signJwt = exports.hashPassword = exports.fourOhFour = exports.errResponse = exports.successResponse = exports.resourceCreatedResponse = exports.generateRandom = void 0;
const crypto_1 = require("crypto");
const Crypto = __importStar(require("node:crypto"));
const wallet_model_1 = __importDefault(require("../models/wallet.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const generateRandom = () => {
    let random_byte = new Uint32Array(1);
    random_byte = (0, crypto_1.getRandomValues)(random_byte);
    let time = new Date().getTime().toString().substring(-3, 3);
    return `${random_byte}${time}`.padStart(15, '0');
};
exports.generateRandom = generateRandom;
const resourceCreatedResponse = (data, response) => {
    return response.status(201).send({
        mesaage: 'resource created successfully',
        result: data,
        statusCode: 201
    });
};
exports.resourceCreatedResponse = resourceCreatedResponse;
const successResponse = (data, response) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        return response.status(404).send({
            message: 'No Result Found',
            statusCode: 404
        });
    }
    return response.status(200).send({
        message: 'Request Successful',
        result: data,
        statusCode: 200
    });
};
exports.successResponse = successResponse;
const errResponse = ({ errtype, message, statusCode, response }) => {
    return response.status(statusCode).send({
        status: statusCode,
        error: errtype,
        message: message
    });
};
exports.errResponse = errResponse;
/**
 * JSON 404 response
 */
const fourOhFour = (_req, response) => {
    return response.status(404).send({
        status: 404,
        error: 'Resource not found',
    });
};
exports.fourOhFour = fourOhFour;
const hashPassword = (pwd) => {
    let salt = Crypto.randomBytes(16).toString('base64');
    let hash = Crypto.createHmac('sha512', salt).update(pwd).digest('base64');
    let password = salt + "$" + hash;
    return password;
};
exports.hashPassword = hashPassword;
const signJwt = (user) => {
    const data = {
        user: user.id,
        email: user.email,
        provider: 'email'
    };
    let token = jsonwebtoken_1.default.sign(data, config_1.default.jwtSecret);
    return token;
};
exports.signJwt = signJwt;
const getUserFromWalletId = (walletId) => {
    const model = new wallet_model_1.default();
    return new Promise((resolve, reject) => {
        model.ReadSingleResource({ walletId: walletId })
            .then((result) => {
            resolve(result);
        })
            .catch((err) => {
            //console.log(err)
            reject(err);
        });
    });
};
exports.getUserFromWalletId = getUserFromWalletId;
const getWalletFromUserId = (userId) => {
    const model = new wallet_model_1.default();
    return new Promise((resolve, reject) => {
        model.ReadSingleResource({ user_id: userId })
            .then((result) => {
            resolve(result);
        })
            .catch((err) => {
            //console.log(err)
            reject(err);
        });
    });
};
exports.getWalletFromUserId = getWalletFromUserId;
const formatResult = (record) => {
    const transactiontypes = ['Deposit', 'Withdrawal', 'Transfer'];
    if (Array.isArray(record)) {
        return record.map((el) => {
            //el.transactiontype = transactiontypes[el.transactiontype - 1]
        });
    }
};
exports.formatResult = formatResult;
const CreateUserForTest = (data) => {
    return new Promise((resolve, reject) => {
        const model = new user_model_1.default();
        model.CreateResource(data)
            .then(user => {
            resolve(user);
        })
            .catch(err => {
            reject(err);
        });
    });
};
exports.CreateUserForTest = CreateUserForTest;
const CreateUserAndWalletForTest = (data) => {
    return new Promise((resolve, reject) => {
        (0, exports.CreateUserForTest)(data).then((result) => {
            const newWallet = {
                user_id: result.id,
                walletId: (0, exports.generateRandom)(),
                balance: 200.00
            };
            const walletModel = new wallet_model_1.default();
            walletModel.CreateResource(newWallet)
                .then((res) => {
                resolve(Object.assign(Object.assign({}, res), result));
            })
                .catch((err) => {
                reject(err);
            });
        });
    });
};
exports.CreateUserAndWalletForTest = CreateUserAndWalletForTest;
const DeleteUserResource = (userid) => {
    return new Promise((resolve, reject) => {
        const usermodel = new user_model_1.default();
        const walletmodel = new wallet_model_1.default();
        const transactionmodel = new transaction_model_1.default();
        usermodel.DeleteResource({ id: userid });
        walletmodel.DeleteResource({ user_id: userid });
        transactionmodel.DeleteResource({ user_id: userid });
        resolve(true);
    });
};
exports.DeleteUserResource = DeleteUserResource;
