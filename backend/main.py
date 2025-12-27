# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from prediction_agent import get_prediction
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI()

# CORS 설정 (Next.js에서 접근 가능하도록)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js 포트
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Dict[str, str]]] = None


class ChatResponse(BaseModel):
    response: str
    timestamp: str


@app.get("/")
def root():
    return {
        "message": "Crypto Prediction AI API",
        "status": "online",
        "endpoints": {
            "/chat": "POST - Chat with AI prediction agent",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
def health():
    return {"status": "healthy"}


@app.post("/chat")
def chat(req: ChatRequest):
    """
    AI 예측 채팅 엔드포인트
    Next.js에서 호출할 수 있음
    """
    from datetime import datetime

    response_text = get_prediction(req.message, req.history)

    return {
        "response": response_text,
        "timestamp": datetime.now().isoformat()
    }
