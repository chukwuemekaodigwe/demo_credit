# Demo Credit: Mobile Lending App

Demo Credit is a lending wallet API service built with TypeScript on Node.js, utilizing a MySQL database orchestrated with the Knex.js ORM. This service provides APIs that offer users/clients easy access to create an account, order a wallet, deposit funds, withdraw, or even send funds to other users of the service.
Click for the the <a href="/api" >API route</a>

## Implementation of the Project

This project was implemented using the Model-Controller Architecture. It also incorporates the Singleton design architecture, where each directory, file, class, method, or function implements and performs a particular task. The project is separated into various directories, each performing a stipulated task, with common modules grouped into the same directory. Here is a breakdown of the project structure:

```
./src
├── controllers
│   ├── authorization.controller.ts
│   ├── index.ts
│   ├── transaction.controller.ts
│   ├── user.controller.ts
│   └── wallet.controller.ts
├── database
│   ├── connection.ts
│   └── migrations
│       ├── 20240110221556_create_users_table.ts
│       ├── 20240110221529_create_wallets_table.ts
│       └── 20240110222102_create_transactions_table.ts
├── directory_structure.txt
├── helpers
│   ├── config.ts
│   └── util.ts
├── index.ts
├── interfaces
│   ├── transaction.interface.ts
│   ├── user.interface.ts
│   └── wallet.interface.ts
├── middlewares
│   ├── authorization.middleware.ts
│   ├── index.ts
│   └── transaction.middleware.ts
├── models
│   ├── base.model.ts
│   ├── transaction.model.ts
│   ├── user.model.ts
│   └── wallet.model.ts
├── routes.ts
├── tests
│   ├── auth.test.ts
│   ├── transaction.test.ts
│   └── wallet.test.ts
└── validators
    ├── authorization.validator.ts
    ├── common.validator.ts
    ├── index.ts
    ├── transaction.validator.ts
    └── user.validator.ts

```
This design pattern makes the project maintainable and scalable. The validators are input validators for each type of service; the tests directory hosts the unit tests performed on the app to ensure its suitability and reliability; the route file hosts the API routes on which implemented validation, authorization, and suitability tests using middlewares; then the middlewares in the middleware directory, models for the database object-relational mapping, the interfaces for various object typings, the controllers for the interaction between the route and models.

In the project, I designed it so that a user can sign up by providing their first name, last name, email, and password. Later, they can request a wallet account to enable transactions on their account. The easy sign-up process ensures that clients join the community hassle-free.

To access the service, a user needs to log in with their email as the username and password. Upon login, an access token is issued, which should be attached as a Bearer authorization token for subsequent requests to the service to gain access to the system.

### Breakdown of Routes, Requirements, and Functions

- `POST /api/users`

  To create account. That is the guest submits firstname, lastname, email, password and optional phone number as a payload using this route. I made this routes simple and easy to enable easy use and remeberance of the routes.

- `POST /api/login`

  This is the login route. The user submit his email as username field and password field, both forming the payload for the login route. Upon login he receives a accesstoken for subsequent requests as authorization header.

- `GET /api/users/:id?`

  To access the authenticated user's details, which include personal information: first name, last name, email, phone, and address; their wallet details: `wallet balance` and `walletId` (a 15-digit wallet account number that they can give to clients to receive funds).

- `DELETE /api/users/:id?`

  To enable a user to delete their account.

- `POST /api/wallets`

  To enable an authenticated user to request a wallet account. The system is built to allow only one wallet for each user. Upon request, the service generates a `walletId` for the user and returns it.

- `POST /api/transactions/deposit`

  This route enables an authenticated user to fund their wallet. The `amount` is provided on the payload sent to the server. The user has the option to add `comments`. __These options are the same for withdrawal and transfer routes__.

- `POST /api/transactions/withdraw`

  This route is used to make a withdrawal request. The authenticated user must supply an amount within the range of the amount in the wallet. The app checks this and notifies the user if they don't have sufficient balance.

- `POST /api/transactions/transfer`

  To transfer funds from one user to another, both users must have a `walletId`, and the sender would provide the recipient's `walletId` as a `beneficiary` in the body of the request payload.

- `GET /api/transactions`

  This provides the client with an array of the transactions they have made, including deposits, withdrawals, and transfers, all in the same response.

- `GET /api/transactions/:id`

  This enables the user to access a particular transaction, but it can only provide access if the transaction rightfully belongs to the user.

- `DELETE /api/transactions/:id`

  This enables an authenticated user to delete a particular transaction that rightfully belongs to them.

- `DELETE /api/wallets`

  To enable a user to close or terminate their wallet without deleting their account.


### Database Implemetation
<img src="https://res.cloudinary.com/dfl15pkea/image/upload/v1705696890/LENDSQR_fvbihu.jpg" alt="Database ER diagram"/>

The project is implemented using three database tables: users, wallets and transactions. The `users` table stores every information about the user, namely



```
    id
    firstname
    lastname
    email
    password
    phone
    created_at
    updated_at
    
```

Wallets table has the detail about each user's wallet: the balance, walletId or wallet account no, atc. The wallets where given a table so this system can be extended to allow users own more than one wallet.

```
    id
    user_id
    walletId
    created_at
    updated_at
```

While the transaction table has the following, including a foreign key to the users table

```
    id
    user_id             // foreigh key to the users table
    transactionId       // unique id to publicly represent thuis transaction
    amount
    comment
    transactiontype     // detail below
    beneficiary         // for recording beneficiaries of transfer
    created_at          //date of the transaction
    updated_at

```

Here I create a way to enable every type of transaction supported by the company to reside on this table by including the `transactiontype` column. The column is `int` datatype as integers are more consistent. So the implementation is as follows:
    
```
    1 ==> DEOPSITS
    2 ==> WITHDRAWALS
    3 ==> TRANSFER

```
This makes for easy management and expansion. The types can easily be expaneded without need of modifying the database schema. It would be implemented on the code, which I already gave room for by creating a base model that orchstras all operations needing little or no adjustment to meet specific needs.

### Little explanantion about the database models

In my project model I have one base model in which i implemented all the database CRUD operations implemented within the baseservice class. Then all other models, namely `users`, `wallets`, and `transactions` implements and extends this base class to inherit its menthods and either extend or add new methods to it to siut their use case. This gives us an edge of a maintainable, scaleable, readable and reliable code.

### Installation and Use

To clone or use the project code you need to `clone this repq`, then ensure you have latest `nodejs` installed. Then run
`npm install` within th project directory, then create the database and add its credential to the project by creating a .env file and copying the example.env into it and edit as your requirements. 

Then run `npx knex migrate:latest` to install the database tablesa and configuarations. On success, run `npm run dev` to start the development server of this project