import User from './user.validator'
import Transaction from './transaction.validator'
import ValidParams from './common.validator'
import Login from './authorization.validator'

export default {
    UserValidator: User,
    ValidLoginFields: Login,
    ValidTransactionFields: Transaction,
    ValidParams: ValidParams,
    IsValidForTransfer: Transaction.IsValidForTransfer
}