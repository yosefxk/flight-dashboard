import pytest
from unittest.mock import patch, MagicMock
import sys
import os

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fetcher import fetch_all_flights
import main

def test_fetcher_error_raises_runtime_error():
    with patch("requests.get") as mock_get:
        mock_get.side_effect = Exception("Remote connection timeout")
        with pytest.raises(RuntimeError, match="Failed to fetch flight records"):
            fetch_all_flights()

def test_refresh_flights_preserves_cache_on_error():
    main.flight_cache = {
        "flights": [{"flight_number": "LY001", "airline_name": "EL AL"}],
        "total": 1,
        "fetched_at": "2026-10-31T12:00:00Z"
    }

    with patch("main.fetch_all_flights") as mock_fetch:
        mock_fetch.side_effect = RuntimeError("Network error")
        main.refresh_flights()

        # Cache must NOT be wiped
        assert len(main.flight_cache["flights"]) == 1
        assert main.flight_cache["flights"][0]["flight_number"] == "LY001"
        assert main.flight_cache["total"] == 1

@pytest.mark.asyncio
async def test_manual_refresh_rate_limiting():
    main.flight_cache = {
        "flights": [{"flight_number": "LY001"}],
        "total": 1,
        "fetched_at": "2026-10-31T12:00:00Z"
    }
    main._last_refresh_time = 0.0

    with patch("main.refresh_flights") as mock_refresh:
        # First call succeeds
        res1 = await main.manual_refresh()
        assert res1["message"] == "Refreshed successfully"
        assert mock_refresh.call_count == 1

        # Second call immediately after should be rate limited
        res2 = await main.manual_refresh()
        assert "Rate limited" in res2["message"]
        assert mock_refresh.call_count == 1
