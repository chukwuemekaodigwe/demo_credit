import KnexConfig from '../../knexfile'
import knex from 'knex'

const database = knex(KnexConfig)

export default database