Markdown
# 🦥 Bed-Rot Coder 

> **Speak your code. Stay in bed.**  
> A Next.js full-stack voice-to-code AI agent for **Hacktoberfest**.

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Mastra](https://img.shields.io/badge/Mastra-Agent_Framework-blue?style=flat)](https://mastra.ai/)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange?style=flat&logo=google)](https://ai.google.dev/)

## 🛌 The Concept: "Slow and Steady" Theme
Why should you even work on a desk? **Bed-Rot Coder** was developed for developers that want to enjoy "bed-rotting" while still maintaining productivity. All you have to do is to hit record, speak out your logic (for example, *"Write a python script that calculates Fibonacci sequence"*), and an AI will transcribe your voice, process your logic and produce your code within a sleek dark-mode console webpage.

## ✨ Features
- **🎤 Voice-First User Interface:** No typing needed. Click, speak, and stop.
- **⚡ Webpage-First Approach:** No need to store anything locally. Code is displayed right away on the UI.
- **🧠 Agentic AI Logic Processing:** The Mastra Agent framework with Google Gemini (Flash) AI.
- **🗣️ Accurate STT Integration:** Integrates with ElevenLabs `scribe_v1` for perfect transcription of speech.
- **💻 Pro Developer UI:** Clean and engineered Tailwind CSS design (No cheap vibe coding, only developer aesthetics).

## Install Dependencies
Bash
npm install

## Setup Environment Variables
Create a .env file in the root directory and add your keys:

Code snippet
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

## Run the Application
Bash
npm run dev
