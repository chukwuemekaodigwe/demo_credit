import crypto from 'node:crypto'
import UserService from '../models/user.model'
import { errResponse } from '../helpers/util'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import config from '../helpers/config'
import { matchedData } from 'express-validator'

const model = new UserService()

export const VerifyCredentials = (req: Request&any, res: Response, next: NextFunction) => {
    const reqData = matchedData(req)
    const username = reqData.username
    const password = reqData.password

    model.ReadSingleResource({ email: username }).then((result) => {
        if (!result) {
            return errResponse({
                    errtype: 'Authentication Error',
                    message: 'Invalid Credentials',
                    statusCode: 400,
                    response: res
                })
        }
        else {
            let passwordFields = result.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(password).digest("base64");
            if (hash === passwordFields[1]) {
                /**
                 * req.token for jwtToken generation 
                 * Accessed and generated at authorization controller
                 * */
                 req.token = result 
                 
                return next();
            } else {
                return errResponse({
                    errtype: 'Authentication Error',
                    message: 'Invalid Credentials',
                    statusCode: 400,
                    response: res
                })
            }
        }
    })

}

export const hasValidToken = (req: Request & any, res: Response, next: NextFunction) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return errResponse({
                    errtype: 'Authentication Error',
                    message: 'Invalid Authentication',
                    statusCode: 401,
                    response: res
                })
            } else {
                req.jwt = jwt.verify(authorization[1], config.jwtSecret);
                return next();
            }

        } catch (err) {
            return errResponse({
                errtype: 'Authorization Error',
                message: 'Invalid token',
                statusCode: 403,
                response: res
            })
        }
    } else {
        return errResponse({
            errtype: 'Authentication Error',
            message: 'Invalid Authentication',
            statusCode: 401,
            response: res
        })
    }
}

