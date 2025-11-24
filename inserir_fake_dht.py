import boto3
from datetime import datetime, timedelta
import random
import uuid

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGRETISCRZK7',
    aws_secret_access_key='F3INRUMR4oRPvbfk9Z7oumB/oyJN2HrW/SEYaKfU',
    aws_session_token='IQoJb3JpZ2luX2VjEIL//////////wEaCXVzLXdlc3QtMiJIMEYCIQDV7GkuPOi+r5x3SeuCg2JNT8Y3FlW3KHULJyBHc4qjSAIhAN4fFnpS6WbkLxbTsNbiNul7rvi/J09nLPwGcf50VFS2KrACCEsQABoMNjM3NDIzNDY1NTQ1IgwEP3XLhmE3btLQoqYqjQJW1Fh8Lzrf8wGFXQOeV03ObvHnzIppKbAWpNwVlVZ0REfGaoGknx+68fSvudbiuIY0T8TSnuC91zfkY/EwDfwI9ZlJepiRcx+ugHhtDyAbVAtpjJXkhrX9b1XlcZWh+xy4jD8BnGoXySMWzvuGWBfm+k6xzVablyi6Gw13aM8hHgjvutlEPkrnsE6MV24ZfHHp3oGRxbLxa58vEhdVE/UDyiff3QjrUInzL7At5LOIS6mjy6W2opzJ1EQAxDQk4hDZVXXyaygUMIUsGD08frm9marxhuO1GQ7+4fnDVlOIqZ/Bpe/2hmhUR5698loV+1W35lVklyOugjM4zC7Ldbc1FfIzRRecMr0IGJlcATCb8o7JBjqcAWr4KTjfN73mtg9l3xtvOlrA2vC+eSetz0u7RTNNwxG/y+DzuAyEZ52N5UBTSqUVydVWE3skkJNmRKRy6kvnZ5Rv8Z/hYbBY++6+5GdQYiEX3AsLGd59dqDaTXQYjVw3YLt9MkcBctgd83J0via+paqYMCvzOjN04dpjGC897GHaA1D/9VhDsywFGGix5ifhu3O+QP6salyxkJWOpA==',
    )

table = dynamodb.Table('LeiturasDHT')

def inserir_dados_fake():
    agora = datetime.utcnow()

    # Gera 24 horas de dados, a cada 10 minutos
    for i in range(144):  # 144 registros = 24h com intervalo de 10min
        timestamp = agora - timedelta(minutes=i * 10)

        temperatura = round(random.uniform(15.0, 35.0), 1)
        umidade = round(random.uniform(40.0, 90.0), 1)

        item = {
            "id": str(uuid.uuid4()),
            "temperatura": str(temperatura),
            "umidade": str(umidade),
            "timestamp": timestamp.isoformat()
        }

        try:
            table.put_item(Item=item)
            print(f"✅ Inserido: {temperatura}°C em {timestamp}")
        except Exception as e:
            print("❌ Erro ao inserir:", e)

inserir_dados_fake()