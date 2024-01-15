import { Request, Response, NextFunction } from "express";
import User from "../interfaces/user.interface";
import UserService from "../models/user.model";
import { successResponse, resourceCreatedResponse, hashPassword } from '../helpers/util'
import { matchedData } from "express-validator";

const model = new UserService()

export default {
    createUser: (req:Request, res:Response, next:NextFunction) => {
        const reqData = matchedData(req, {locations: ['body']})
    
        const data: User = {
            firstname: reqData.firstname,
            lastname: reqData.lastname,
            phone: reqData.phone,
            email: reqData.email,
            password: hashPassword(reqData.password)
        }

        model.CreateResource(data).then((result) => {
            resourceCreatedResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    singleUser: (req:Request, res:Response, next:NextFunction) => {
        const user = req.params.id
        model.ReadSingleResource({id:user}).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{next(err)})
    },


    updateUser: (req:Request, res:Response, next:NextFunction) => {
       const reqData = matchedData(req)
        const data: User = {
            firstname: reqData.firstname,
            lastname: reqData.lastname,
            phone: reqData.phone,
            email: reqData.email,
            password: hashPassword(reqData.password),
            address: reqData.address
        }

        const user = req.params.id

        model.UpdateResource({ id: user }, data).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    deleteUser: (req:Request, res:Response, next:NextFunction) => {
        const user = req.params.id
        model.DeleteResource({ id: user }).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{
            next(err)
        })
    }
}