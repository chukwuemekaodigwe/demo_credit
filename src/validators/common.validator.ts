import { Request, NextFunction, Response } from 'express';
import { query, body, param, validationResult } from 'express-validator';
import { errResponse } from '../helpers/util';

export default {
    validationRules : () => {
        return param('*').notEmpty().isNumeric()

    },
    
    validParam: (req: Request, res: Response, next: NextFunction) => {
        const err = validationResult(req)
        if (err.isEmpty()) {
            next()
        } else {
            return errResponse({
                errtype: 'Invalid parameter',
                message: err.array(),
                statusCode: 404,
                response: res
            })
        }
    },

    
}