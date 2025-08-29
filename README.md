# 🎙️ NEXA AI Voice Agent

A real-time, conversational voice AI assistant built with **FastAPI**. It features streaming speech-to-text (**AssemblyAI**), intelligent, web-connected responses from **Google's Gemini AI** and **SerpApi**, and natural text-to-speech synthesis from **Murf AI**.

NEXA is a smart voice AI assistant that delivers concise, insightful, and engaging responses, designed to make research, interaction, and real-time conversations effortless.

---

## 🚀 Test It Live

You can test a live version of the application on Render:

**[➡️ Click here to test the Live Application](https://nexa-ai-dpr6.onrender.com)**

> **Note**: The live demo requires you to enter your own API keys for the AI services. Keys are stored securely in your browser's local storage and are never sent to the server or stored anywhere else.

---

## ✨ Features

- **🎤 Real-Time Transcription** – Streaming speech-to-text for instant and accurate user input capture.
- **🧠 Intelligent & Web-Connected AI** – Sophisticated, context-aware responses from Google Gemini, with the ability to perform live web searches for up-to-date information.
- **🗣️ Natural Voice Responses** – High-quality, low-latency text-to-speech synthesis that streams back to the user sentence-by-sentence.
- **🎨 Modern & Responsive UI** – A clean, intuitive chat interface with recording animations and a secure modal for API key management.
- **🔒 Secure Client-Side Configuration** – API keys are stored in the browser's `localStorage`, not in `.env` files, for enhanced security and ease of setup.
- **⚡ High-Performance Backend** – Built with FastAPI and WebSockets for efficient, real-time, bi-directional communication.

---

## 🏗️ Architecture

```plaintext
┌────────────────────────--─┐
│        Frontend           │
│  (HTML, JS, Bootstrap)    │
│ ─ Voice UI & Recording    │
│ ─ Client-Side Key Storage │
│ ─ Streaming Audio Playback│
└───────────▲──────────────-┘
            │
            ▼ (WebSocket)
┌───────────────────────--──┐
│         Backend           │
│        (FastAPI)          │
│ ─ Real-time Audio Stream  │
│ ─ AI Service Orchestration│
│ ─ WebSocket Management    │
└───────────▲──────────────-┘
            │
            ▼ (REST API)
┌─────────────────────-────┐
│      External AI APIs    │
│ ─ AssemblyAI  (STT)      │
│ ─ Gemini AI   (LLM)      │
│ ─ SerpApi    (Web Search)│
│ ─ Murf AI     (TTS)      │
└────────────────────────-─┘
```
---

## 🛠️ Tech Stack

**Backend**
- Python 3.8+
- FastAPI
- Uvicorn
- WebSockets

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5

**AI & Web Services**
- AssemblyAI (Speech-to-Text)
- Google Gemini AI (Language Model)
- Murf AI (Text-to-Speech)
- SerpApi (Real-time Web Search)

---

## 📋 Prerequisites for Local Setup

- Python 3.8 or higher
- A modern web browser with microphone access (e.g., Chrome, Firefox)
- API keys for:
  - **AssemblyAI**
  - **Google AI (Gemini)**
  - **Murf AI**
  - **SerpApi**

---

## 🚀 Local Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mdzaid7817/NEXA-AI.git
    cd NEXA-AI
    ```

2.  **Create and activate a virtual environment**
    ```bash
    # For macOS/Linux
    python3 -m venv venv
    source venv/bin/activate

    # For Windows
    python -m venv venv
    venv\Scripts\activate
    ```

3.  **Install dependencies from `requirements.txt`**
    ```bash
    pip install -r requirements.txt
    ```

---

## 🔑 API Key Configuration (for Local Use)

This project **does not use a `.env` file**. All API keys are configured directly in the browser.

1.  Run the application locally (see the next step).
2.  Open the web page at `http://localhost:8000`.
3.  Click the **gear icon (⚙️)** in the top-right corner.
4.  Enter your keys for Murf, AssemblyAI, Gemini, and SerpApi in the modal.
5.  Click **"Save Keys"**. Your keys are now stored securely in your browser's `localStorage`.

---

## 🏃 Running the App Locally

1.  Start the FastAPI server from the project's root directory:
    ```bash
    uvicorn main:app --reload
    ```

2.  Open your web browser and navigate to:
    [**http://localhost:8000**](http://localhost:8000)
