"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const util_1 = require("../helpers/util");
exports.default = {
    validationRules: () => {
        return [
            (0, express_validator_1.body)('username').isEmail().notEmpty(),
            (0, express_validator_1.body)('password').notEmpty().escape()
        ];
    },
    hasValidFields: (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            next();
        }
        else {
            return (0, util_1.errResponse)({
                errtype: 'Invalid fields',
                message: errors.array(),
                statusCode: 400,
                response: res
            });
        }
    },
};
