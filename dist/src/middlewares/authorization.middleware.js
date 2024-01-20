"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValidToken = exports.VerifyCredentials = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const user_model_1 = __importDefault(require("../models/user.model"));
const util_1 = require("../helpers/util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../helpers/config"));
const express_validator_1 = require("express-validator");
const model = new user_model_1.default();
const VerifyCredentials = (req, res, next) => {
    const reqData = (0, express_validator_1.matchedData)(req);
    const username = reqData.username;
    const password = reqData.password;
    model.ReadSingleResource({ email: username }).then((result) => {
        if (!result) {
            return (0, util_1.errResponse)({
                errtype: 'Authentication Error',
                message: 'Invalid Authentication',
                statusCode: 401,
                response: res
            });
        }
        else {
            let passwordFields = result.password.split('$');
            let salt = passwordFields[0];
            let hash = node_crypto_1.default.createHmac('sha512', salt).update(password).digest("base64");
            if (hash === passwordFields[1]) {
                /**
                 * req.token for jwtToken generation
                 * Accessed and generated at authorization controller
                 * */
                req.token = result;
                return next();
            }
            else {
                return (0, util_1.errResponse)({
                    errtype: 'Authentication Error',
                    message: 'Invalid Authentication',
                    statusCode: 401,
                    response: res
                });
            }
        }
    });
};
exports.VerifyCredentials = VerifyCredentials;
const hasValidToken = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return (0, util_1.errResponse)({
                    errtype: 'Authentication Error',
                    message: 'Invalid Authentication',
                    statusCode: 401,
                    response: res
                });
            }
            else {
                req.jwt = jsonwebtoken_1.default.verify(authorization[1], config_1.default.jwtSecret);
                return next();
            }
        }
        catch (err) {
            return (0, util_1.errResponse)({
                errtype: 'Authorization Error',
                message: 'Invalid token',
                statusCode: 403,
                response: res
            });
        }
    }
    else {
        return (0, util_1.errResponse)({
            errtype: 'Authentication Error',
            message: 'Invalid Authentication',
            statusCode: 401,
            response: res
        });
    }
};
exports.hasValidToken = hasValidToken;
