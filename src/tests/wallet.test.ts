import supertest from 'supertest'
import { CreateUserAndWalletForTest, CreateUserForTest, DeleteUserResource, generateRandom, signJwt } from '../helpers/util'
import express from 'express'
import route from '../routes'
const app = express()

app.use('/', route)
const request = supertest(app)

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
    email: `email${generateRandom()}@gmail.com`,
    password: 'updatedPassword123',
};

var server //for app server; to elimainate ECONNRESET error
var tokenWithoutWallet, tokenWithWallet
var user1, user2
const invalidToken = 'Bearer INVALID'


jest.setTimeout(30000)


describe('Testing Wallet Module', () => {
    beforeAll(async () => {
        // start serve
        server = app.listen(0, '127.0.0.1');
        // create users
        //user that has no wallet
        await CreateUserForTest(userData).then(result => {
            tokenWithoutWallet = `Bearer ${signJwt(result)}`
            user1 = result.id
        })

        //user that has wallet
        await CreateUserAndWalletForTest({ ...userData, email: `email${generateRandom()}@gmail.com`, }).then((result) => {
            tokenWithWallet = `Bearer ${signJwt(result)}`

            user2 = result.id
        })
    })

    afterAll(() => {

        DeleteUserResource(user1)
        DeleteUserResource(user2)

        server.close()
    })

    describe('creating new wallet', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.post('/wallets')
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })

        it('should return 403 if user has invalid token', () => {
            request.post('/wallets').set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 400 if user has already has a wallet', () => {
            request.post('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(400)
                })
        })

        it('should return 201 for a success request with a walletId from a valid user', () => {
            request.post('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(201)
                    expect(response.body.result).toHaveProperty('walletId')
                })
        })
    })

    describe('Access user wallet details', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.get('/wallets')
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })

        it('should return 403 if user has invalid token', () => {
            request.get('/wallets').set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 404 if user has no wallet', () => {
            request.post('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 201 for a success request with a walletId from a valid user', () => {
            request.get('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(201)
                    expect(response.body.result).toHaveProperty('walletId')
                })
        })
    })


    describe('deleting user wallet', () => {
        it('should return 401 for requests without authorization headers', () => {
            request.delete('/wallets')
                .then(response => {
                    expect(response.status).toBe(401)
                })
        })

        it('should return 403 if user has invalid token', () => {
            request.delete('/wallets').set('authorization', invalidToken)
                .then(response => {
                    expect(response.status).toBe(403)
                })
        })

        it('should return 404 if no wallet is found', () => {
            request.delete('/wallets').set('authorization', tokenWithoutWallet)
                .then(response => {
                    expect(response.status).toBe(404)
                })
        })

        it('should return 200 for successful wallet delete from a valid user', () => {
            request.delete('/wallets').set('authorization', tokenWithWallet)
                .then(response => {
                    expect(response.status).toBe(200)
                    
                })
        })

    })
})