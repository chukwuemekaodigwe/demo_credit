import supertest from 'supertest'
import { CreateUserAndWalletForTest, CreateUserForTest, DeleteUserResource, generateRandom, signJwt } from '../helpers/util'
import express, { response } from 'express';
import route from '../routes'

const app = express();
app.use(express.json());
app.use('/', route);

const request = supertest(app)

const userData = {
    firstname: 'UpdatedJohn',
    lastname: 'UpdatedDoe',
    phone: 9876543210,
    email: `email${generateRandom()}@gmail.com`,
    password: 'updatedPassword123',
};

var tokenWithoutWallet, tokenWithWallet
var user1, user2
const invalidToken = 'Bearer INVALID'
var server //for app server; to elimainate ECONNRESET error

jest.setTimeout(30000)

describe('Testing transaction Module', () => {
    beforeAll(async () => {
        // create server
        server = app.listen(0, '127.0.0.1');

        //user that has no wallet
       await CreateUserForTest(userData).then(result => {
            tokenWithoutWallet = `Bearer ${signJwt(result)}`
            user1 = result.id
        })

        //user that has wallet
       await  CreateUserAndWalletForTest({...userData,  email: `email${generateRandom()}@gmail.com`}).then((result) => {
            tokenWithWallet = `Bearer ${signJwt(result)}`
            user2 = result.id
        })
    })

    afterAll(() => {
        DeleteUserResource(user1)
        DeleteUserResource(user2)

        server.close()
    })

    describe('Adding deposit', () => {
        const depositData = {
            amount: 1000,
            comments: 'Deposit for test'
        }

        it('should return 401 for requests without authorization headers', async () => {
           await request.post('/transactions/deposit').send(depositData)
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })


        it('should return 403 if user has invalid token', async () => {
           await request.post('/transactions/deposit').send(depositData).set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })


        it('should return 404 if user has no wallet', async () => {
            await request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 201 on successful deposit for a valid user', async () => {
          await  request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(201)
                    expect(response.body.result.amount).toBe(depositData.amount)
                })
        })

        it('should return 400 for amount less than 0', async () => {
           await request.post('/transactions/deposit').send({ ...depositData, amount: -100 }).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(400)
                })
        })
    })


    describe('Adding Withdrawal', () => {
        const withdrawalData = {
            amount: 100,
            comments: 'Withdrawal for test'
        }

        it('should return 401 for requests without authorization headers', async () => {
           await request.post('/transactions/withdraw').send(withdrawalData).then(response => {
                expect(response.status).toBe(401)
            })
        })

        it('should return 404 if user has no wallet', async () => {
           await request.post('/transactions/withdraw').send(withdrawalData).set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })


        it('should return 403 if user has invalid token', async () => {
           await request.post('/transactions/withdraw').send(withdrawalData).set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 201 on successful withdrawal for a valid user', async () => {
          await request.post('/transactions/withdraw').send(withdrawalData).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(201)
                    expect(response.body.result.amount).toBe(-(withdrawalData.amount))
                    expect(response.body.result).toHaveProperty('transactionId')
                })
        })

        it('should return 400 for amount less than 0', async () => {
          await  request.post('/transactions/withdraw').send({ ...withdrawalData, amount: -100 }).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(400)
                })
        })

        it('should return 400 if user request more than the wallet balance',  async () => {
          await  request.post('/transactions/withdraw').send({ ...withdrawalData, amount: 2000 }).set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(400)
                })
        })

    })



    describe('Adding transfer', () => {

        const transferData = {
            amount: 100,
            comments: 'Transfer for test',
            beneficiary: ''
        }
        let user
        beforeAll( async () => {
            // create new user for beneficiary
           await CreateUserAndWalletForTest({...userData,  email: `email${generateRandom()}@gmail.com`}).then((newUserData) => {
                transferData.beneficiary = newUserData.walletId
                user = newUserData
            })
        })

        afterAll(() => {
            DeleteUserResource(user.id)
        })

        it('should return 401 for requests without authorization headers', async () => {
          await  request.post('/transactions/transfer').send(transferData).then(response => {
                expect(response.status).toBe(401)
            })
        })

        it('should return 404 if user has no wallet', async () => {
           await request.post('/transactions/deposit').send(transferData).set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 403 if user has invalid token', async () => {
           await request.post('/transactions/transfer').send(transferData).set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 201 on successful transfer for a valid user', async () => {
           await  request.post('/transactions/transfer').send(transferData).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(201)
                    expect(response.body.result.amount).toBe(-(transferData.amount))
                })
        })

        it('should return 400 for amount less than 0', async () => {
           await request.post('/transactions/transfer').send({ ...transferData, amount: -100 }).set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(400)
                })
        })

        it('should return 400 if user request more than the wallet balance', async () => {
          await  request.post('/transactions/transfer').send({ ...transferData, amount: 2000 }).set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(400)
                })
        })

    })

    describe('Accessing user transactions', () => {
        it('should return 401 for requests without authorization headers',async () => {
           await request.get('/transactions').then(response => {
                expect(response.status).toBe(401)
            })
        })

        it('should return 404 if user has no wallet', async () => {
           await request.get('/transactions').set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 403 if user has invalid token', async () => {
           await request.get('/transactions').set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 200 for successful request from a valid user', async () => {
            await request.get('/transactions').set('authorization', tokenWithWallet)
                .then((response) => {
                    expect(response.status).toBe(200)
                })
        })


        it('should an array of the users transactions for successful request from a valid user', async () => {
           await request.get('/transactions').set('authorization', tokenWithWallet)
                .then((response) => {

                    expect(Array.isArray (response.body.result)).toBe(true)
                })
        })
    })


    describe('crud on single transaction: user can only operate his transaction', () => {
        const depositData = {
            amount: 1000,
            comments: 'Deposit for test'
        }
        var transId
        var anotherUserToken
  
        beforeAll(async () => {
  
           await request.post('/transactions/deposit').send(depositData).set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(201)
                    transId = response.body.result.id
                    
                })

            await CreateUserAndWalletForTest({...userData,  email: `email${generateRandom()}@gmail.com`})
                .then(result => {
                    anotherUserToken = `Bearer ${signJwt(result)}`
                    
                })
        })

        it('should return 401 for requests without authorization headers', async () => {
           await request.get(`/transactions/${transId}`)
           .then(response => {
                expect(response.status).toBe(401)
            })
        })

        it('should return 404 if user has no wallet', async () => {
            await request.get(`/transactions/${transId}`).set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 403 if user has invalid token', async () => {
           await request.get(`/transactions/${transId}`).set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 404 for successful request for another users transaction', async () => {
           await request.get(`/transactions/${transId}`).set('authorization', anotherUserToken)
           .then(response => {
                expect(response.status).toBe(404)
            })
        })

        it('should return 200 for successful request from a valid user', async () => {
          await  request.get(`/transactions/${transId}`).set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(200)
                })
        })

        it('should return 200 for success delete of a transaction', async () => {
           await request.delete(`/transactions/${transId}`).set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(200)
                })
        })

    })
})