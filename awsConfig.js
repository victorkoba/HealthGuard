import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZI2LGGREVAK7LPUJ";
const AWS_SECRET_ACCESS_KEY = "U1sQj+0Cx4BUNzfoIc9a/wTMeulNGoZSq/IoriDz";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEKX//////////wEaCXVzLXdlc3QtMiJHMEUCIQCBEgOptQJV87DoqzEDzdD4jRDQ/Lq23r6wAi/Z9lmFrQIgTGRhDTHdplCRDbmlI42heU2+IZZ3/FyUIGJkD/qQtR8qsAIIbhAAGgw2Mzc0MjM0NjU1NDUiDNy5PHgb30lMeDiPZCqNAsvkPEbIWkp1hYGJbuaBEVqjzqm+MYmzFgtL6TbP7OMVWp/O5IZrzlgUOIT7ycsDu65dFqmvn1GWzfVOpMuid+/MJ8woyLXG+keSLvd8/vJIHrXMt+RLCSzc0SicnoQ1zMuqr3M3PQjnGza67MZiv7wLvdCod8lxPjczoV1oGopBjdVe2UilVG6nTFFtZM4FlZoxa52L1YMCS/h9b4o9LWRlSkVFRyHnmK+EMd+s3migp5d3Agh/9gAlzoNNiiKvNXNskOuOmjSH6MPEpF/v3EGvRVZAXRV3Oh2LmTyCNADZ0azP1blaYAq0IdKeZL9oW5AplAmlnxXh6glh/esf4mxuz4Vz8XrP9xj2viRkMJrElskGOp0BbyDDv7fKBwS0AcTyosBEaWVLBABgodoUCkuSkgS9nYDgE70kjc3g4lrRcth+ZOGen8qySK9ZpeRdWSntG/Kn/e77I0Hc1q2bAY/HTotFIVKgq6S67kbB8ztnK+I5xPfb/JqvBE66LBxEOLRkZ6J6grSVDTzNJBgwHeY/MbCAuVNOwJWsvxQV0T7DK7U+UGdcKmNTvZEr3U18BrrR2g=="

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