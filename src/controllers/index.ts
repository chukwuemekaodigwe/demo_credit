import WalletController from "./wallet.controller";
import TransactionController from './transaction.controller'
import UserController from './user.controller'
import AuthController from  './authorization.controller'

export default {
    Auth: AuthController,
    Wallet: WalletController,
    Transaction: TransactionController,
    User: UserController,

}
