# HealthGuard - Detecção de Frascos com YOLOv8

Este projeto utiliza **Python**, **OpenCV** e **YOLOv8** para detectar objetos (frascos) em tempo real usando uma câmera. As contagens são salvas em uma tabela do **AWS DynamoDB**.  

O projeto também requer **Node.js** para dependências adicionais do frontend (se houver).

---

## Requisitos

- [Anaconda](https://www.anaconda.com/) (para gerenciar ambientes Python)
- [Python 3.10+](https://www.python.org/downloads/)
- Node.js (para `node_modules`, se houver front-end)
- AWS Account com **DynamoDB** configurado
- Modelo pré-treinado YOLOv8: `yolov8n.pt`

---

## Configuração do Ambiente Python

1. Abra o **Anaconda Prompt**.

2. Crie um ambiente para o projeto:

```bash
conda create -n yolo python=3.10

conda activate yolo

pip install ultralytics opencv-python boto3

#No Node
Intale as dependências com: npm install

#Configurações AWS
Nos arquivos, altere as credenciais da AWS: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN:

-awsConfig.js
-deteccao_frascos.py
-inserir_fake_dht.py (para testes com banco de dados)

#Como depurar o projeto
Ative o ambiente Anaconda: conda activate yolo

Execute o script em pyhton (de acordo com o caminho que está instalado a plaicação): 
caminho_do_arquivo_da_aplicação\python deteccao_frascos.py


