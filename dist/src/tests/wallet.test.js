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
app.use('/', routes_1.default);
const request = (0, supertest_1.default)(app);
// Mock JWT verification for authenticated requests
// jest.mock('../routes.ts', () => ({
//     ...jest.requireActual('../routes.ts'),
//     hasValidToken: jest.fn().mockReturnValue((req, res, next) => {
//         req.jwt.user = 1
//         next()
//     })
// }))
const userData = {
    firstname: 'UpdatedJohn',
    lastname: 'UpdatedDoe',
    phone: 9876543210,
    email: `email${(0, util_1.generateRandom)()}@gmail.com`,
    password: 'updatedPassword123',
};
var server; //for app server; to elimainate ECONNRESET error
var tokenWithoutWallet, tokenWithWallet;
var user1, user2;
const invalidToken = 'Bearer INVALID';
jest.setTimeout(30000);
describe('Testing Wallet Module', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // start serve
        server = app.listen(0, '127.0.0.1');
        // create users
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
    describe('creating new wallet', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.post('/wallets')
                .then(response => {
                expect(response.status).toBe(401);
            });
        });
        it('should return 403 if user has invalid token', () => {
            request.post('/wallets').set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        });
        it('should return 400 if user has already has a wallet', () => {
            request.post('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(400);
            });
        });
        it('should return 201 for a success request with a walletId from a valid user', () => {
            request.post('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(201);
                expect(response.body.result).toHaveProperty('walletId');
            });
        });
    });
    describe('Access user wallet details', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.get('/wallets')
                .then(response => {
                expect(response.status).toBe(401);
            });
        });
        it('should return 403 if user has invalid token', () => {
            request.get('/wallets').set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        });
        it('should return 404 if user has no wallet', () => {
            request.post('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        });
        it('should return 201 for a success request with a walletId from a valid user', () => {
            request.get('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(201);
                expect(response.body.result).toHaveProperty('walletId');
            });
        });
    });
    describe('deleting user wallet', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.delete('/wallets')
                .then(response => {
                expect(response.status).toBe(401);
            });
        });
        it('should return 403 if user has invalid token', () => {
            request.delete('/wallets').set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        });
        it('should return 404 if no wallet is found', () => {
            request.delete('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                expect(response.status).toBe(404);
            });
        });
        it('should return 200 for successful wallet delete from a valid user', () => {
            request.delete('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                expect(response.status).toBe(200);
            });
        });
    });
});
