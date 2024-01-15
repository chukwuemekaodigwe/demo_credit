import { Request, NextFunction, Response } from 'express';
import { query, body, param, validationResult } from 'express-validator';
import { errResponse } from '../helpers/util';

export default {
    validationRules: () => {
        return [
            body('amount').isNumeric().notEmpty(),
            body('comments').isString().notEmpty().optional()

        ]
    },

    hasValidFields: (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            next()
        } else {
            return errResponse({
                errtype: 'Invalid fields',
                message: errors.array(),
                statusCode: 422,
                response: res
            })
        }
    },

    IsValidForTransfer: () => {
    return  body('beneficiary').notEmpty().isNumeric().isLength({ min: 15, max: 15 }).withMessage('The beneficiary wallet Id is needed. It should be 15 characters length')
    
    }

}