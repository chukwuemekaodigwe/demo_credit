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
const supertest_1 = __importDefault(require("supertest"));
const util_1 = require("../helpers/util");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', routes_1.default);
const request = (0, supertest_1.default)(app);
const userData = {
    firstname: 'UpdatedJohn',
    lastname: 'UpdatedDoe',
    phone: 9876543210,
    email: `email${(0, util_1.generateRandom)()}@gmail.com`,
    password: 'updatedPassword123',
};
var tokenWithoutWallet, tokenWithWallet;
var user1, user2;
const invalidToken = 'Bearer INVALID';
var server; //for app server; to elimainate ECONNRESET error
jest.setTimeout(30000);
describe('Testing transaction Module', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // create server
        server = app.listen(0, '127.0.0.1');
        //user that has no wallet
        yield (0, util_1.CreateUserForTest)(userData).then(result => {
            tokenWithoutWallet = `Bearer ${(0, util_1.signJwt)(result)}`;
            user1 = result.id;
        });
        //user that has wallet
        yield (0, util_1.CreateUserAndWalletForTest)(Object.assign(Object.assign({}, userData), { email: `email${(0, util_1.generateRandom)()}@gmail.com` })).then((result) => {
            tokenWithWallet = `Bearer ${(0, util_1.signJwt)(result)}`;
            user2 = result.id;
        });
    }));
    afterAll(() => {
        (0, util_1.DeleteUserResource)(user1);
        (0, util_1.DeleteUserResource)(user2);
        server.close();
    });
    describe('Adding deposit', () => {
        const depositData = {
            amount: 1000,
            comments: 'Deposit for test'
        };
        it('should return 401 for requests without authorization headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(depositData)
                .then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 403 if user has invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(depositData).set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 404 if user has no wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 201 on successful deposit for a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.result.amount).toBe(depositData.amount);
            });
        }));
        it('should return 400 for amount less than 0', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(Object.assign(Object.assign({}, depositData), { amount: -100 })).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(400);
            });
        }));
    });
    describe('Adding Withdrawal', () => {
        const withdrawalData = {
            amount: 100,
            comments: 'Withdrawal for test'
        };
        it('should return 401 for requests without authorization headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(withdrawalData).then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 404 if user has no wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(withdrawalData).set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 403 if user has invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(withdrawalData).set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 201 on successful withdrawal for a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(withdrawalData).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.result.amount).toBe(-(withdrawalData.amount));
                expect(response.body.result).toHaveProperty('transactionId');
            });
        }));
        it('should return 400 for amount less than 0', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(Object.assign(Object.assign({}, withdrawalData), { amount: -100 })).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(400);
            });
        }));
        it('should return 400 if user request more than the wallet balance', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/withdraw').send(Object.assign(Object.assign({}, withdrawalData), { amount: 2000 })).set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(400);
            });
        }));
    });
    describe('Adding transfer', () => {
        const transferData = {
            amount: 100,
            comments: 'Transfer for test',
            beneficiary: ''
        };
        let user;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // create new user for beneficiary
            yield (0, util_1.CreateUserAndWalletForTest)(Object.assign(Object.assign({}, userData), { email: `email${(0, util_1.generateRandom)()}@gmail.com` }))
                .then((newUserData) => {
                transferData.beneficiary = newUserData.walletId;
                user = newUserData;
            });
        }));
        afterAll(() => {
            (0, util_1.DeleteUserResource)(user.id);
        });
        it('should return 401 for requests without authorization headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/transfer').send(transferData)
                .then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 404 if user has no wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(transferData).set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 403 if user has invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/transfer').send(transferData).set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 201 on successful transfer for a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/transfer').send(transferData).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(201);
                expect(response.body.result.amount).toBe(-(transferData.amount));
            });
        }));
        it('should return 400 for amount less than 0', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/transfer').send(Object.assign(Object.assign({}, transferData), { amount: -100 })).set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(400);
            });
        }));
        it('should return 400 if user request more than the wallet balance', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/transfer').send(Object.assign(Object.assign({}, transferData), { amount: 2000 })).set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(400);
            });
        }));
    });
    describe('Accessing user transactions', () => {
        it('should return 401 for requests without authorization headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get('/transactions').then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 404 if user has no wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get('/transactions').set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 403 if user has invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get('/transactions').set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 200 for successful request from a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get('/transactions').set('authorization', tokenWithWallet)
                .then((response) => {
                expect(response.status).toBe(200);
            });
        }));
        it('should an array of the users transactions for successful request from a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get('/transactions').set('authorization', tokenWithWallet)
                .then((response) => {
                expect(Array.isArray(response.body.result)).toBe(true);
            });
        }));
    });
    describe('crud on single transaction: user can only operate his transaction', () => {
        const depositData = {
            amount: 1000,
            comments: 'Deposit for test'
        };
        var transId;
        var anotherUserToken;
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(201);
                transId = response.body.result.id;
            });
            yield (0, util_1.CreateUserAndWalletForTest)(Object.assign(Object.assign({}, userData), { email: `email${(0, util_1.generateRandom)()}@gmail.com` }))
                .then(result => {
                anotherUserToken = `Bearer ${(0, util_1.signJwt)(result)}`;
            });
        }));
        it('should return 401 for requests without authorization headers', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(`/transactions/${transId}`)
                .then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 404 if user has no wallet', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(`/transactions/${transId}`).set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 403 if user has invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(`/transactions/${transId}`).set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 404 for successful request for another users transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(`/transactions/${transId}`).set('authorization', anotherUserToken)
                .then(response => {
                expect(response.status).toBe(404);
            });
        }));
        it('should return 200 for successful request from a valid user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.get(`/transactions/${transId}`).set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(200);
            });
        }));
        it('should return 200 for success delete of a transaction', () => __awaiter(void 0, void 0, void 0, function* () {
            yield request.delete(`/transactions/${transId}`).set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(200);
            });
        }));
    });
});
