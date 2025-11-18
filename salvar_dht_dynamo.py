import serial
import json
import boto3 
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

AWS_ACCESS_KEY_ID = "ASIAZI2LGGRE3CRRTXE3"
AWS_SECRET_ACCESS_KEY = "ocWdg/JhYj6JoXGxkxMF9c4pyWFSJLIcgGJOpp4X"
AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEAAaCXVzLXdlc3QtMiJIMEYCIQDmvjUeIqWN4G8kApiIh81rOrav9oJwhUg0S1Xb1inAfgIhANx1KjC0SA+UncV96axRfxaJAOoxYIOpgPmhtYYp2ZaLKrkCCMn//////////wEQABoMNjM3NDIzNDY1NTQ1Igz9yfxr156yzmzEaWoqjQLAmfLOkSPkKM3sMQZusoRImR6wj4UmeM52wqFLU1nVmquVXGG6IwKNaitW6r/J0+XxREMMUfvVD03zM+7z9SDYywtdtrWfreA/M9fntfFthlBePZ6Sm6J26O9UYOOHqVqD2A7oeC8C/6YLXpyCyleDzai5doYWqvWh/hqm/wfOcj2wPBvXJaKlwovt7/VWQce0tca79YHZDeP56YZxMlyMOtZ74ZA2lHICXMrRvNVB27HvxJjDFpWJ5unrDRExjGw3BMf3a4uDF6XujYDKDCTa0uGGC4eZr+N9qBxTzHnJWq2AWDWcgwipeWATwyWmoPQRA60k0/zXyZGgnmuqyRObLfwxuZlkk99pmzQ8oTC+ovLIBjqcARuhvprkq79CnHlBbOUaC3aJNnZLmSWy3dV2h+hE14lYTm3umMzrjTGEinGsIJ8DmVCGfcaZwVUdr1IxP3UPSd8/AiunJyZEwU+Tv4dfPLPqmMLXt7PoVPMm5EqOC9WEIS8emNlpwJycbf43+KS7VEDEHlv1/s/4561AskU6CjZG35I8WAOD1sy2IjOGZ9NRUUFPxdhP5ytEngnSfQ=="
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