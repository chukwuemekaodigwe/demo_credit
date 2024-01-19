import { Request, NextFunction, Response } from 'express';
import { query, body, param, validationResult } from 'express-validator';
import { errResponse } from '../helpers/util';

export default {
    validationRules: () => {
        return [
            body('amount').isNumeric().isFloat({min: 0}).notEmpty(),
            body('comments').isString().notEmpty().optional()
        ]
    },

    hasValidFields: (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
    console.log(errors)
            return errResponse({
                errtype: 'Invalid fields',
                message: errors.array(),
                statusCode: 400,
                response: res
            })
        }
    },

    IsValidForTransfer: () => {
    return  body('beneficiary').notEmpty().isNumeric().isLength({ min: 15, max: 15 }).withMessage('The beneficiary wallet Id is needed. It should be 15 characters length')
    
    }

}