# EcoLens

## Production Setup

This project can run in production as a single service:

- the React app is built into `dist/`
- Flask serves the API at `/api`
- Waitress serves the built frontend and API from one process

## Install

Frontend:

```powershell
npm install
```

Backend:

```powershell
.\venv\Scripts\pip.exe install -r backend\requirements.txt
```

## Build The Frontend

```powershell
npm run build
```

## Run In Production On Windows

This serves both the built frontend and the API from the same server:

```powershell
$env:SERVE_FRONTEND = "1"
$env:HOST = "0.0.0.0"
$env:PORT = "5000"
.\venv\Scripts\python.exe backend\serve.py
```

Open:

- `http://127.0.0.1:5000`
- API health check: `http://127.0.0.1:5000/api/health`

## Run In Production On Linux

If you deploy on Linux, use Gunicorn:

```bash
npm install
npm run build
python3 -m venv venv
./venv/bin/pip install -r backend/requirements.txt
gunicorn --chdir backend --bind 0.0.0.0:5000 --workers 4 wsgi:app
```

## Separate Frontend And Backend Hosts

If the frontend and backend are deployed on different domains, set the API base at build time:

```powershell
$env:VITE_API_BASE = "https://api.example.com/api"
npm run build
```

Then allow the frontend origin in the backend:

```powershell
$env:CORS_ORIGINS = "https://app.example.com"
.\venv\Scripts\python.exe backend\serve.py
```

For multiple origins:

```powershell
$env:CORS_ORIGINS = "https://app.example.com,https://admin.example.com"
```

For this deployed frontend, use:

```text
CORS_ORIGINS=https://ecolensown.netlify.app
```

Do not include app routes in `CORS_ORIGINS` (for example, do not use `/dashboard/predictions`).

In Netlify, set:

```text
VITE_API_BASE=https://your-backend-domain/api
```

Example:

```text
VITE_API_BASE=https://ecolens-api.onrender.com/api
```

After setting those values, redeploy the Netlify site. The backend health endpoint should respond at:

```text
https://your-backend-domain/api/health
```

## Environment Variables

- `HOST`: bind host, default `0.0.0.0`
- `PORT`: server port, default `5000`
- `SERVE_FRONTEND`: `1` to serve `dist/` from Flask, default `1`
- `FRONTEND_DIST`: override frontend build directory, default `<repo>/dist`
- `CORS_ORIGINS`: comma-separated allowed origins, default local dev origins
- `WAITRESS_THREADS`: Waitress worker thread count, default `8`
- `DEBUG`: keep this unset or `0` in production
- `VITE_API_BASE`: frontend API base URL for separate-host deployments

## Model Files

The backend now starts even if a model artifact is missing or a Git LFS pointer was checked out instead of the real file. If you want the original random-forest model instead of the LightGBM fallback, pull the real LFS object:

```powershell
git lfs pull
```
