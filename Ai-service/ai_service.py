from fastapi import FastAPI, UploadFile, File
from PIL import Image
import torch
import torchvision.transforms as transforms
import torchvision.models as models
import io

app = FastAPI()

model = models.mobilenet_v2(pretrained=True)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def classify(conf):
    if conf > 0.5:
        return "severe"
    elif conf > 0.75:
        return "moderate"
    else:
        return "mild"

@app.post("/predict")
async def predict(images: list[UploadFile] = File(...)):
    max_conf = 0

    for img in images:
        img_bytes = await img.read()
        image = Image.open(io.BytesIO(img_bytes)).convert("RGB")
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            out = model(tensor)
            prob = torch.softmax(out, dim=1)
            conf = prob.max().item()

        max_conf = max(max_conf, conf)

    return {
        "severity": classify(max_conf),
        "confidence": round(max_conf, 2)
    }
