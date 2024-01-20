"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const util_1 = require("../helpers/util");
const express_validator_1 = require("express-validator");
const model = new user_model_1.default();
exports.default = {
    createUser: (req, res, next) => {
        const reqData = (0, express_validator_1.matchedData)(req, { locations: ['body'] });
        const data = {
            firstname: reqData.firstname,
            lastname: reqData.lastname,
            phone: reqData.phone,
            email: reqData.email,
            password: (0, util_1.hashPassword)(reqData.password)
        };
        model.CreateResource(data).then((result) => {
            (0, util_1.resourceCreatedResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    singleUser: (req, res, next) => {
        const id = req.params.id;
        const user = req.jwt.user;
        model.ReadSingleResource({ id: user }).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => { next(err); });
    },
    updateUser: (req, res, next) => {
        const reqData = (0, express_validator_1.matchedData)(req, { locations: ['body'] });
        const data = {
            firstname: reqData.firstname,
            lastname: reqData.lastname,
            phone: reqData.phone,
            password: (0, util_1.hashPassword)(reqData.password),
        };
        const id = req.params.id;
        const user = req.jwt.user;
        model.UpdateResource({ id: user }, data).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
    deleteUser: (req, res, next) => {
        const id = req.params.id;
        const user = req.jwt.user;
        model.DeleteResource({ id: user }).then(result => {
            (0, util_1.successResponse)(result, res);
        })
            .catch(err => {
            next(err);
        });
    },
};
