import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZI2LGGRET33T4J7D";
const AWS_SECRET_ACCESS_KEY = "elJ8xIy4DRULVjHLgOz3Lj2m7sp5hOpp+dJIBJIE";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEJb//////////wEaCXVzLXdlc3QtMiJHMEUCIE5r/BI7naxd+3wDg9nFznthyf4siBG8DXOMLNK+xGnpAiEA8NZOausJJkrn5/bmokoXVuyDwV8Emxc6NKl7n8SbkbgqsAIIXxAAGgw2Mzc0MjM0NjU1NDUiDFeJXEj8gIpN5iIOyyqNAsrCpf4gaGOiR8L3nANwEOSRy+E/onK4ZGqTpixn2ugiQnjXXPY6tQUZhYybpyANYOhYpMv/z2kpueG68fKd94MPF7JnBxKFoIlXCnLrMyQZOnjG9oaXEt8jDuMmk8blwLcXA5AFnbM4iULhqhNVIy5xLmqQ92OgANLRtyvrAYCtU51PJ8QleUqYehFHzedj1EiQBls0srUtIUg8F21a1YIj4L5bEuF1AG4vINiPNrEEeA2JVnfAeVvueCd7jyrcuknXnKMcu+kCR4uy+tYzgB/wisvjrDEj8vbDU4u5ckxRw55GcKk2TvClHNLQ6Qoy6ViyaOBis13apbLhfT90uPRBHoK8Uqz+JijBcGnjMLCck8kGOp0Bffc1gFLQ3OfzoEFl3vpCuZ8UApt8rSjPWAlx/43vPB8OHoHkK39aE9RJFI3LPLFjTnycVG+3OmuUITzmgmtqvkI8l4l097GwTkvjdJ0XmdDS0Ln8K5RMnW+4ShdKBZTkTvVVKMn7zlqzCnRo+kVc58Oec9bK+9urW7qq8OHxPjrdJh/uxQNQnZncnKHKzQLY0DAZpqV6JhVzu/Dsxg=="

export const REGION = "us-east-1";
export const BUCKET_NAME = "healthguard-profile";

const client = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});

export const dynamoDB = DynamoDBDocumentClient.from(client);

// S3 (provavelmente us-east-1 mesmo)
export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});