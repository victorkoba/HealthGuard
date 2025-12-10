import boto3
from datetime import datetime, timedelta
import random
import uuid
from decimal import Decimal

# Conexão com DynamoDB usando as mesmas credenciais do seu app
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGRE6N2C272O',
    aws_secret_access_key='5LMOXHtIxVhrhOqsgKg0c9yStjuEXxov0y77AbZ0',
    aws_session_token='IQoJb3JpZ2luX2VjEKn//////////wEaCXVzLXdlc3QtMiJHMEUCIQCEsBg/r0BA3xNOYxxBimIfOFWqtrbRs9GOnAAaYHzs8QIgV7Wid9YnAGjFT/xaUSA4Q7NljgIwfooK4j7e7Gs3GD8qsAIIchAAGgw2Mzc0MjM0NjU1NDUiDLOzOWlGVqYkBzocySqNAkUOimSgTgCqgG4C8YJmpGNITlFaN3x811iTHwvjsSO4+LJAya7S0km1Q16D82gJv5MuSlvGLdBIzc/s69fuudg/uQl/cTZVFIMZJ/YWIPDYUwG46amapM49cKwCqmNVYHczl1Xkw0xVg850uh6pPecx0IgPNdf93/1no69724yrueHmuNlpFF47ELvXlnIDwZiw12pG3jB5zzzBO3bk2izpvhk1/wtgU3CDeQ/pNONXKXPVHQEeb3XT+hCYlIdwkuADhrK1j7l0T8nZ1jv8Y2KuEVawt3Ind7fAmTiMGEu/bVzhhro1LMkNrrpVgP3uZePvMcrcP3VWZ7lXxsLju6APTOPXStPcIYBZbWXuMLK1l8kGOp0BM9rm7WQCjWXgdVaIfoMedO7RF7khKe8Or+nCB/TalPXljB/s+AyqfAztxhfXXRy9sepj9JqmGdWyDDtadYu+69DqKcUTXBbjSrG7he0DACzTDXIhCDmWqxxCf1/XzbxAZ7CSNiaDth+MqAxJdE8ocdK5zp29bb8MwspknS2V5a0/isLKYjbkJ0hwixd0KdOM3Lo3EFt3d0S9NIRozw=='
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

        temperatura = round(random.uniform(-1.0, 10.0), 1)
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