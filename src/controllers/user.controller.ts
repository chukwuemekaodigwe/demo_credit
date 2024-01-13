import User from "../interfaces/user.interface";
import UserService from "../models/user.model";
import { successResponse, resourceCreatedResponse, hashPassword } from '../helpers/util'

const model = new UserService()

export default {
    createUser: (req, res, next) => {
        const data: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            password: hashPassword(req.body.password),
            address: req.body.address
        }

        model.CreateResource(data).then((result) => {
            resourceCreatedResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    // usersList: (req, res, next) => {
    //     model.ReadResource().then(result=>{
    //         successResponse(result, res)
    //     })
    //     .catch(err=>{
    //         next(err)
    //     })
    // },

    singleUser: (req, res, next) => {
        const user = req.params.id

        model.ReadSingleResource({id:user}).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{next(err)})
    },


    updateUser: (req, res, next) => {
        const data: User = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            email: req.body.email,
            password: hashPassword(req.body.password),
            address: req.body.address
        }

        const user = req.params.id

        model.UpdateResource({ id: user }, data).then(result => {
            successResponse(result, res)
        })
            .catch(err => {
                next(err)
            })
    },

    deleteUser: (req, res, next) => {
        const user = req.params.id
        model.DeleteResource({ id: user }).then(result=>{
            successResponse(result, res)
        })
        .catch(err=>{
            next(err)
        })
    }
}