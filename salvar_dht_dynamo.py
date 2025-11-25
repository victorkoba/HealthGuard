import serial
import json
import boto3 
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

AWS_ACCESS_KEY_ID = "ASIAZI2LGGREVWCQQWAY"
AWS_SECRET_ACCESS_KEY = "BmIAKN9zsB5L+vgVEKayGz979oA80k7u7NBdbvRT"
AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEJD//////////wEaCXVzLXdlc3QtMiJIMEYCIQCmURBbNbHaFLz890yqx5FKIfsWNOnUokM7AXbGU/euogIhAKtswufJEWvDt8db3WTz/tqPjqBmJvefVqKa24gxqgR4KrACCFkQABoMNjM3NDIzNDY1NTQ1Igy33z+aBmQlKanAYXEqjQJ8bxxtmeNPLjs1TGtg5U7SlaSRgMknPd/Uq1yym00pe7RYCVJp093vXXZcF9y0MFeltioR+qyfgg+tWtkrhe775rV+Rt7Bdj9BcfB6mMXb7b9Q3BKVrdHaeuPHcpnbN2mGRnk63ZxU7zMPjEib3zXff1IT1AUjuZrmm607pl1d4aKsybSY933FbachhvmBZGKIlIyIXpQmxMIvmdDClqwq32qD2C60HDtqsGmmPN4GFGorH5YaKFky73aOxAtkH07ZxRZgaywQonfG6DvVTNJQF+Hr36p7I8qCrPNHWOb64AOQX8AgK6UES/oXzFgEYE5tSXJe19j25AtffyRsUnrK/1ZG2HTzL+JiCWw93TD4iZLJBjqcAalDps/mT5jgZrFtEUkpovwfrmBYu3RKwg02EjQj9Q20DPORcM28OVIqDnrhMS8mIvQv5QxLDd+9rzMxV4TAETRuG4h/Q3gxCJLCo4H554GGlQaEW9iNAKkarxXx4T8PVx9SA0uvC1RPsMAuWgeJ6ol9WOoBOb1Dxg3IGsTGJWT4RgGYm5CR+UZq/PrybRwc8ZjMxPvgvx2npi2HMg=="
REGION = "us-east-1"

dynamodb = boto3.resource(
    'dynamodb',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    aws_session_token=AWS_SESSION_TOKEN,
    region_name=REGION,
)

# PORTA SERIAL DO ARDUINO
SERIAL_PORT = "COM8" 
BAUDRATE = 115200

TABLE_NAME = "LeiturasDHT"
table = dynamodb.Table(TABLE_NAME)

def salvar_no_dynamo(data):
    try:
        timestamp = datetime.now().isoformat()
        item = {
            'id': str(uuid.uuid4()),
            'timestamp': timestamp,
            'temperatura': str(data.get('temperatura')),
            'umidade': str(data.get('umidade'))
        }

        print(f"Tentando salvar item: {item}")

        table.put_item(
            Item=item
        )
        print(f"Sucesso! Item salvo no DynamoDB às {timestamp}")

    except ClientError as e:
        print("ERRO NO DYNAMODB: Falha ao salvar o item.")
        # O erro detalhado da AWS: (ex: falta de permissão na tabela)
        print(e.response['Error']['Message']) 
        
    except Exception as e:
        # Qualquer outro erro
        print(f"ERRO DESCONHECIDO: {e}")
def iniciar_leitura():
    ser = serial.Serial(SERIAL_PORT, BAUDRATE)
    print(f"Conectado à porta {SERIAL_PORT}")

    while True:
        linha = ser.readline().decode("utf-8").strip()

        if linha:
            try:
                data = json.loads(linha)
                print("JSON Carregado com Sucesso.")        
                salvar_no_dynamo(data)
            except Exception as e:
                print("Erro ao processar:", linha, "| Erro:", e)
if __name__ == "__main__":
    iniciar_leitura()