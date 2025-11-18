import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY4TFDC3YXM";
const AWS_SECRET_ACCESS_KEY = "lIVRETqJbYemEA2G7n9+/NUqJeR+WtPn8gkM61LS";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEP3//////////wEaCXVzLXdlc3QtMiJHMEUCIAdt1UuVfGw5Fu8VYG6dlkNpDjHrdG2B6FxoVErMQ1ORAiEAvkZHvP9t4jFaWSviVCtzdVDz8H6mDXO46FdgQJbX5AoqwQIIxv//////////ARAAGgw2NzEwNTQ0OTczMzciDEY8lLj+VxWV3kRe+yqVAlJwtu+xvFEK/Kg5xVq9vkQbLcUobi2BRMptdGWmvppU/pyuuW4N3TcRwjNCsJUwJti7RoJH4SL+ZMNozWcL5A5qBgALvlfxZCArQs2HAfbZtNc1wZCqDtU9yu97jHOrhGkPvunb+oRXSJccjDaCdhencltAuYUXscW1oIqODMW1j/ZOIezCuP8CMn66Dn7B2DwydRnC/mug0wtL/0evAMapb0TbYqNd0Qu6Y5ol0rReJE9pOYv40+IHYekhl7hhbU+qfiroIGIaSeFQp82CC+hT3/NtNcsulL7dJ5x/OiPs20E3uKrJljv0aEwhHzp0rk8/AdkNNaTFXLXZsMPU4s/htWEbcMLCdvCkkYv59gwOeDJ++LUwitrxyAY6nQFrGp7ECUT+wDchyF6wmj9QRu94Drb2ChBT+gxgU5KiyXWyQ5g6KitjIIzXM7noz5uaRMLH8TB6aShtkTnhCy6AOYsB5Kcg6FVoCzmovbxduTETxhkfymrClH9lDG4JeztsscNtQIrPjHMi/IUACrCNvEWDofMOS+wgolY44ZlIBaQY7XOFifr+RnoY5Mtfm5Nk6MBg3k8wWUHmzM5R"
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
