# CampusOne (CMRS) Production Deployment Guide

## 1. Single All-in-One Service on Render (Recommended - 100% Free)

With unified static serving in `server.js` and root workspaces in `package.json`, the entire application (React Frontend + Express API + PostgreSQL Cache) deploys as **one unified web service** with **0 CORS issues** and **0 configuration**.

### Instant Setup (Step-by-Step):
1. Open your Render project:
   **[https://dashboard.render.com/project/prj-db5d9rjrjlhs73d930e0](https://dashboard.render.com/project/prj-db5d9rjrjlhs73d930e0)**
2. Click **New +** (top right) ➡️ Select **Web Service**.
3. Choose **Build and deploy from a Git repository** ➡️ Connect **`CampusOne`** (`https://github.com/YaswanthKomminni/CampusOne`).
4. Fill in the following simple fields:
   - **Name**: `campusone` (or any name you like)
   - **Region**: Any (e.g. *Singapore*, *Frankfurt*, or *Oregon*)
   - **Branch**: `main`
   - **Root Directory**: *(Leave blank)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Create Web Service**!
6. Render will run the build, start the server, verify health at `/api/health`, and give you a live URL:
   `https://campusone.onrender.com`

---

## 2. Using Render Blueprints (1-Click Automated Setup)
Because the repository includes `render.yaml`:
1. In your Render Dashboard, click **New +** ➡️ **Blueprint**.
2. Select your `CampusOne` repository.
3. Render automatically reads `render.yaml` and provisions the web service with all build and start parameters pre-configured.
4. Click **Apply**.

---

## 3. Alternative: Two-Service Deployment (Separate Frontend & Backend)
If you prefer hosting the React static frontend and Node.js backend independently:

### A. Backend Web Service:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Env Vars**:
  - `PORT`: `5000` (or leave default for Render auto-port)

### B. Frontend Static Site:
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Env Vars**:
  - `VITE_API_URL`: `https://<your-backend-service-url>.onrender.com/api`
