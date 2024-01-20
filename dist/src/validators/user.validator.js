"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const util_1 = require("../helpers/util");
exports.default = {
    validationRules: () => {
        return [
            (0, express_validator_1.body)('firstname').isString().notEmpty().trim().isLength({ min: 1 }),
            (0, express_validator_1.body)('lastname').isString().notEmpty().trim().isLength({ min: 1 }),
            (0, express_validator_1.body)('email').isEmail().notEmpty().trim().isLength({ min: 1 }),
            (0, express_validator_1.body)('password').notEmpty().trim().isLength({ min: 1 }),
            (0, express_validator_1.body)('phone').notEmpty().trim().isLength({ min: 1 })
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
