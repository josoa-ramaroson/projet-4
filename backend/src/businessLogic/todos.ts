// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
 import { CreateTodoRequest } from '../requests/CreateTodoRequest'
 
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
import { TodoItem } from '../models/TodoItem'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
export function buildTodo(todoRequest:CreateTodoRequest,event):TodoItem{
    const todo = {
        todoId: uuid.v4(),
        createdAt:new Date().toISOString(),
        userId: getUserId(event),
        done:false,
        attachmentUrl: '',
        ...todoRequest
    }
    return todo as TodoItem
}
