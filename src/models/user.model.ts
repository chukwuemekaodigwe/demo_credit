import BaseService from './base.model'
import User from '../interfaces/user.interface'

export default class UserService extends BaseService{
    constructor(){
        super('users')
    }
}
