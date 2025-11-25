import boto3
from datetime import datetime, timedelta
import random
import uuid
from decimal import Decimal

# Conexão com DynamoDB usando as mesmas credenciais do seu app
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGREVAK7LPUJ',
    aws_secret_access_key='U1sQj+0Cx4BUNzfoIc9a/wTMeulNGoZSq/IoriDz',
    aws_session_token='IQoJb3JpZ2luX2VjEKX//////////wEaCXVzLXdlc3QtMiJHMEUCIQCBEgOptQJV87DoqzEDzdD4jRDQ/Lq23r6wAi/Z9lmFrQIgTGRhDTHdplCRDbmlI42heU2+IZZ3/FyUIGJkD/qQtR8qsAIIbhAAGgw2Mzc0MjM0NjU1NDUiDNy5PHgb30lMeDiPZCqNAsvkPEbIWkp1hYGJbuaBEVqjzqm+MYmzFgtL6TbP7OMVWp/O5IZrzlgUOIT7ycsDu65dFqmvn1GWzfVOpMuid+/MJ8woyLXG+keSLvd8/vJIHrXMt+RLCSzc0SicnoQ1zMuqr3M3PQjnGza67MZiv7wLvdCod8lxPjczoV1oGopBjdVe2UilVG6nTFFtZM4FlZoxa52L1YMCS/h9b4o9LWRlSkVFRyHnmK+EMd+s3migp5d3Agh/9gAlzoNNiiKvNXNskOuOmjSH6MPEpF/v3EGvRVZAXRV3Oh2LmTyCNADZ0azP1blaYAq0IdKeZL9oW5AplAmlnxXh6glh/esf4mxuz4Vz8XrP9xj2viRkMJrElskGOp0BbyDDv7fKBwS0AcTyosBEaWVLBABgodoUCkuSkgS9nYDgE70kjc3g4lrRcth+ZOGen8qySK9ZpeRdWSntG/Kn/e77I0Hc1q2bAY/HTotFIVKgq6S67kbB8ztnK+I5xPfb/JqvBE66LBxEOLRkZ6J6grSVDTzNJBgwHeY/MbCAuVNOwJWsvxQV0T7DK7U+UGdcKmNTvZEr3U18BrrR2g=='
)

# Nome da tabela unificada
TABELA_UNIFICADA = "LeiturasDHT"

def inserir_dados_fake():
    agora = datetime.now()  # Usar datetime.now() para horário local

    print("\nInserindo 24h de dados FAKE...\n")

    # 144 registros (24h em intervalos de 10 minutos)
    for i in range(144):
        timestamp_dt = agora - timedelta(minutes=i * 10)
        
        # Formatar timestamp como string: "DD/MM/YYYY HH:MM:SS"
        timestamp_str = timestamp_dt.strftime("%d/%m/%Y %H:%M:%S")

        temperatura = round(random.uniform(15.0, 35.0), 1)
        umidade = round(random.uniform(40.0, 90.0), 1)

        # Freezer aleatório entre 1 e 4 (ajustei para 4 freezers como no app)
        freezer_id = random.randint(1, 3)

        nome_tabela = f"freezer{freezer_id}"
        tabela_freezer = dynamodb.Table(nome_tabela)
        tabela_unificada = dynamodb.Table(TABELA_UNIFICADA)

        item_comum = {
            "id": str(uuid.uuid4()),
            "freezerId": freezer_id,  # Salvar como número (não string)
            "temperatura": Decimal(str(temperatura)),
            "umidade": Decimal(str(umidade)),
            "timestamp": timestamp_str,  # String formatada: "24/11/2025 14:30:00"
            "unidade": "°C"  # Adicionar unidade
        }

        try:
            # Inserir na tabela do freezer
            tabela_freezer.put_item(Item=item_comum)

            # Inserir também na tabela unificada
            tabela_unificada.put_item(Item=item_comum)

            print(f"Freezer {freezer_id} — {temperatura}°C | {timestamp_str}")

        except Exception as e:
            print(f"Erro ao inserir no Freezer {freezer_id}:", e)

    print("\nFINALIZADO! Leituras inseridas nos freezers e na tabela unificada.\n")


if __name__ == "__main__":
    inserir_dados_fake()