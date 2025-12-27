"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hello! I'm your crypto prediction assistant. Ask me about market trends, price predictions, or trading insights!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, I'm having trouble connecting. Please make sure the backend is running.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--accent-green)] hover:opacity-90 transition-all duration-300 flex items-center justify-center group shadow-lg hover:shadow-xl hover:scale-105"
          style={{
            borderRadius: "50%",
          }}
        >
          <svg
            className="w-6 h-6 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Pulsing indicator */}
          <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--accent-green)] rounded-full animate-ping"></div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[var(--accent-green)] rounded-full border-2 border-black"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] bg-[var(--bg-primary)] border border-[var(--border-primary)] shadow-2xl flex flex-col"
          style={{
            animation: "slideUp 0.3s ease-out",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-primary)] bg-[var(--bg-card)]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-[var(--accent-green)] rounded-full animate-pulse" />
              <div>
                <h3 className="text-sm font-light tracking-tight uppercase text-[var(--text-primary)]">
                  AI Assistant
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wide">
                  Crypto Predictions
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg-primary)]">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 animate-fade-in ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="text-[9px] text-[var(--text-secondary)] uppercase tracking-wide">
                  {msg.role === "user" ? "YOU" : "AI"}
                </div>
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm font-light leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--accent-green)] text-black"
                      : "bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-primary)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)] animate-fade-in">
                <div className="spinner w-3 h-3 border border-[var(--accent-green)]" />
                <span className="text-xs font-light">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border-primary)] p-3 bg-[var(--bg-card)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about crypto..."
                disabled={isLoading}
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-primary)] px-3 py-2 text-sm font-light text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent-green)] transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-[var(--accent-green)] text-black text-xs font-light uppercase tracking-wide hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
