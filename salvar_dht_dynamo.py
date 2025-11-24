import serial
import json
import boto3 
from botocore.exceptions import ClientError
from datetime import datetime
import uuid

AWS_ACCESS_KEY_ID = "ASIAZI2LGGRETISCRZK7"
AWS_SECRET_ACCESS_KEY = "F3INRUMR4oRPvbfk9Z7oumB/oyJN2HrW/SEYaKfU"
AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEIL//////////wEaCXVzLXdlc3QtMiJIMEYCIQDV7GkuPOi+r5x3SeuCg2JNT8Y3FlW3KHULJyBHc4qjSAIhAN4fFnpS6WbkLxbTsNbiNul7rvi/J09nLPwGcf50VFS2KrACCEsQABoMNjM3NDIzNDY1NTQ1IgwEP3XLhmE3btLQoqYqjQJW1Fh8Lzrf8wGFXQOeV03ObvHnzIppKbAWpNwVlVZ0REfGaoGknx+68fSvudbiuIY0T8TSnuC91zfkY/EwDfwI9ZlJepiRcx+ugHhtDyAbVAtpjJXkhrX9b1XlcZWh+xy4jD8BnGoXySMWzvuGWBfm+k6xzVablyi6Gw13aM8hHgjvutlEPkrnsE6MV24ZfHHp3oGRxbLxa58vEhdVE/UDyiff3QjrUInzL7At5LOIS6mjy6W2opzJ1EQAxDQk4hDZVXXyaygUMIUsGD08frm9marxhuO1GQ7+4fnDVlOIqZ/Bpe/2hmhUR5698loV+1W35lVklyOugjM4zC7Ldbc1FfIzRRecMr0IGJlcATCb8o7JBjqcAWr4KTjfN73mtg9l3xtvOlrA2vC+eSetz0u7RTNNwxG/y+DzuAyEZ52N5UBTSqUVydVWE3skkJNmRKRy6kvnZ5Rv8Z/hYbBY++6+5GdQYiEX3AsLGd59dqDaTXQYjVw3YLt9MkcBctgd83J0via+paqYMCvzOjN04dpjGC897GHaA1D/9VhDsywFGGix5ifhu3O+QP6salyxkJWOpA=="
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