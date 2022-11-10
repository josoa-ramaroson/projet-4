import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodoAll } from '../../helpers/todosAcess'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const userId = getUserId(event)


    const result = await updateTodoAll(todoId, userId, updatedTodo)

    if(result){
        return {
          statusCode: 200,
          body: ''
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
