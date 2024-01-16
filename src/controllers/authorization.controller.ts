import { Request, Response, NextFunction } from 'express'
import { signJwt } from '../helpers/util'

export default {
    login : (req: Request & any, res: Response, next: NextFunction) => {
        try {
            const token = signJwt(req.token)
            res.status(201).send({accessToken: token, message: 'Authenticaton successful'});
        } catch (err) {
            next(err)
            console.log(err)
        }

    },


}