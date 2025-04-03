import tensorflow as tf
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import os
import json

class AttentionLayer(tf.keras.layers.Layer):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        
    def build(self, input_shape):
        self.W = self.add_weight(
            name='attention_weight',
            shape=(input_shape[-1], 1),
            initializer='glorot_uniform',
            trainable=True
        )
        super().build(input_shape)
        
    def call(self, x):
        attention_weights = tf.nn.softmax(tf.matmul(x, self.W) + tf.keras.backend.epsilon(), axis=1)
        attended_output = x * attention_weights
        return attended_output
    
    def get_config(self):
        config = super().get_config()
        return config

with tf.keras.utils.custom_object_scope({'AttentionLayer': AttentionLayer}):
    model = load_model("python/models/coffee_final_model.h5")

classes = [
    "boron", "calcium", "healthy", "iron", 
    "magnesium", "manganese", "nitrogen", 
    "phosphorus", "potasium"
]

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
    image_path = "python/uploads/coffee.jpg" 
    if detect_leaf(image_path):
        processed_image = preprocess_image(image_path)
        
        predictions = model.predict(processed_image)
        
        predicted_class = np.argmax(predictions)
        predicted_label = classes[predicted_class]
        
        confidence = predictions[0][predicted_class] * 100
        print(json.dumps({
            "predicted_label": predicted_label,
            "confidence": confidence,
        }))
    else:
        print("No leaf detected in the image.")
