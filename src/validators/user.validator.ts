import { Request, NextFunction, Response } from 'express';
import { query, body, param, validationResult, matchedData } from 'express-validator';
import { errResponse } from '../helpers/util';
import WalletService from '../models/wallet.model'



export default {
    validationRules: () => {
        return [
            body('firstname').isString().notEmpty().trim().isLength({ min: 1 }),
            body('lastname').isString().notEmpty().trim().isLength({ min: 1 }),
            body('email').isEmail().notEmpty().trim().isLength({ min: 1 }),
            body('password').isStrongPassword().notEmpty().trim().isLength({ min: 1 }),
            body('phone').notEmpty().trim().isLength({ min: 1 })
    
        ]
    },
    
    hasValidFields: (req: Request, res: Response, next: NextFunction) => {
       
        const errors = validationResult(req)
        
        if (errors.isEmpty()) {
            const sanitizedData = matchedData(req, { locations: ['body'] });
            
            // Assign sanitized data back to req.body
           // req.body = sanitizedData;
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

}
