# Prediction Market (Next.js)

An on-chain prediction market interface built with Next.js and Chainlink Price Feeds, along with AI Chatbot based in LangChain. The application displays a live ETH/USD chart using real data from the Chainlink Aggregator contract and provides a modular UI for prediction market interactions.

## Features

- Live ETH/USD price pulled directly from Chainlink (`latestRoundData`)
- Rolling 20-minute chart, updated every 2 minutes
- Prefilled initial chart history for clean initial rendering
- Modular components for prediction flows
- Typed blockchain reads using TypeScript and viem
- **AI Chatbot** - Crypto prediction assistant powered by LangChain + Groq (Llama 3.3 70B)

## Tech Stack

**Frontend:** Next.js (App Router), TypeScript, viem, Recharts

**Backend:** FastAPI, LangChain, Groq AI

## Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_RPC_URL=https://mainnet.infura.io/v3/<YOUR_KEY>
NEXT_PUBLIC_CHAIN_ID=1
NEXT_PUBLIC_CHAINLINK_ETHUSD_ADDRESS=0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

## Project Structure

```
prediction-market/
├── app/
│   ├── api/chat/
│   │   └── route.ts              # API proxy to FastAPI backend
│   ├── layout.tsx
│   ├── page.tsx                   # Main page with chatbot
│   └── globals.css
│
├── src/
│   ├── abi/
│   │   ├── AggregatorV3Interface.json
│   │   └── SimplePredictionMarket.json
│   └── components/
│       ├── ChatBot.tsx            # AI chatbot component
│       ├── LivePriceChart.tsx
│       ├── MarketCard.tsx
│       ├── BetPanel.tsx
│       ├── ResultPanel.tsx
│       └── WalletButton.tsx
│
└── backend/                       # Python backend
    ├── main.py                    # FastAPI server
    ├── prediction_agent.py        # LangChain AI agent
    ├── requirements.txt
    ├── .env                       # API keys
    └── README.md                  # Backend setup guide
```

## Chainlink Price Feed (Core Logic)

```typescript
const result = await client.readContract({
  address: process.env.NEXT_PUBLIC_CHAINLINK_ETHUSD_ADDRESS as `0x${string}`,
  abi: AggregatorV3Interface,
  functionName: 'latestRoundData',
});

const price = Number(result[1]) / 1e8;
```

## AI Chatbot Setup

The chatbot backend requires Python 3.12 or 3.13 (not 3.14).

### Quick Start

```bash
# Navigate to backend
cd backend

# Install Python 3.12 (if needed)
brew install python@3.12

# Create virtual environment
python3.12 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

Then in a new terminal, start Next.js:

```bash
npm run dev
```

The chatbot will appear on the right side at http://localhost:3000

For detailed setup instructions, see [backend/README.md](backend/README.md)

## Deployment

```bash
npm run build
npm run start
```

## License

MIT
