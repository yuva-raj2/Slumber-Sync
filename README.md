# SlumberSync 🌙

> An adaptive acoustic shield built to help people sleep peacefully when roommates or neighbors are loud.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-yuva--raj2.github.io%2FSlumber--Sync-blue?style=for-the-badge&logo=github)](https://yuva-raj2.github.io/Slumber-Sync/)
[![GitHub repo](https://img.shields.io/badge/GitHub-yuva--raj2%2FSlumber--Sync-black?style=for-the-badge&logo=github)](https://github.com/yuva-raj2/Slumber-Sync)

🔗 **Live Website**: [https://yuva-raj2.github.io/Slumber-Sync/](https://yuva-raj2.github.io/Slumber-Sync/)

---

## 💡 Why I Built This

If you have ever lived in a college hostel, shared an apartment, or lived with noisy roommates, you know the frustration: you have an early morning, you're exhausted and trying to sleep, but people in the other room are talking, laughing, or playing music.

Most sleep apps try to fix this by playing continuous, loud white noise or ocean waves directly into your ears all night long. That usually ends up causing ear fatigue and headaches.

I built **SlumberSync** to take a smarter, noise-reactive approach:
1. **Zero-Sound Standby**: When the room is quiet, your headphones stay in **pure silence**. No sound plays at all.
2. **Instant Reaction**: The exact millisecond your roommates start talking, shouting, or moving around and the sound crosses your threshold (e.g., 48 dB), an audio filter activates to mask human speech frequencies.
3. **Smooth Return to Silence**: As soon as they stop talking, the sound fades back to complete silence in 400 milliseconds.
4. **Hardware ANC Mode**: If you have Active Noise Cancelling (ANC) Bluetooth earbuds, the app connects via Web Bluetooth and locks them into maximum hardware isolation mode.

---

## ✨ Features

- **Dynamic Speech Masking**: Specifically targets the human vocal range (250 Hz – 1800 Hz) with an adaptive bandpass filter so speech becomes unintelligible without blasting high-volume noise into your ears.
- **Web Bluetooth Hardware ANC Control**: Connects to supported wireless earbuds via the browser's Web Bluetooth API (`navigator.bluetooth`) to enforce hardware noise cancellation throughout the night. (Includes a built-in virtual simulator if your headphones don't have BLE control).
- **Emergency Alarm Guard**: Detects high-pitched emergency sirens or morning alarms (2.5 kHz – 4 kHz) and immediately cuts all masking sound so you never sleep through an important alarm.
- **100% Private & Serverless Ready**: Audio signal processing happens entirely inside your browser using the native Web Audio API. Your microphone audio is analyzed in local memory and is **never recorded, stored, or sent to any server**.
- **Overnight Sleep Analytics**: Tracks room noise spikes, calculates an overnight sleep score, and logs disturbance timestamps using your browser's local storage.
- **Built-in User Manual (PDF)**: Includes an interactive, step-by-step user manual with UI screenshots and usage tips that can be viewed or exported directly to PDF.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS (dark celestial theme)
- **Audio Processing**: Web Audio API (AudioContext, AnalyserNode, BiquadFilterNode, GainNode)
- **Bluetooth**: Web Bluetooth API (BLE GATT Services)
- **Visuals & Charts**: Three.js (@react-three/fiber, @react-three/drei) & Chart.js

### Backend (Optional Cloud Sync)
- **Language & Framework**: Java 17, Spring Boot 3.3.4 (Spring Data JPA, Lombok)
- **Database**: PostgreSQL
- **Container**: Multi-stage Dockerfile (Eclipse Temurin JRE 17)

---

## 🚀 Running Locally

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in Chrome or Edge (Web Bluetooth and Web Audio require Chromium-based browsers).

### 2. Backend Setup (Optional)
```bash
cd backend
# Windows:
.\mvnw.cmd spring-boot:run
# Linux / macOS:
./mvnw spring-boot:run
```
The backend API runs on http://localhost:8080.

> **Note**: The frontend has complete offline/standalone client support. Even if you do not run the backend, all audio masking, Bluetooth controls, analytics, and user manual features work 100% inside your browser.

---

## 📖 How to Use

1. **Open the App**: Visit [https://yuva-raj2.github.io/Slumber-Sync/](https://yuva-raj2.github.io/Slumber-Sync/).
2. **Allow Microphone**: Click **"Activate Acoustic Shield"** and grant microphone access when prompted (used strictly for live decibel detection in local memory).
3. **Set Your Threshold**: Default is set to 48 dB. Adjust the slider based on how quiet or noisy your room is.
4. **Select Mode**:
   - **Tier A (ANC Earbuds)**: Click **"Pair BLE Earbuds"** to lock hardware cancellation.
   - **Tier B (Regular Headphones)**: Put on standard earphones; the dynamic speech bandpass filter will handle everything automatically.
5. **Sleep Peacefully**: Keep your phone or laptop nearby. When roommate disturbances happen, the shield cloaks the noise and returns to silence once quiet.

---

## 📄 License
MIT License. Built by Yuvaraj.
