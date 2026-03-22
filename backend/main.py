"""
FastAPI backend for the Ben Gurion Airport Flight Dashboard.
Fetches data from the Israeli Airport Authority and serves it to the frontend.
"""

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
from typing import Optional
import uvicorn

from fetcher import fetch_all_flights, parse_flight

app = FastAPI(title="Flight Dashboard API")

# CORS — allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory flight cache
flight_cache = {
    "flights": [],
    "total": 0,
    "fetched_at": None,
}


def refresh_flights():
    """Fetch fresh data from the government API and update the cache."""
    global flight_cache
    print("[scheduler] Refreshing flight data...")
    raw = fetch_all_flights()
    parsed = [parse_flight(r) for r in raw["flights"]]
    flight_cache = {
        "flights": parsed,
        "total": len(parsed),
        "fetched_at": raw["fetched_at"],
    }
    print(f"[scheduler] Cached {len(parsed)} flights at {raw['fetched_at']}")


# Background scheduler: refresh every 5 minutes
scheduler = BackgroundScheduler()
scheduler.add_job(refresh_flights, "interval", minutes=5, id="flight_refresh")


@app.on_event("startup")
async def startup_event():
    """Fetch initial data and start the background scheduler."""
    refresh_flights()
    scheduler.start()


@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()


@app.get("/api/flights")
async def get_flights(
    direction: Optional[str] = Query(None, description="arrival or departure"),
    airline: Optional[str] = Query(None, description="Airline IATA code or name substring"),
    country: Optional[str] = Query(None, description="Country name substring (EN or HE)"),
    city: Optional[str] = Query(None, description="City name substring"),
    flight: Optional[str] = Query(None, description="Flight number substring"),
):
    """
    Returns the cached flight data with optional filters.
    """
    flights = flight_cache["flights"]

    if direction:
        flights = [f for f in flights if f["direction"] == direction.lower()]

    if airline:
        q = airline.upper()
        flights = [
            f for f in flights
            if q in f["airline_code"].upper() or q in f["airline_name"].upper()
        ]

    if country:
        q = country.lower()
        flights = [
            f for f in flights
            if q in f["country_en"].lower() or q in f["country_he"]
        ]

    if city:
        q = city.lower()
        flights = [
            f for f in flights
            if q in f["city_en"].lower() or q in f["city_he"] or q in f["city_short"].lower()
        ]

    if flight:
        q = flight.upper()
        flights = [f for f in flights if q in f["flight_number"].upper()]

    # Sort by scheduled time
    flights.sort(key=lambda f: f.get("scheduled", ""))

    return {
        "flights": flights,
        "total": len(flights),
        "fetched_at": flight_cache["fetched_at"],
    }


@app.post("/api/flights/refresh")
async def manual_refresh():
    """Manually trigger a data refresh."""
    refresh_flights()
    return {
        "message": "Refreshed successfully",
        "total": flight_cache["total"],
        "fetched_at": flight_cache["fetched_at"],
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
