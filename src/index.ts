import express, {Express, response} from 'express'
import knexConfig from '../knexfile'
import Config from './helpers/config'
import routes from './routes'
import knex from 'knex'

const app: Express = express()
const port = Config.port 

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/api', routes)

app.use((err, req, res, next)=>{
    res.json({
        status: err.statusCode,
        message: err.message,
        detail: Config.env == 'dev' ? err.stack : ''
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    const db = knex(knexConfig)
    
})