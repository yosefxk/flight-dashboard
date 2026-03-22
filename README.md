# ✈️ Flight Dashboard – Ben Gurion Airport

Real-time flight board for Ben Gurion Airport (TLV), built with **Next.js** and **FastAPI**.

Data sourced from the [Israeli Airport Authority](https://data.gov.il/dataset/flydata) and refreshed every 5 minutes.

## Features

- **Arrivals & Departures** tabs with live flight counts
- **Filter** by airline, origin/destination country, or flight number
- **Sort** by scheduled time, actual time, airline, city, flight number, or status
- **Bilingual** – Hebrew (RTL) and English (LTR) with a one-click toggle
- **Mobile-first** dark-mode UI with glassmorphism design
- **Auto-refresh** every 5 minutes with manual refresh option
- **Customizable title** via environment variable

## Quick Start (Docker Compose / Portainer)

### 1. Clone & deploy

```bash
git clone <your-repo-url> flights_dashboard
cd flights_dashboard
docker compose up -d --build
```

The dashboard will be available at **http://localhost:6943**

### 2. Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_TITLE` | *(auto – language-aware)* | Custom title for the header and browser tab |
| `NEXT_PUBLIC_BACKEND_URL` | `/api` | Backend API URL (set for external/proxied backends) |

**Example** – custom title:

```yaml
environment:
  - NEXT_PUBLIC_APP_TITLE=My Flight Tracker ✈️
```

### 3. Portainer

1. In Portainer, go to **Stacks → Add Stack**
2. Choose **Repository** or **Upload** and point to this project's `docker-compose.yml`
3. Optionally add environment variables in the **Environment variables** section
4. Click **Deploy the stack**

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Browser     │────▶│  Next.js      │────▶│  FastAPI Backend │
│  (port 6943) │     │  Frontend     │     │  (port 8001)     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                          ┌────────▼────────┐
                                          │  data.gov.il    │
                                          │  Airport API    │
                                          └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS, Framer Motion, Lucide icons |
| Backend | Python 3.12, FastAPI, APScheduler, Uvicorn |
| Data Source | Israeli Airport Authority API (data.gov.il) |
| Deployment | Docker, Docker Compose |

## Local Development

**Backend:**

```bash
cd backend
pip install -r requirements.txt
python main.py
# runs on http://localhost:8001
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev -- --port 3001
# runs on http://localhost:3001
```

Set `NEXT_PUBLIC_BACKEND_URL=http://localhost:8001` in `.env.local` or your environment.

## Project Structure

```
flights_dashboard/
├── backend/
│   ├── main.py            # FastAPI app + scheduler
│   ├── fetcher.py         # Flight data fetcher + parser
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # TabBar, FilterBar, FlightCard, LanguageToggle
│   │   └── lib/           # i18n context, utils
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## License

MIT
