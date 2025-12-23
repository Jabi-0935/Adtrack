from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from contextlib import asynccontextmanager
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import os
import requests  # <--- Added this

from model_arch import ResearchHybridModel
from preprocessing import ChaParser

CONFIG = {
    'model_name': 'microsoft/deberta-base',
    'max_seq_len': 64,
    'max_word_len': 40,
    'device': torch.device("cuda" if torch.cuda.is_available() else "cpu"),
    'threshold': 0.20,
    # PASTE YOUR COPIED HUGGING FACE LINK BELOW
    'model_url': "https://huggingface.co/YOUR_USERNAME/YOUR_REPO/resolve/main/best_alzheimer_model.pth"
}

ml_components = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading Model and Tokenizer...")
    ml_components['tokenizer'] = AutoTokenizer.from_pretrained(CONFIG['model_name'])
    
    # --- MODEL DOWNLOAD LOGIC START ---
    model_path = "best_alzheimer_model.pth"
    
    if not os.path.exists(model_path):
        print(f"Model file not found. Downloading from Hugging Face...")
        try:
            response = requests.get(CONFIG['model_url'], stream=True)
            response.raise_for_status()
            with open(model_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            print("Download complete.")
        except Exception as e:
            print(f"Error downloading model: {e}")
            raise RuntimeError("Failed to download model file")
    # --- MODEL DOWNLOAD LOGIC END ---

    model = ResearchHybridModel(model_name=CONFIG['model_name'])
    
    # Load state dict
    state_dict = torch.load(model_path, map_location=CONFIG['device'])
    
    if list(state_dict.keys())[0].startswith('module.'):
        state_dict = {k[7:]: v for k, v in state_dict.items()}
    
    model.load_state_dict(state_dict)
    model.to(CONFIG['device'])
    model.eval()
    ml_components['model'] = model
    print("Model Loaded Successfully.")
    yield
    ml_components.clear()

app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://adtrack.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SentenceAttention(BaseModel):
    sentence: str
    attention_score: float

class PredictionResponse(BaseModel):
    filename: str
    prediction: str
    confidence: float
    is_dementia: bool
    attention_map: List[SentenceAttention]

@app.post("/predict/cha", response_model=PredictionResponse)
async def predict_cha_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.cha'):
        raise HTTPException(status_code=400, detail="Only .cha files are supported")
    
    contents = await file.read()
    lines = contents.splitlines()
    
    parser = ChaParser()
    sentences, features, _ = parser.parse(lines)
    
    if not sentences:
        raise HTTPException(status_code=400, detail="No *PAR lines found in file")

    if len(sentences) > CONFIG['max_seq_len']:
        sentences = sentences[-CONFIG['max_seq_len']:]
        features = features[-CONFIG['max_seq_len']:]

    tokenizer = ml_components['tokenizer']
    model = ml_components['model']
    
    encoding = tokenizer(
        sentences, 
        padding='max_length', 
        truncation=True, 
        max_length=CONFIG['max_word_len'], 
        return_tensors='pt'
    )
    
    ids = encoding['input_ids'].unsqueeze(0).to(CONFIG['device'])
    mask = encoding['attention_mask'].unsqueeze(0).to(CONFIG['device'])
    feats = torch.tensor(features, dtype=torch.float32).unsqueeze(0).to(CONFIG['device'])
    lengths = torch.tensor([len(sentences)])
    
    with torch.no_grad():
        logits, attn_weights_tensor = model(ids, mask, feats, lengths)
        prob = F.softmax(logits, dim=1)[:, 1].item()
        
    attn_weights = attn_weights_tensor.cpu().numpy().flatten()
    attn_weights = attn_weights[:len(sentences)]
    
    # Normalize attention for frontend display
    if len(attn_weights) > 0:
        w_min, w_max = attn_weights.min(), attn_weights.max()
        if w_max - w_min > 0:
            attn_weights = (attn_weights - w_min) / (w_max - w_min)
    
    prediction_label = "DEMENTIA" if prob >= CONFIG['threshold'] else "HEALTHY CONTROL"
    
    attention_map = []
    for sent, score in zip(sentences, attn_weights):
        attention_map.append(SentenceAttention(sentence=sent, attention_score=float(score)))
        
    return {
        "filename": file.filename,
        "prediction": prediction_label,
        "confidence": prob,
        "is_dementia": prob >= CONFIG['threshold'],
        "attention_map": attention_map
    }

@app.get("/health")
def health_check():
    return {"status": "active", "device": str(CONFIG['device'])}