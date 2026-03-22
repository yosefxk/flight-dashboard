"""
Fetches flight data from the Israeli Airport Authority via data.gov.il.
Handles pagination to retrieve all records.
"""

import requests
from datetime import datetime, timezone

API_BASE = "https://data.gov.il/api/3/action/datastore_search"
RESOURCE_ID = "e83f763b-b7d7-479e-b172-ae981ddc6de5"
PAGE_SIZE = 100


def fetch_all_flights() -> dict:
    """
    Fetches all flight records from the data.gov.il API.
    Returns a dict with 'flights' (list) and 'fetched_at' (ISO timestamp).
    """
    all_records = []
    offset = 0

    while True:
        params = {
            "resource_id": RESOURCE_ID,
            "limit": PAGE_SIZE,
            "offset": offset,
        }
        try:
            resp = requests.get(API_BASE, params=params, timeout=15)
            resp.raise_for_status()
            data = resp.json()
        except Exception as e:
            print(f"[fetcher] Error fetching flights at offset {offset}: {e}")
            break

        result = data.get("result", {})
        records = result.get("records", [])
        total = result.get("total", 0)

        all_records.extend(records)

        if len(all_records) >= total or len(records) == 0:
            break

        offset += PAGE_SIZE

    return {
        "flights": all_records,
        "total": len(all_records),
        "fetched_at": datetime.now(timezone.utc).isoformat(),
    }


def parse_flight(record: dict) -> dict:
    """
    Transforms a raw API record into a clean flight object
    with human-readable keys.
    """
    scheduled = record.get("CHSTOL", "")
    actual = record.get("CHPTOL", "")

    # Determine if flight is delayed
    is_delayed = False
    delay_minutes = 0
    if scheduled and actual:
        try:
            sched_dt = datetime.fromisoformat(scheduled)
            actual_dt = datetime.fromisoformat(actual)
            diff = (actual_dt - sched_dt).total_seconds() / 60
            if diff > 15:
                is_delayed = True
                delay_minutes = int(diff)
        except (ValueError, TypeError):
            pass

    return {
        "airline_code": record.get("CHOPER", ""),
        "flight_number": f"{record.get('CHOPER', '')}{record.get('CHFLTN', '')}",
        "airline_name": record.get("CHOPERD", ""),
        "scheduled": scheduled,
        "actual": actual,
        "direction": "arrival" if record.get("CHAORD") == "A" else "departure",
        "city_code": record.get("CHLOC1", ""),
        "city_en": record.get("CHLOC1D", ""),
        "city_he": record.get("CHLOC1TH", ""),
        "city_short": record.get("CHLOC1T", ""),
        "country_he": record.get("CHLOC1CH", ""),
        "country_en": record.get("CHLOCCT", ""),
        "terminal": record.get("CHTERM"),
        "checkin_counters": record.get("CHCINT"),
        "checkin_zone": record.get("CHCKZN"),
        "status_en": record.get("CHRMINE", ""),
        "status_he": record.get("CHRMINH", ""),
        "is_delayed": is_delayed,
        "delay_minutes": delay_minutes,
    }
