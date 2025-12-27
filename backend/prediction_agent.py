"""
Prediction Agent for Crypto Market Analysis
Uses Groq's Llama 3.3 70B to provide market predictions and analysis
"""

from typing import List, Dict
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
import os


class PredictionAgent:
    """AI Agent specialized in cryptocurrency market predictions"""

    def __init__(self):
        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0.7,
            api_key=os.getenv("GROQ_API_KEY")
        )

        # 에이전트의 페르소나 정의
        self.system_prompt = SystemMessage(
            content="""You are a professional cryptocurrency market analyst and prediction expert.

Your role:
- Analyze cryptocurrency markets (Bitcoin, Ethereum, etc.)
- Provide data-driven predictions based on technical analysis
- Explain market trends in simple terms
- Give balanced perspectives (both bullish and bearish scenarios)
- Always mention that predictions are not financial advice

Your style:
- Simple and easy to understand with bullet poits
- Don't use emojis (📈 📉 💡)
- Provide specific timeframes when making predictions
- Always acknowledge market uncertainty

Remember: Never guarantee profits. Markets are unpredictable."""
        )

    def chat(self, user_message: str, chat_history: List[Dict[str, str]] = None) -> str:
        """
        Process a chat message and return AI response

        Args:
            user_message: The user's question/message
            chat_history: Previous conversation history

        Returns:
            AI agent's response as a string
        """
        # 메시지 구성
        messages = [self.system_prompt]

        # 이전 대화 내역 추가 (컨텍스트 유지)
        if chat_history:
            for msg in chat_history:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))

        # 현재 사용자 메시지 추가
        messages.append(HumanMessage(content=user_message))

        # LLM 호출
        response = self.llm.invoke(messages)

        return response.content


def get_prediction(question: str, history: List[Dict[str, str]] = None) -> str:
    """
    Simple function interface for predictions

    Args:
        question: User's question about crypto predictions
        history: Optional chat history for context

    Returns:
        AI prediction response
    """
    agent = PredictionAgent()
    return agent.chat(question, history)


# CLI 테스트용
if __name__ == "__main__":
    agent = PredictionAgent()

    print("🤖 Crypto Prediction Agent")
    print("=" * 50)

    # 테스트 질문들
    test_questions = [
        "Bitcoin이 다음 주에 어떻게 될 것 같아?",
        "Ethereum이 $5000 넘을 수 있을까?",
        "지금 투자하기 좋은 시기야?"
    ]

    history = []

    for i, question in enumerate(test_questions, 1):
        print(f"\n💬 질문 {i}: {question}")
        response = agent.chat(question, history)
        print(f"🤖 답변: {response}\n")

        # 대화 내역에 추가
        history.append({"role": "user", "content": question})
        history.append({"role": "assistant", "content": response})
