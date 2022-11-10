 import * as AWS from 'aws-sdk'

const AWSXRay = require('aws-xray-sdk')


const XAWS = AWSXRay.captureAWS(AWS)
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
  })
// // TODO: Implement the fileStogare logic
const bucketname = process.env.ATTACHMENT_S3_BUCKET

export function getUploadUrl(todoId: string) {
    const signedUrl =  s3.getSignedUrl('putObject', {
      Bucket: bucketname,
      Key: todoId,
      Expires: 60000
    })

    return signedUrl
  }