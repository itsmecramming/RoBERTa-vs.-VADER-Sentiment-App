# Comparative Performance Dashboard: RoBERTa vs. VADER

A full-stack web application designed to compare the performance of a transformer-based model (RoBERTa) against a rule-based lexicon (VADER) for sentiment analysis tasks. 

This dashboard provides a robust side-by-side comparison of inference results, confidence scores, and historical metrics.

## 🚀 Features

- **Real-Time Inference:** Instantly analyze sentiment using both RoBERTa and VADER simultaneously.
- **Detailed Metrics:** Breakdowns of positive, neutral, and negative probability distributions.
- **Visual Analytics:** Confusion matrices and classification reports for thesis-grade evaluation.
- **Clean UI:** Responsive, minimalist design utilizing custom styling for clear data presentation.

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI + Python
- **Machine Learning:** PyTorch, Hugging Face Transformers (`cardiffnlp/twitter-roberta-base-sentiment`), VADER Sentiment

## 🖥️ Local Development

### 1. Backend Setup

Note: You will need the required machine learning dependencies.

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# Mac/Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```
The backend will run at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`.

## 📦 Deployment considerations
- The `roberta_model` directory must be excluded from `.gitignore` for standard serverless setups due to file size limits. It is recommended to pull the model dynamically directly from Hugging Face on your host (like Render or Railway) by changing `MODEL_PATH` in `backend/main.py`.
- The frontend can be easily deployed to Vercel. Ensure you set the Root Directory to `frontend/`!
