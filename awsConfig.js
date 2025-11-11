import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY42ZOOANHN";
const AWS_SECRET_ACCESS_KEY = "sSqLvAWI/Gjluv5F351pMDKe643bPF3SXC5/Urwe";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEFQaCXVzLXdlc3QtMiJHMEUCIEPtvVMbfYR6V+PsaS4Sod/lEW/XRoI/9ya9St8YEzGxAiEAt/+93FEY9jfhchG+zYuhOLOGd18IWSZUzUmIw+u2ZIUquAIIHRAAGgw2NzEwNTQ0OTczMzciDL/zHH5EDHhzGOss0iqVAtg3qFbr0YylhtjHJOQmwXnXOORpmKpArlRRG1hXgeG2QCohVphhsbDemlfWHbUbiNzhOc3/M9CDcGKDoCLrkR8S7YYUjM3fq3lYENm17EhsncRcT30lYkFfgcJ2fAXig+Thwdrg5y9jTcrd95UtLF1F1kZHZIFetTCky1tgxC4nu1CEn3Tmu9OQ6emvWD2tnxeWOS2Tm8rw0Smj5TjPohfqGkprCGBc69ERqEHxJZf4EeSGXAYWckq/EgicyWyjaxoOMYKOfK6vQLlxLnQFvPQjwAq7KTd3HurhJUOjoi6lLwiZLYuJnPP+eD9NZR7MZDsNmukgIPeruBBbvs3X1qHhMv7Pe2eDHrpv5k6KPht189pOu48w1MPMyAY6nQFhIZ90xmewWCaf+Tz++SEKia6hbfrrnckWNTFsDu+iGVUXXtbSdefSp5HjPnu8AUIw7Q9hbps1y6ivZo3bZlA+2v/3cMTUPotAIHBbeAh8Mjvqnxnnlk/kYdiKmWz/01hoFxgB2TWZMtoCZuhv8KC41J8GN1WEnrgAs3B67uRM0Y+tr+u/+iICVacq9Apox3irCow/o+piF9+KKAdE";

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
