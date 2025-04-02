import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import os
import locale  
import sys
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

classes = ['miner', 'nodisease', 'phoma', 'rust']

model = load_model("python/models/Coffee_disease_ResNet.h5")

def preprocess_image(image_path):
    image = cv2.imread(image_path)
    image = cv2.resize(image, (300, 150)) 
    image = image / 255.0 
    image = np.expand_dims(image, axis=0)  
    return image

if __name__ == "__main__":
    image_path = "python/uploads/coffee.jpg"
    processed_image = preprocess_image(image_path)
    
    predictions = model.predict(processed_image)
    print(predictions)
    predicted_class = np.argmax(predictions)
    predicted_label = classes[predicted_class]
    
    print(predicted_label)
