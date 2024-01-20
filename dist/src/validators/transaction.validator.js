"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const util_1 = require("../helpers/util");
exports.default = {
    validationRules: () => {
        return [
            (0, express_validator_1.body)('amount').isNumeric().isFloat({ min: 0 }).notEmpty(),
            (0, express_validator_1.body)('comments').isString().notEmpty().optional()
        ];
    },
    hasValidFields: (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            next();
        }
        else {
            console.log(errors);
            return (0, util_1.errResponse)({
                errtype: 'Invalid fields',
                message: errors.array(),
                statusCode: 400,
                response: res
            });
        }
    },
    IsValidForTransfer: () => {
        return (0, express_validator_1.body)('beneficiary').notEmpty().isNumeric().isLength({ min: 15, max: 15 }).withMessage('The beneficiary wallet Id is needed. It should be 15 characters length');
    }
};
