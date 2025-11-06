import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY473KK6ZAP";
const AWS_SECRET_ACCESS_KEY = "hdALnfWwxx/Ti0JrXRQqzgNk71b/K8z2GunCtKsh";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEOL//////////wEaCXVzLXdlc3QtMiJHMEUCIQDZeQ8WqSS7iROOE89+MSxa32113PLDyDQXqnHgrSgqYwIgBRtVzYfhlcf+YGBl4mg5yA4CnTHbKoIrrQPbCWK0PbEqwQIIq///////////ARAAGgw2NzEwNTQ0OTczMzciDIreTNWcthMFXvZ4IiqVAtP+bjtOcvs7C/lhSf7xM2ZKGxfEsQa+jOEklwELtkPideWkOx0kTCv85TitetIK3b+gsGJGwDiSMyYMNqjtqBLdd7yYSXLmvO5ftYbFJJAFBMFpAY7REhs34VLe4vuTVtOn44wXDubvW0Y5+iVakGbRl4cRnZZ16zEbBuIPlzrgh7yNpdNz2ktJiI9jZ1o3NWJ6bqjIup78htjcv4zamOEJsncsT0Ml2TjM78aG8Q6qKkHg+fvNTGYshfD3RdPeCeo20F5tQIAAquqC65sHzXRnxZfjuoIOvMS7LZV8MCAURVT5kQBxBI5xjjFArM0hWtxw42NM4RJ+Wgs47L+RREe4BJO8E6Ww8+2qdElzzuaQj7DQD/ww57OzyAY6nQHx0EkSG3x3g/ONxqKPZhJe0zQmY4lMlSo2LEJtmNHzKj8cpGas//MPxsdTUsRV5JPGjzIBVfoRlm1NbeLqyEAw5+OEybZCDWvAF9j9MTwjNu8rHa7QigSipN6uQHJCN8uEBTk7lkOq2NzbcZ0f7cwBqNnkGjKrxcvkSNNxJpaAqYXUiyd2puG8So22eLHc5uisvJ8G0Qm5saWbOjnC";

// Região da AWS (ajuste se for diferente)
export const REGION = "us-east-1";
export const BUCKET_NAME = "healthguad-profile";

// Configuração do DynamoDB
export const dynamoDB = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN, // apenas se estiver usando credenciais temporárias
  },
});

// Configuração do S3 (caso use upload de imagens)
export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});

export default dynamoDB;
