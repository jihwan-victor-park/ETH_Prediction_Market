# Chatbot Backend (FastAPI + LangChain)

Python backend for the AI crypto prediction chatbot using Groq's Llama 3.3 70B.

## Quick Start

```bash
# From the project root, navigate to backend
cd backend

# Install Python 3.12 (if you have 3.14)
brew install python@3.12

# Create virtual environment
python3.12 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

## Files

- `main.py` - FastAPI server with /chat endpoint
- `prediction_agent.py` - LangChain agent with Groq AI
- `requirements.txt` - Python dependencies
- `.env` - API keys (already configured)

## API

### POST /chat
```json
{
  "message": "What's your Bitcoin prediction?",
  "history": []
}
```

Response:
```json
{
  "response": "AI response here...",
  "timestamp": "2025-11-30T12:34:56"
}
```

## Environment Variables

`.env` file:
```bash
GROQ_API_KEY=your_key_here
```

Get your API key: https://console.groq.com/keys
