# 🌿 Lumid.ai — Your AI-Powered Emotional Companion 💚

**Lumid.ai** is your personal emotional support assistant 🤖, designed to help you feel heard, supported, and empowered. Whether you're feeling stressed, anxious, or just need a moment to breathe — Lumid is here for you.

Built using **Next.js** for the frontend and powered by **FastAPI** + **ChatGPT** on the backend, Lumid delivers a calming, conversational experience that fits right into your daily routine.

---

## 🌐 Live Preview

> 🎯 Try it out: [**Lumid Frontend (Next.js)**](https://github.com/vaishnav4281/Lumid.ai)  
> ⚙️ Backend powered by **FastAPI** & **OpenAI**, deployed via [**Render**](https://render.com)

---

## ✨ Features That Support Your Mind

🧘‍♀️ **Breathing Exercise**  
Simple guided breathing to help you relax and refocus.

📝 **Journal Thoughts**  
Express your emotions in a safe space — no judgment, just clarity.

💬 **Positive Affirmations**  
Gentle words to uplift your confidence and self-worth.

🧠 **Reframe Thoughts**  
Shift negative thoughts to healthier, more constructive ones.

💡 **Real Conversations**  
Emotionally intelligent replies via GPT — always kind, always present.

🌈 **Beautiful UI**  
Clean, minimal, and soothing interface designed with **Tailwind CSS**.

📱 **Fully Responsive**  
Optimized for mobile, tablet, and desktop.

---

## 🖼 Interface Preview

### 💻 Desktop View
![Desktop]()

### 📱 Mobile View
![Mobile](./screenshots/mobile.png)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js `v18+`
- API backend (FastAPI with ChatGPT key)
- Yarn or npm

### 🛠 Installation


git clone https://github.com/vaishnav4281/Lumid.ai.git
cd Lumid.ai
npm install   # or yarn
🔐 Environment Setup
Create a .env.local file:

env
Copy
Edit
NEXT_PUBLIC_API_URL=https://your-fastapi-url.onrender.com
🧪 Start Development
bash
Copy
Edit
npm run dev   # or yarn dev
Visit: http://localhost:3000

🧩 Project Structure
csharp
Copy
Edit
Lumid.ai/
├── components/         # Reusable UI components
├── pages/              # Next.js routing
├── public/             # Static assets
├── styles/             # Global & component-level styles
├── utils/              # Utility functions
├── .env.local          # API URL
└── tailwind.config.ts  # TailwindCSS configuration
🤝 Contribute to Lumid
We welcome contributions! Whether it's bug fixes, new features, or just improving the UI — every bit helps. 💪

Fork the repo

Create a new branch

Make your changes

Open a PR

🛡️ License
MIT License
© 2025 Vaishnav K

💬 Made With Empathy
"You’re already good, my dear friend. Wanting to improve is proof of your strength." 💚
— Lumid AI

🧠 Backend Info
The backend is a FastAPI server connected to the OpenAI API. It handles:

Chat interaction

Sentiment/emotion parsing

Token-secured endpoints for privacy

You can host it easily on Render, or your own server. If you’d like to contribute to the backend too, feel free to open an issue.

📎 Extras
🛠 Built with:

Next.js

Tailwind CSS

OpenAI API

FastAPI

Render
