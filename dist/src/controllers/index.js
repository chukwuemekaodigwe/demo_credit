"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_controller_1 = __importDefault(require("./wallet.controller"));
const transaction_controller_1 = __importDefault(require("./transaction.controller"));
const user_controller_1 = __importDefault(require("./user.controller"));
const authorization_controller_1 = __importDefault(require("./authorization.controller"));
exports.default = {
    Auth: authorization_controller_1.default,
    Wallet: wallet_controller_1.default,
    Transaction: transaction_controller_1.default,
    User: user_controller_1.default,
};
