import tensorflow as tf
import numpy as np
import cv2
import json
import os
import locale  
import sys
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")
from tensorflow.keras.models import load_model

model = load_model("python/models/best_banana_model.keras")

classes = ["boron", "calcium", "healthy", "iron", "magnesium", "manganese", "potassium", "sulphur", "zinc"]

def preprocess_image(image_path):
    """Load and preprocess the image for prediction."""
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, (224, 224))
    image = image.astype(np.float32) / 255.0
    image = np.expand_dims(image, axis=0) 
    return image

def detect_leaf(image_path):
    """Detect whether the image contains a leaf using basic image processing."""
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    hsv_image = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv_image, lower_green, upper_green)
    green_percentage = np.sum(green_mask) / (image.shape[0] * image.shape[1])
    if green_percentage > 0.2:
        return True
    else:
        return False

if __name__ == "__main__":
    image_path = "python/uploads/banana.jpg"
    
    if not detect_leaf(image_path):
        print("No leaf detected in the image")
    else:
        processed_image = preprocess_image(image_path)

        predictions = model.predict(processed_image)

        predicted_class = np.argmax(predictions)
        predicted_label = classes[predicted_class]

        confidence = predictions[0][predicted_class] * 100

        print(json.dumps({
            "predicted_label": predicted_label,
            "confidence": confidence,
        }))
