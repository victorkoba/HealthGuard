import cv2
from ultralytics import YOLO
import boto3
from datetime import datetime
from collections import defaultdict
import time

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGRE6N2C272O',
    aws_secret_access_key='5LMOXHtIxVhrhOqsgKg0c9yStjuEXxov0y77AbZ0',
    aws_session_token='IQoJb3JpZ2luX2VjEKn//////////wEaCXVzLXdlc3QtMiJHMEUCIQCEsBg/r0BA3xNOYxxBimIfOFWqtrbRs9GOnAAaYHzs8QIgV7Wid9YnAGjFT/xaUSA4Q7NljgIwfooK4j7e7Gs3GD8qsAIIchAAGgw2Mzc0MjM0NjU1NDUiDLOzOWlGVqYkBzocySqNAkUOimSgTgCqgG4C8YJmpGNITlFaN3x811iTHwvjsSO4+LJAya7S0km1Q16D82gJv5MuSlvGLdBIzc/s69fuudg/uQl/cTZVFIMZJ/YWIPDYUwG46amapM49cKwCqmNVYHczl1Xkw0xVg850uh6pPecx0IgPNdf93/1no69724yrueHmuNlpFF47ELvXlnIDwZiw12pG3jB5zzzBO3bk2izpvhk1/wtgU3CDeQ/pNONXKXPVHQEeb3XT+hCYlIdwkuADhrK1j7l0T8nZ1jv8Y2KuEVawt3Ind7fAmTiMGEu/bVzhhro1LMkNrrpVgP3uZePvMcrcP3VWZ7lXxsLju6APTOPXStPcIYBZbWXuMLK1l8kGOp0BM9rm7WQCjWXgdVaIfoMedO7RF7khKe8Or+nCB/TalPXljB/s+AyqfAztxhfXXRy9sepj9JqmGdWyDDtadYu+69DqKcUTXBbjSrG7he0DACzTDXIhCDmWqxxCf1/XzbxAZ7CSNiaDth+MqAxJdE8ocdK5zp29bb8MwspknS2V5a0/isLKYjbkJ0hwixd0KdOM3Lo3EFt3d0S9NIRozw=='
)
table = dynamodb.Table('contagemItems')

model = YOLO("yolov8n.pt")
#model = YOLO("./yolov8n.pt")
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Erro ao abrir a câmera")
    exit()

current_counts = defaultdict(int)
last_seen = defaultdict(lambda: time.time())
TIMEOUT = 2.0  # segundos antes de reduzir quantidade

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)
    annotated_frame = results[0].plot()

    # Contagem atual no frame
    frame_counts = defaultdict(int)
    for cls in results[0].boxes.cls:
        class_name = model.names[int(cls)]
        frame_counts[class_name] += 1
        last_seen[class_name] = time.time()

    # Atualiza current_counts e banco
    for item, count in frame_counts.items():
        current_counts[item] = count
        table.update_item(
            Key={'id': item},
            UpdateExpression="""
                SET #it = :item,
                    quantidade = :quantidade,
                    ultimaanteracao = :hora
            """,
            ExpressionAttributeNames={
                '#it': 'item'
            },
            ExpressionAttributeValues={
                ':item': item,
                ':quantidade': current_counts[item],
                ':hora': datetime.utcnow().isoformat()
            }
        )

    # Reduz quantidade se o item não aparecer por TIMEOUT
    for item in list(current_counts.keys()):
        if item not in frame_counts and time.time() - last_seen[item] > TIMEOUT:
            current_counts[item] = max(current_counts[item] - 1, 0)
            table.update_item(
                Key={'id': item},
                UpdateExpression="""
                    SET quantidade = :quantidade,
                        ultimasaidaitem = :hora
                """,
                ExpressionAttributeValues={
                    ':quantidade': current_counts[item],
                    ':hora': datetime.utcnow().isoformat()
                }
            )

    cv2.imshow("Detecção de Objetos", annotated_frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
