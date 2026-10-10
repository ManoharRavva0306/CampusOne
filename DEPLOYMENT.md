# CampusOne (CMRS) Production Deployment Guide

## 1. Fast Free Deployment (Render / Vercel)

### Option A: Deploy Both on Render (Recommended - Free)
1. Fork or push to your GitHub repo: `https://github.com/YaswanthKomminni/CampusOne.git`
2. Go to **[render.com](https://render.com)** and sign in with GitHub.
3. **Backend Web Service**:
   - Click **New** -> **Web Service** -> Select `CampusOne`.
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: `5000`
     - `DATABASE_URL`: (Optional PostgreSQL connection string from Neon / Supabase / Render Postgres)
4. **Frontend Static Site**:
   - Click **New** -> **Static Site** -> Select `CampusOne`.
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Environment Variables:
     - `VITE_API_URL`: `https://<your-backend-service-url>.onrender.com/api`

---

### Option B: Deploy Frontend on Vercel & Backend on Render
1. **Frontend on Vercel**:
   - Go to **[vercel.com](https://vercel.com)** -> Import `CampusOne`.
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variable:
     - `VITE_API_URL`: Your deployed backend API URL.

---

### Option C: Run with Docker / Docker Compose
Run the full production stack anywhere:
```bash
docker compose up --build
```
