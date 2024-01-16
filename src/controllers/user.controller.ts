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

    singleUser: (req:Request&any, res:Response, next:NextFunction) => {
        const id = req.params.id
        const user = req.jwt.user
        model.ReadSingleResource({id: user}).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{next(err)})
    },


    updateUser: (req:Request&any, res:Response, next:NextFunction) => {
        const reqData = matchedData(req, {locations: ['body']})

        const data: User = {
            firstname: reqData.firstname,
            lastname: reqData.lastname,
            phone: reqData.phone,
            
            password: hashPassword(reqData.password),
            
        }

        const id = req.params.id
        const user = req.jwt.user
        model.UpdateResource({ id: user }, data).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    deleteUser: (req:Request&any, res:Response, next:NextFunction) => {
        const id = req.params.id
        const user = req.jwt.user
        model.DeleteResource({ id: user }).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{
            next(err)
        })
    },

}