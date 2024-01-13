import CrudServiceHelper from '../helpers/CrudService.helper'
import User from '../interfaces/user.interface'

export default class UserService extends CrudServiceHelper{
    constructor(){
        super('users')
    }
}
