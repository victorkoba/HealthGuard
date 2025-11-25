import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZI2LGGRE6N2C272O";
const AWS_SECRET_ACCESS_KEY = "5LMOXHtIxVhrhOqsgKg0c9yStjuEXxov0y77AbZ0";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEKn//////////wEaCXVzLXdlc3QtMiJHMEUCIQCEsBg/r0BA3xNOYxxBimIfOFWqtrbRs9GOnAAaYHzs8QIgV7Wid9YnAGjFT/xaUSA4Q7NljgIwfooK4j7e7Gs3GD8qsAIIchAAGgw2Mzc0MjM0NjU1NDUiDLOzOWlGVqYkBzocySqNAkUOimSgTgCqgG4C8YJmpGNITlFaN3x811iTHwvjsSO4+LJAya7S0km1Q16D82gJv5MuSlvGLdBIzc/s69fuudg/uQl/cTZVFIMZJ/YWIPDYUwG46amapM49cKwCqmNVYHczl1Xkw0xVg850uh6pPecx0IgPNdf93/1no69724yrueHmuNlpFF47ELvXlnIDwZiw12pG3jB5zzzBO3bk2izpvhk1/wtgU3CDeQ/pNONXKXPVHQEeb3XT+hCYlIdwkuADhrK1j7l0T8nZ1jv8Y2KuEVawt3Ind7fAmTiMGEu/bVzhhro1LMkNrrpVgP3uZePvMcrcP3VWZ7lXxsLju6APTOPXStPcIYBZbWXuMLK1l8kGOp0BM9rm7WQCjWXgdVaIfoMedO7RF7khKe8Or+nCB/TalPXljB/s+AyqfAztxhfXXRy9sepj9JqmGdWyDDtadYu+69DqKcUTXBbjSrG7he0DACzTDXIhCDmWqxxCf1/XzbxAZ7CSNiaDth+MqAxJdE8ocdK5zp29bb8MwspknS2V5a0/isLKYjbkJ0hwixd0KdOM3Lo3EFt3d0S9NIRozw=="

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