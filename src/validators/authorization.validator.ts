import { Response, Request, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { errResponse } from "../helpers/util";

export default {
validationRules: () => {
    return [
        body('username').isEmail().notEmpty(),
        body('password').notEmpty().escape()

    ]
},
    hasValidFields: (req: Request & any, res: Response, next: NextFunction) => {

        const errors = validationResult(req)
        if(errors.isEmpty()){
            next()
        }else{
           return  errResponse({
                errtype: 'Invalid fields',
                message: errors.array(),
                statusCode: 422,
                response: res
            })
        }
    },

    
}