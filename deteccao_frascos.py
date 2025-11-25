import cv2
from ultralytics import YOLO
import boto3
from datetime import datetime
from collections import defaultdict
import time

dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-east-1',
    aws_access_key_id='ASIAZI2LGGREVAK7LPUJ',
    aws_secret_access_key='U1sQj+0Cx4BUNzfoIc9a/wTMeulNGoZSq/IoriDz',
    aws_session_token='IQoJb3JpZ2luX2VjEKX//////////wEaCXVzLXdlc3QtMiJHMEUCIQCBEgOptQJV87DoqzEDzdD4jRDQ/Lq23r6wAi/Z9lmFrQIgTGRhDTHdplCRDbmlI42heU2+IZZ3/FyUIGJkD/qQtR8qsAIIbhAAGgw2Mzc0MjM0NjU1NDUiDNy5PHgb30lMeDiPZCqNAsvkPEbIWkp1hYGJbuaBEVqjzqm+MYmzFgtL6TbP7OMVWp/O5IZrzlgUOIT7ycsDu65dFqmvn1GWzfVOpMuid+/MJ8woyLXG+keSLvd8/vJIHrXMt+RLCSzc0SicnoQ1zMuqr3M3PQjnGza67MZiv7wLvdCod8lxPjczoV1oGopBjdVe2UilVG6nTFFtZM4FlZoxa52L1YMCS/h9b4o9LWRlSkVFRyHnmK+EMd+s3migp5d3Agh/9gAlzoNNiiKvNXNskOuOmjSH6MPEpF/v3EGvRVZAXRV3Oh2LmTyCNADZ0azP1blaYAq0IdKeZL9oW5AplAmlnxXh6glh/esf4mxuz4Vz8XrP9xj2viRkMJrElskGOp0BbyDDv7fKBwS0AcTyosBEaWVLBABgodoUCkuSkgS9nYDgE70kjc3g4lrRcth+ZOGen8qySK9ZpeRdWSntG/Kn/e77I0Hc1q2bAY/HTotFIVKgq6S67kbB8ztnK+I5xPfb/JqvBE66LBxEOLRkZ6J6grSVDTzNJBgwHeY/MbCAuVNOwJWsvxQV0T7DK7U+UGdcKmNTvZEr3U18BrrR2g=='
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
