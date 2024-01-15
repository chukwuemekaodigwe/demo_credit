import UserService from '../models/user.model'
import * as crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import Config from '../helpers/config'
import { Request, Response, NextFunction } from 'express'
const model = new UserService()

export default {
    login : (req: Request & any, res: Response, next: NextFunction) => {
        try {
            let refreshId = req.token.user + Config.jwtSecret;
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
            let token = jwt.sign(req.token, Config.jwtSecret);
            res.status(201).send({accessToken: token, message: 'Authenticaton successful'});
        } catch (err) {
            next(err)
            console.log(err)
        }

    },


}