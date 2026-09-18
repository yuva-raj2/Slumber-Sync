# SlumberSync 🌙
> **AI-Driven Adaptive Acoustic Shield & Smart Isolation SaaS**

SlumberSync is an intelligent, dual-tier sleep isolation application engineered for complete acoustic protection against roommate noise, urban street sounds, and sudden disturbances.

---

## 🏛 Dual-Tier Architecture

### 1. 🎧 Tier A: Hardware ANC Devices (Web Bluetooth BLE)
- Interacts with supported ANC Bluetooth earbuds using the **Web Bluetooth API** (`navigator.bluetooth`).
- Discovers GATT vendor services and sends mode lock commands (`ANC_ON`, `TRANSPARENCY`, `OFF`) to maintain maximum hardware acoustic cancellation throughout the night.
- Includes a built-in hardware state simulator for instant evaluation on unsupported browsers or headsets.

### 2. 🛡️ Tier B: Standard Earbuds / Wired (Zero-Sound Dynamic Speech Shield)
- **Zero-Sound Standby by Default**: Absolute silence ($0\text{ dB}$ gain) during peaceful bedroom conditions—no tiring white noise loops or endless drone.
- **Dynamic Speech-Shielding Bandpass Filter ($250\text{ Hz} - 1.8\text{ kHz}$)**: Activates within **$50\text{ms}$** using `exponentialRampToValueAtTime` *only* when room noise exceeds your calibrated threshold (default: $48\text{ dB}$).
- **Instant Decay to Silence**: Once room noise subsides, the masking sound smoothly fades back to pure silence within **$400\text{ms}$**.
- **Emergency Siren / Morning Alarm Bypass Guard**: Listens for continuous $2.5\text{ kHz} - 4.0\text{ kHz}$ siren frequencies (smoke alarms, fire detectors, phone morning alarms) and instantly mutes masking.

---

## 🏗 Full-Stack Tech Stack

- **Frontend**: React (Vite, TypeScript, Tailwind CSS, Lucide-react)
- **Audio & Bluetooth Sensors**: Native Web Audio API (`AnalyserNode`, `BiquadFilterNode`, `GainNode`), `MediaDevices` API, Web Bluetooth API (GATT services).
- **3D & Analytics**: Three.js (`@react-three/fiber`, `@react-three/drei`) reactive celestial acoustic sphere & Chart.js (`react-chartjs-2`).
- **Backend**: Java Spring Boot 3.3.x (Spring Web, Spring Data JPA, Lombok, PostgreSQL driver).
- **Database**: PostgreSQL (persisting sleep sessions, disturbance telemetry spikes, and user shield presets).

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Java**: JDK 17+
- **PostgreSQL**: Running locally on `localhost:5432/slumbersync` (configured in `application.properties`)

---

### 1. Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

### 2. Running the Backend
```bash
cd backend
# On Windows PowerShell:
.\mvnw.cmd spring-boot:run
# On Linux/macOS:
./mvnw spring-boot:run
```
The REST API server will boot on **[http://localhost:8080](http://localhost:8080)**.

#### Core API v1 Endpoints:
- `POST /api/v1/sessions` - Persist wake-up sleep session telemetry (disturbances shielded, hardware mode used).
- `GET /api/v1/sessions/history` - Retrieve session telemetry formatted for Chart.js.
- `GET /api/v1/presets` - Retrieve user acoustic shield presets.
- `POST /api/v1/presets` - Save a new custom shield preset.

---

## 🧪 Testing the Dual-Tier Shield

1. **Tier A Testing**: Click **"Pair BLE Earbuds"** to initiate a Web Bluetooth scan, or click **"Simulate Tier A"** to lock into hardware ANC isolation mode.
2. **Tier B Testing**: Notice the dashboard is in **Zero-Sound Standby (0 dB)**. Speak into the microphone or make noise past the threshold ($48\text{ dB}$)—observe the speech-shielding bandpass activate within $50\text{ms}$ and fade back to silence within $400\text{ms}$ when quiet.
3. **Emergency Siren Bypass**: Click **"Test Emergency Siren Bypass"** to verify that masking is silenced immediately when an alarm sounds.
4. **Sleep Analytics**: Switch to the **Analytics** tab to view overnight decibel telemetry, noise spike timestamps, and persist current session data to PostgreSQL.

---

## 🌐 Free Public Deployment Guide

### Option 1: GitHub Pages (100% Free, Automated CI/CD)
The repository includes a preconfigured GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Push this repository to GitHub: `git push -u origin main`
2. In your GitHub repository, navigate to **Settings** ➔ **Pages**.
3. Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish your app to:
   `https://<your-github-username>.github.io/Slumber-Sync/`

### Option 2: Vercel (100% Free, 1-Click)
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New Project** and select `Slumber-Sync`.
3. In Root Directory, select `frontend` (or leave root and set Root Directory to `frontend`).
4. Click **Deploy**. Your app will be live on `https://slumber-sync.vercel.app` with instant global SSL/HTTPS!

### Option 3: Backend & Database on Render (100% Free)
1. Fork or push this repository to GitHub.
2. Go to [render.com](https://render.com) and sign in.
3. Click **New +** ➔ **Blueprint** and select this repository. Render will automatically read `render.yaml` and spin up:
   - A free managed **PostgreSQL database**.
   - A free **Spring Boot Docker Web Service**.
4. In your Vercel/GitHub Pages deployment settings, set the environment variable:
   `VITE_API_URL=https://your-render-backend-url.onrender.com`

