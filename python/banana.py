import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import os

# Define the model class
class BananaLeafEfficientNet(nn.Module):
    def __init__(self, num_classes=4):
        super(BananaLeafEfficientNet, self).__init__()
        
        # Load pre-trained EfficientNet-B0
        self.efficientnet = models.efficientnet_b0(pretrained=True)
        
        # Freeze base model parameters
        for param in self.efficientnet.parameters():
            param.requires_grad = False
        
        # Modify the classifier with non-inplace operations
        num_ftrs = self.efficientnet.classifier[1].in_features
        self.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )
    
    def forward(self, x):
        features = self.efficientnet.features(x)
        pooled = self.efficientnet.avgpool(features)
        pooled = torch.flatten(pooled, 1)
        return self.classifier(pooled)

# Load the trained model
def load_trained_model(model_path, device):
    model = BananaLeafEfficientNet(num_classes=4)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.to(device)
    model.eval()
    return model

# Define the image transformation
def preprocess_image(image_path):
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    image = Image.open(image_path).convert('RGB')
    return transform(image).unsqueeze(0)  # Add batch dimension

# Prediction function
def predict(image_path, model, device):
    classes = ['cordana', 'sigatoka', 'pestalotiopsis', 'healthy']
    image_tensor = preprocess_image(image_path).to(device)
    with torch.no_grad():
        outputs = model(image_tensor)
        _, predicted_class = torch.max(outputs, 1)
    return classes[predicted_class.item()]

if __name__ == "__main__":
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_path = "python/models/banana_leaf_disease_final.pth"
    image_path = "python/uploads/banana.jpg"
    
    # Load model
    model = load_trained_model(model_path, device)
    
    # Predict class
    prediction = predict(image_path, model, device)
    print(prediction)
