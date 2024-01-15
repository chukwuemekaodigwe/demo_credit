import * as Auth from './authorization.middleware'
import * as Transaction from './transaction.middleware'

export default {
    auth: Auth,
    transactions : Transaction
}