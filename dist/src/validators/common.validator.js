"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const util_1 = require("../helpers/util");
exports.default = {
    validationRules: () => {
        return (0, express_validator_1.param)('*').notEmpty().isNumeric().optional();
    },
    validParam: (req, res, next) => {
        const err = (0, express_validator_1.validationResult)(req);
        if (err.isEmpty()) {
            next();
        }
        else {
            return (0, util_1.errResponse)({
                errtype: 'Invalid parameter',
                message: err.array(),
                statusCode: 404,
                response: res
            });
        }
    },
};
