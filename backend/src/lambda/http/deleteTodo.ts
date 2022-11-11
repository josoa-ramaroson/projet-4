import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo,deleteAttachment } from '../../dataLayer/todosAcess'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)
  

    logger.info("suppression d'un todo");

    try{
    const result = await deleteTodo(userId,todoId);
    const resultBucket = await deleteAttachment(todoId);

    if(!resultBucket)
      logger.info("suppression de l'image dans s3")

      
    if(result){
        return {
          statusCode: 204,
          body: JSON.stringify({
            item: userId
          })
        }
      }else{
        return {
          statusCode: 500,
          body: "Une erreur a survenu"
        }
      }
    }
    catch(error){
      return {
        statusCode: 500,
        body: JSON.stringify(error),
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
