import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todosAcess'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    const userId = getUserId(event)

    logger.info("suppression d'un todo");

    const result = await deleteTodo(todoId,userId);
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
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
