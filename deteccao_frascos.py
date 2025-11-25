import cv2
from ultralytics import YOLO
import boto3
from datetime import datetime
from collections import defaultdict
import time

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGRET33T4J7D',
    aws_secret_access_key='elJ8xIy4DRULVjHLgOz3Lj2m7sp5hOpp+dJIBJIE',
    aws_session_token='IQoJb3JpZ2luX2VjEJb//////////wEaCXVzLXdlc3QtMiJHMEUCIE5r/BI7naxd+3wDg9nFznthyf4siBG8DXOMLNK+xGnpAiEA8NZOausJJkrn5/bmokoXVuyDwV8Emxc6NKl7n8SbkbgqsAIIXxAAGgw2Mzc0MjM0NjU1NDUiDFeJXEj8gIpN5iIOyyqNAsrCpf4gaGOiR8L3nANwEOSRy+E/onK4ZGqTpixn2ugiQnjXXPY6tQUZhYybpyANYOhYpMv/z2kpueG68fKd94MPF7JnBxKFoIlXCnLrMyQZOnjG9oaXEt8jDuMmk8blwLcXA5AFnbM4iULhqhNVIy5xLmqQ92OgANLRtyvrAYCtU51PJ8QleUqYehFHzedj1EiQBls0srUtIUg8F21a1YIj4L5bEuF1AG4vINiPNrEEeA2JVnfAeVvueCd7jyrcuknXnKMcu+kCR4uy+tYzgB/wisvjrDEj8vbDU4u5ckxRw55GcKk2TvClHNLQ6Qoy6ViyaOBis13apbLhfT90uPRBHoK8Uqz+JijBcGnjMLCck8kGOp0Bffc1gFLQ3OfzoEFl3vpCuZ8UApt8rSjPWAlx/43vPB8OHoHkK39aE9RJFI3LPLFjTnycVG+3OmuUITzmgmtqvkI8l4l097GwTkvjdJ0XmdDS0Ln8K5RMnW+4ShdKBZTkTvVVKMn7zlqzCnRo+kVc58Oec9bK+9urW7qq8OHxPjrdJh/uxQNQnZncnKHKzQLY0DAZpqV6JhVzu/Dsxg=='
)
table = dynamodb.Table('contagemItems')

model = YOLO("C:\\Users\\jacqu\\yolov8n.pt")
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
