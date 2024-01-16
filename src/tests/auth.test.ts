import supertest from 'supertest';
import express, { response } from 'express';
import route from '../routes'
import { generateRandom } from '../helpers/util'
const app = express();
app.use(express.json());
app.use('/', route);

const request = supertest(app);
const INVALID_USERID = 'string'
let VALIDUSERID = 1
let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo2LCJlbWFpbCI6Im1hY2RvbUBnbWFpbC5jb20iLCJwcm92aWRlciI6ImVtYWlsIiwiaWF0IjoxNzA1MzA2OTMzfQ.VzWiYM6jD3zQyueUN8G_5Ix37oyxC1n0W0WtiGd4EFE'
let email = `email${generateRandom()}@gmail.com`

jest.createMockFromModule('../models/user.model.ts')

jest.setTimeout(30000)

const invalidToken = 'Bearer INVALID'

describe('Express Routes', () => {
    it('should return welcome message for GET /', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toContain('Welcome to Demo Credit API');
    });

    describe('POST /users', () => {
        it('should create a new user for valid input', async () => {
            const userData = {
                firstname: 'UpdatedJohn',
                lastname: 'UpdatedDoe',
                phone: '9876543210',
                email: email,
                password: 'updatedPassword123',
            };

            await request.post('/users').send(userData).then(response => {
                expect(response.status).toBe(201);
                VALIDUSERID = response.body.result.id
            })
        });

        it('should return status 500 if email is already in use', async () => {
            const userData = {
                firstname: 'UpdatedJohn',
                lastname: 'UpdatedDoe',
                phone: '9876543210',
                email: email,
                password: 'updatedPassword123',
            };

            await request.post('/users').send(userData).then(response => {
                expect(response.status).toBe(500);

            })
        });

        it('should return 400 for missing required fields', async () => {
            const invalidUserData = {
                lastname: 'Doe',
                phone: '1234567890',
                email: 'john@deo.com',
                password: 'password123'
            };

            const response = await request.post('/users').send(invalidUserData);
            expect(response.status).toBe(400);

        });


        it('should return 400 for wrong required fields', async () => {
            const invalidUserData = {
                firstname: 'John',
                lastname: 'Doe',
                phone: '1234567890',
                email: 'WRONGDATA',
                password: 'password123',

            };

            const response = await request.post('/users').send(invalidUserData)
            expect(response.status).toBe(400);

        });

    });

    describe('Protected routes:', () => {
        it('should return 401 for authenticated user', async () => {
            const userId = VALIDUSERID;
            const response = await request.get(`/users/${VALIDUSERID}`);
            expect(response.status).toBe(401)
        })

        it('should return accessToken after successful login', async () => {
            const loginData = {
                username: email,
                password: 'updatedPassword123'
            }
            await request.post('/login').send(loginData).then(response => {
                expect(response.status).toBe(201)

                expect(response.body.accessToken).toBeDefined()
                token = `Bearer ${response.body.accessToken}`
            })
        })


        it('should return 401 if no authorization header', async () => {
            const userId = VALIDUSERID
            await request.get(`/users/${userId}`).set('Cookie', invalidToken).then(response => {
                expect(response.status).toBe(401)
            })
        })

        it('should return 403 for invalid tokens', async () => {
            const userId = VALIDUSERID
            await request.get(`/users/${userId}`).set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 200 for routes with valid authorization header', async () => {
            const userId = VALIDUSERID
            await request.get(`/users/${userId}`).set('Authorization', token)
                .then(response => {
                    expect(response.status).toBe(200)
                })
        })


        describe('crud operations on single user', () => {
            it('should get a single user for valid user ID', async () => {
                const userId = VALIDUSERID;
                const response = await request.get(`/users/${userId}`).set('Authorization', token)
                expect(response.status).toBe(200);
            });

            it('should return 404 for invalid user ID', async () => {
                const invalidUserId = INVALID_USERID;
                const response = await request.get(`/users/${invalidUserId}`).set('Authorization', token);

                expect(response.status).toBe(404);
            });

            it('should only get access to the details of the authenticated user', async () => {
                const anotherUser = 2;
                const response = await request.get(`/users/${anotherUser}`)
                    .set('Authorization', token)
                expect(response.status).toBe(200);

            })
            it('should update a user for valid user ID and data', async () => {
                const userId = VALIDUSERID;
                const updatedUserData = {
                    firstname: 'UpdatedJohn',
                    lastname: 'UpdatedDoe',
                    phone: '9876543210',
                    email: 'updated.john.doe@example.com',
                    password: 'updatedPassword123',
                    address: 'Updated Address',
                };

                const response = await request.patch(`/users/${userId}`).send(updatedUserData).set('Authorization', token);

                expect(response.status).toBe(200);

            });

            it('should return 404 for invalid user ID', async () => {
                const invalidUserId = INVALID_USERID;
                const response = await request.delete(`/users/${invalidUserId}`).set('Authorization', token);

                expect(response.status).toBe(404);
            });

            it('should delete a user for valid user ID', async () => {
                const userId = VALIDUSERID;
                const response = await request.delete(`/users/${userId}`).set('Authorization', token);

                expect(response.status).toBe(200);
            });

        });

    })
});
