"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_validator_1 = __importDefault(require("./user.validator"));
const transaction_validator_1 = __importDefault(require("./transaction.validator"));
const common_validator_1 = __importDefault(require("./common.validator"));
const authorization_validator_1 = __importDefault(require("./authorization.validator"));
exports.default = {
    UserValidator: user_validator_1.default,
    ValidLoginFields: authorization_validator_1.default,
    ValidTransactionFields: transaction_validator_1.default,
    ValidParams: common_validator_1.default,
    IsValidForTransfer: transaction_validator_1.default.IsValidForTransfer
};
