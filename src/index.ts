import express, {ErrorRequestHandler, Request, Response, NextFunction} from 'express'
import knexConfig from '../knexfile'
import Config from './helpers/config'
import routes from './routes'
import knex from 'knex'
import { errResponse, fourOhFour } from './helpers/util'
import cors from 'cors'

const app = express()
const port = Config.port 


app.use(cors<Request>())


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api', routes)
app.post('/', (req, res)=>res.send({name: req.body.firstname}))

app.use(fourOhFour)
app.use((err:Error, req:Request, res:Response, next:NextFunction)=>{
     errResponse({
        errtype: err.message,
        message: Config.env == 'dev' ? err.stack : err.message,
        statusCode: res.statusCode,
        response: res
    })

})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    const db = knex(knexConfig)
    
})

export default app