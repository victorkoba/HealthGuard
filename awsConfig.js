import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY43PMN6CG2";
const AWS_SECRET_ACCESS_KEY = "uCpXHTg18N6/i3LbjxX7brMOFwAjzXjuMu+uhGd4";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEOP//////////wEaCXVzLXdlc3QtMiJHMEUCIQCsb7HMWAMCovR4qr9nEumTApdT9RF8zD0kL3EN0pOC/wIgLaa4LGZMerN/woEPsvilD2RjNRjzaptCiFi6YjeDqe8qwQIIrP//////////ARAAGgw2NzEwNTQ0OTczMzciDLvz5F1qqqwhuRoOxyqVAlza+htPj0Kj8FmjnjryuaRxuLtpZ/CNf0RdAsvc0DKPWMA2tRSMTcwk7XWXrroRqVLG1yL558hQAgkxtLp0VOGp+J20VOzgZCBrXWYv4WVuMlKqZgUBXkxO27sa1I9MHfCKAJh030GIefOc7Dn7VsZ2Y6uIwB7/SpD17MwnW6bKQgMHYH/KzTfDA5lc3fY2VpE2fIo3GnX6r6uE1iOdLiUe/j8+TzC/wJqWqiit6377mvdF/T4cCoc4QR7+vaSyqhkgp3/rPSy/J+XKF33PdrshOUiMipURPqzVAxtmaaCzCMp24qm7NzAOFhj2s8V1hT1qocNpzQTTFs3dhFa5Gq9zrqOxdGTIwhvIku3Fs+PHNAmIzvwwo+WzyAY6nQF2uW9sg8oej8yYOEHkDTOXvwLbJQ0RtegvOmO96mB+bpxfbpswda8+yH40VGL4UI53mPyf8bDcX0rxqvTmS00H3ayi55kq7gcF6gpzud/+wDkN6EhEUPHd4QmD3BgUhoQ8CG94z2QKEN0bOd1lKIk2Uw/NFtVT64qrZD+x3pRiUayQnkrhaSd4ofEq5AzCenwKkVXR54qLJSbSNrUf";

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
