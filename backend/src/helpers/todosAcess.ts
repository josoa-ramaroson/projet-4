import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
//import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const attachmentsBucker= process.env.ATTACHMENT_S3_BUCKET
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
//const logger = createLogger('TodosAccess')
const  docClient: DocumentClient = createDynamoDBClient()
// // TODO: Implement the dataLayer logic

export async function createTodo(todo: TodoItem): Promise<TodoItem> {
    await docClient.put({
      TableName: todosTable,
      Item: todo
    }).promise()

    return todo 
  }

  function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }


  export async function getAllTodosByUserId(userId: string):Promise<TodoItem[]>{
    const result = await docClient.query({
        TableName : todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    return result.Items as TodoItem[]
  }

  export async function getTodosById(todoId: string):Promise<TodoItem>{
    const result = await docClient.query({
        TableName : todosTable,
        IndexName: index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()


    const items = result.Items

    if(items.length !==0)
        return result.Items[0] as TodoItem
    
    return null
  }


  export async function updateTodo(todo: TodoItem):Promise<TodoItem>{
    const result = await docClient.update({
        TableName : todosTable,
        Key:{
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()


    
    return result.Attributes as TodoItem 
  }
  export async function deleteTodo(todoId: string,userId:string):Promise<TodoItem>{
    const result = await docClient.delete({
        TableName : todosTable,
        Key:{
            userId: userId,
            todoId: todoId
        }
    }).promise()
    s3.deleteObject({
        Bucket: attachmentsBucker,
        Key: todoId
    })
    .promise()


    
    return result.Attributes as TodoItem 
  }

  export async function updateTodoAll(todoId: string, userId: string, updateRequest:UpdateTodoRequest): Promise<any> {

    try {   
      await this.docClient.update({
        TableName: todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name =:name, #dueDate=:dueDate, #done=:done',
        ExpressionAttributeValues: {
          ':name': updateRequest.name,
          ':dueDate': updateRequest.dueDate,
                      ':done': updateRequest.done ? updateRequest.done : false
        },
        ExpressionAttributeNames: { '#name': 'name', '#dueDate': 'dueDate', '#done':'done' },
        ReturnValues: 'UPDATED_NEW'
      }).promise()

        return true;

  } catch (e) {
    return false
  }
    
}