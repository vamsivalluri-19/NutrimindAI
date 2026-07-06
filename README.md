# 🥗 NutriMind AI
### Your Intelligent Personal AI Nutrition & Fitness Coach

NutriMind AI is a comprehensive health and wellness monorepo platform designed to connect users with AI-driven wellness tools and real human specialists (Nutritionists & Trainers). It features live webcam meal scanning, biometrics calculators, dual coaching portals, direct consultation chat channels, and detailed log monitoring.

---

## 🚀 Key Features

* **HTML5 Webcam Meal Scanner**: Scan meal snapshots directly inside the browser using your system webcam. The captured base64 frame is instantly analyzed by the vision engine to track meals.
* **Dual Coach & Trainer Connections**: Connect with **both** a personal Nutritionist (Doctor) for diet advice and a Fitness Trainer for athletic routines simultaneously.
* **Coaching Oversight Dossier**: Nutritionists and trainers can access a comprehensive dossier for each patient, inspecting their biometrics (age, weight, height, activity goals), allergies, and medical conditions.
* **7-Day Patient Logs Inspector**: Coaches can view patient journal logs (meals, workouts, water, and steps) directly inside the consultation screen to offer tailored prescriptions.
* **Prescription & Advice Feed**: Specialists can submit custom prescriptions which display as prominent guidance widgets on the patient's tracker dashboard.
* **Interactive Health Calculators**: High-contrast, theme-aware calculators for BMI, BMR, and TDEE with AI macro splits.
* **Responsive Light/Dark Mode**: High contrast typography and theme-aware cards that render beautifully in both light and dark backgrounds.

---

## 🛠️ Technology Stack

* **Frontend Client (Vite + React + TS)**: Single page client using Tailwind CSS, TanStack Query, and Lucide icons.
* **Admin Dashboard (Vite + React)**: Oversight console to manage prompts and moderate users.
* **Backend API (Node + Express + Mongoose)**: REST API utilizing MongoDB Atlas cloud database.

---

## 🔌 Running the Project

### Port Map
* **Backend API Server**: `http://localhost:5050`
* **Client Web App**: `http://localhost:3030`
* **Admin Dashboard**: `http://localhost:3031`

### Running Commands
From the project root directory:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Backend API Server**:
   ```bash
   npm run dev:backend
   ```

3. **Start Web Client App**:
   ```bash
   npm run dev:web
   ```

4. **Start Admin App**:
   ```bash
   npm run dev:admin
   ```

---

## 🔒 Environment Settings
Configure the following inside `backend/.env`:
* `MONGODB_URI`: Points directly to your MongoDB Atlas connection string (`mongodb+srv://...`).
* `PORT`: `5050`
