import { getRandomValues } from "crypto"
import { Response } from "express"

export const generateRandom = () => {
    let random_byte = new Uint32Array(1)
    random_byte = getRandomValues(random_byte)

    let time = new Date().getTime().toString().substring(-3, 3)
    return `${random_byte}${time}`.padStart(15,'0')


}

export const resourceCreatedResponse = (data:any, response:Response) => {
  return response.status(201).send({
        mesaage: 'resource created successfully',
        result: data,
        statusCode: 201
    })
}

export const successResponse = (data:any, response:Response) => {
    return response.status(200).send({
          mesaage: 'Request Successful',
          result: data,
          statusCode: 200
      })
  }

