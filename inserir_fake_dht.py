import boto3
from datetime import datetime, timedelta
import random
import uuid
from decimal import Decimal

# Conexão com DynamoDB usando as mesmas credenciais do seu app
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGRET33T4J7D',
    aws_secret_access_key='elJ8xIy4DRULVjHLgOz3Lj2m7sp5hOpp+dJIBJIE',
    aws_session_token='IQoJb3JpZ2luX2VjEJb//////////wEaCXVzLXdlc3QtMiJHMEUCIE5r/BI7naxd+3wDg9nFznthyf4siBG8DXOMLNK+xGnpAiEA8NZOausJJkrn5/bmokoXVuyDwV8Emxc6NKl7n8SbkbgqsAIIXxAAGgw2Mzc0MjM0NjU1NDUiDFeJXEj8gIpN5iIOyyqNAsrCpf4gaGOiR8L3nANwEOSRy+E/onK4ZGqTpixn2ugiQnjXXPY6tQUZhYybpyANYOhYpMv/z2kpueG68fKd94MPF7JnBxKFoIlXCnLrMyQZOnjG9oaXEt8jDuMmk8blwLcXA5AFnbM4iULhqhNVIy5xLmqQ92OgANLRtyvrAYCtU51PJ8QleUqYehFHzedj1EiQBls0srUtIUg8F21a1YIj4L5bEuF1AG4vINiPNrEEeA2JVnfAeVvueCd7jyrcuknXnKMcu+kCR4uy+tYzgB/wisvjrDEj8vbDU4u5ckxRw55GcKk2TvClHNLQ6Qoy6ViyaOBis13apbLhfT90uPRBHoK8Uqz+JijBcGnjMLCck8kGOp0Bffc1gFLQ3OfzoEFl3vpCuZ8UApt8rSjPWAlx/43vPB8OHoHkK39aE9RJFI3LPLFjTnycVG+3OmuUITzmgmtqvkI8l4l097GwTkvjdJ0XmdDS0Ln8K5RMnW+4ShdKBZTkTvVVKMn7zlqzCnRo+kVc58Oec9bK+9urW7qq8OHxPjrdJh/uxQNQnZncnKHKzQLY0DAZpqV6JhVzu/Dsxg=='
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