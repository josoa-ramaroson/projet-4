import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../helpers/todosAcess'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
// import { getUserId } from '../utils';
//import { createTodo } from '../../businessLogic/todos'

import {buildTodo} from '../../helpers/todos'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth');


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   const newTodo: CreateTodoRequest = JSON.parse(event.body)
    // TODO: Implement creating a new TODO item
  const todo = buildTodo(newTodo,event)
  const todoCreated = await createTodo(todo)
  
  logger.info("création de to do")
  
  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todoCreated
    })
  }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
