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
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("../routes"));
const util_1 = require("../helpers/util");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', routes_1.default);
const request = (0, supertest_1.default)(app);
const INVALID_USERID = 'string';
let VALIDUSERID = 1;
let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo2LCJlbWFpbCI6Im1hY2RvbUBnbWFpbC5jb20iLCJwcm92aWRlciI6ImVtYWlsIiwiaWF0IjoxNzA1MzA2OTMzfQ.VzWiYM6jD3zQyueUN8G_5Ix37oyxC1n0W0WtiGd4EFE';
let email = `email${(0, util_1.generateRandom)()}@gmail.com`;
jest.createMockFromModule('../models/user.model.ts');
jest.setTimeout(30000);
const invalidToken = 'Bearer INVALID';
describe('Express Routes', () => {
    it('should return welcome message for GET /', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Welcome to Demo Credit API');
    }));
    describe('POST /users', () => {
        it('should create a new user for valid input', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstname: 'UpdatedJohn',
                lastname: 'UpdatedDoe',
                phone: '9876543210',
                email: email,
                password: 'updatedPassword123',
            };
            yield request.post('/users').send(userData).then(response => {
                expect(response.status).toBe(201);
                VALIDUSERID = response.body.result.id;
            });
        }));
        it('should return status 500 if email is already in use', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                firstname: 'UpdatedJohn',
                lastname: 'UpdatedDoe',
                phone: '9876543210',
                email: email,
                password: 'updatedPassword123',
            };
            yield request.post('/users').send(userData).then(response => {
                expect(response.status).toBe(500);
            });
        }));
        it('should return 400 for missing required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidUserData = {
                lastname: 'Doe',
                phone: '1234567890',
                email: 'john@deo.com',
                password: 'password123'
            };
            const response = yield request.post('/users').send(invalidUserData);
            expect(response.status).toBe(400);
        }));
        it('should return 400 for wrong required fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidUserData = {
                firstname: 'John',
                lastname: 'Doe',
                phone: '1234567890',
                email: 'WRONGDATA',
                password: 'password123',
            };
            const response = yield request.post('/users').send(invalidUserData);
            expect(response.status).toBe(400);
        }));
    });
    describe('Protected routes:', () => {
        it('should return 401 for authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = VALIDUSERID;
            const response = yield request.get(`/users/${VALIDUSERID}`);
            expect(response.status).toBe(401);
        }));
        it('should return accessToken after successful login', () => __awaiter(void 0, void 0, void 0, function* () {
            const loginData = {
                username: email,
                password: 'updatedPassword123'
            };
            yield request.post('/login').send(loginData).then(response => {
                expect(response.status).toBe(201);
                expect(response.body.accessToken).toBeDefined();
                token = `Bearer ${response.body.accessToken}`;
            });
        }));
        it('should return 401 if no authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = VALIDUSERID;
            yield request.get(`/users/${userId}`).set('Cookie', invalidToken).then(response => {
                expect(response.status).toBe(401);
            });
        }));
        it('should return 403 for invalid tokens', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = VALIDUSERID;
            yield request.get(`/users/${userId}`).set('authorization', invalidToken)
                .then(response => {
                expect(response.status).toBe(403);
            });
        }));
        it('should return 200 for routes with valid authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = VALIDUSERID;
            yield request.get(`/users/${userId}`).set('Authorization', token)
                .then(response => {
                expect(response.status).toBe(200);
            });
        }));
        describe('crud operations on single user', () => {
            it('should get a single user for valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
                const userId = VALIDUSERID;
                const response = yield request.get(`/users/${userId}`).set('Authorization', token);
                expect(response.status).toBe(200);
            }));
            it('should return 404 for invalid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
                const invalidUserId = INVALID_USERID;
                const response = yield request.get(`/users/${invalidUserId}`).set('Authorization', token);
                expect(response.status).toBe(404);
            }));
            it('should only get access to the details of the authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
                const anotherUser = 2;
                const response = yield request.get(`/users/${anotherUser}`)
                    .set('Authorization', token);
                expect(response.status).toBe(200);
            }));
            it('should update a user for valid user ID and data', () => __awaiter(void 0, void 0, void 0, function* () {
                const userId = VALIDUSERID;
                const updatedUserData = {
                    firstname: 'UpdatedJohn',
                    lastname: 'UpdatedDoe',
                    phone: '9876543210',
                    email: 'updated.john.doe@example.com',
                    password: 'updatedPassword123',
                    address: 'Updated Address',
                };
                const response = yield request.patch(`/users/${userId}`).send(updatedUserData).set('Authorization', token);
                expect(response.status).toBe(200);
            }));
            it('should return 404 for invalid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
                const invalidUserId = INVALID_USERID;
                const response = yield request.delete(`/users/${invalidUserId}`).set('Authorization', token);
                expect(response.status).toBe(404);
            }));
            it('should delete a user for valid user ID', () => __awaiter(void 0, void 0, void 0, function* () {
                const userId = VALIDUSERID;
                const response = yield request.delete(`/users/${userId}`).set('Authorization', token);
                expect(response.status).toBe(200);
            }));
        });
    });
});
