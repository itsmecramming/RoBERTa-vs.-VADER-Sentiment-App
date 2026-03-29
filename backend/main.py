from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import torch
import torch.nn.functional as F
import numpy as np
import os

app = FastAPI(title="Sentiment Analysis Comparison API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Model Path ──
MODEL_PATH = "roberta_model"

# ── Load RoBERTa ──
print("Loading RoBERTa model...")
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    roberta_model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    roberta_model.eval()
    print("RoBERTa loaded successfully.")
except Exception as e:
    print(f"Error loading RoBERTa: {e}")
    raise

# ── Load VADER ──
vader_analyzer = SentimentIntensityAnalyzer()

# ── Label Mapping ──
id2label = {0: "negative", 1: "neutral", 2: "positive"}

# ── Static Metrics (from your thesis results) ──
METRICS = {
    "roberta": {
        "accuracy":  0.8641,
        "precision": 0.8643,
        "recall":    0.8641,
        "f1":        0.8642,
    },
    "vader": {
        "accuracy":  0.5000,
        "precision": 0.5190,
        "recall":    0.5000,
        "f1":        0.4770,
    }
}

# ── Static Confusion Matrix (from your thesis results) ──
CONFUSION_MATRIX = {
    "roberta": [
        [57, 7,  4],
        [6,  56, 3],
        [5,  3,  65]
    ],
    "vader": [
        [32, 8,  28],
        [20, 16, 29],
        [15, 3,  55]
    ]
}

# ── Request Model ──
class TextInput(BaseModel):
    text: str

# ── Predict Endpoint ──
@app.post("/predict")
async def predict(input: TextInput):
    text = input.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty.")

    # RoBERTa Prediction
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    with torch.no_grad():
        outputs = roberta_model(**inputs)
        logits  = outputs.logits
        probs   = F.softmax(logits, dim=-1).squeeze().tolist()
        pred_class = int(torch.argmax(logits, dim=-1).item())

    roberta_result = {
        "label":      id2label[pred_class],
        "class":      pred_class,
        "confidence": round(max(probs) * 100, 2),
        "scores": {
            "negative": round(probs[0] * 100, 2),
            "neutral":  round(probs[1] * 100, 2),
            "positive": round(probs[2] * 100, 2),
        }
    }

    # VADER Prediction
    vader_scores = vader_analyzer.polarity_scores(text)
    compound     = vader_scores["compound"]
    if compound >= 0.05:
        vader_label = "positive"
    elif compound <= -0.05:
        vader_label = "negative"
    else:
        vader_label = "neutral"

    vader_result = {
        "label":    vader_label,
        "compound": round(compound, 4),
        "scores": {
            "neg": round(vader_scores["neg"], 4),
            "neu": round(vader_scores["neu"], 4),
            "pos": round(vader_scores["pos"], 4),
            "compound": round(compound, 4),
        }
    }

    return {
        "roberta": roberta_result,
        "vader":   vader_result,
        "match":   roberta_result["label"] == vader_result["label"]
    }

# ── Metrics Endpoint ──
@app.get("/metrics")
async def get_metrics():
    return METRICS

# ── Confusion Matrix Endpoint ──
@app.get("/confusion-matrix")
async def get_confusion_matrix():
    return CONFUSION_MATRIX

# ── Health Check ──
@app.get("/")
async def root():
    return {"status": "ok", "message": "Sentiment Analysis API is running."}