"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Wifi, Clock, ArrowUpDown } from "lucide-react";
import TabBar from "@/components/TabBar";
import FilterBar from "@/components/FilterBar";
import FlightCard from "@/components/FlightCard";
import { useI18n } from "@/lib/i18n";
import { toProperCase } from "@/lib/utils";

interface Flight {
  airline_code: string;
  flight_number: string;
  airline_name: string;
  scheduled: string;
  actual: string;
  direction: string;
  city_code: string;
  city_en: string;
  city_he: string;
  city_short: string;
  country_he: string;
  country_en: string;
  terminal: number | null;
  checkin_counters: string | null;
  checkin_zone: string | null;
  status_en: string;
  status_he: string;
  is_delayed: boolean;
  delay_minutes: number;
}

interface FlightResponse {
  flights: Flight[];
  total: number;
  fetched_at: string | null;
}

export default function Home() {
  const [data, setData] = useState<FlightResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"arrival" | "departure">("arrival");

  // Filters
  const [selectedAirline, setSelectedAirline] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [flightSearch, setFlightSearch] = useState("");
  const [sortBy, setSortBy] = useState("scheduled");
  const [sortAsc, setSortAsc] = useState(true);

  const { t, lang } = useI18n();

  // Allow env var to override the title
  const pageTitle = process.env.NEXT_PUBLIC_APP_TITLE || t.title;

  // Refresh state
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8001";

  const fetchFlights = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/api/flights`);
      if (!res.ok) throw new Error("Failed to fetch");
      const json: FlightResponse = await res.json();
      setData(json);
      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      setError(t.errorLoading);
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [backendUrl]);

  // Initial load + auto-refresh every 5 minutes
  useEffect(() => {
    fetchFlights();
    const interval = setInterval(fetchFlights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchFlights]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetch(`${backendUrl}/api/flights/refresh`, { method: "POST" });
    } catch (e) {
      /* ignore, fetchFlights will handle errors */
    }
    await fetchFlights();
  };

  // Derive filtered + sorted flights
  const filteredFlights = useMemo(() => {
    if (!data) return [];
    let flights = data.flights.filter((f) => f.direction === activeTab);

    if (selectedAirline) {
      flights = flights.filter((f) => toProperCase(f.airline_name) === selectedAirline);
    }
    if (selectedCountry) {
      flights = flights.filter((f) => {
        const name = lang === "he" ? f.country_he : toProperCase(f.country_en);
        return name === selectedCountry;
      });
    }
    if (flightSearch) {
      const q = flightSearch.toUpperCase();
      flights = flights.filter((f) => f.flight_number.toUpperCase().includes(q));
    }

    // Sort
    flights.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case "scheduled":
          cmp = (a.scheduled || "").localeCompare(b.scheduled || ""); break;
        case "actual":
          cmp = (a.actual || "").localeCompare(b.actual || ""); break;
        case "airline":
          cmp = (a.airline_name || "").localeCompare(b.airline_name || ""); break;
        case "city":
          cmp = (a.city_he || "").localeCompare(b.city_he || ""); break;
        case "flight":
          cmp = (a.flight_number || "").localeCompare(b.flight_number || ""); break;
        case "status":
          cmp = (a.status_en || "").localeCompare(b.status_en || ""); break;
      }
      return sortAsc ? cmp : -cmp;
    });

    return flights;
  }, [data, activeTab, selectedAirline, selectedCountry, flightSearch, sortBy, sortAsc]);

  // Derive unique airlines and countries for the filter dropdowns
  const { airlines, countries, arrivalCount, departureCount } = useMemo(() => {
    if (!data) return { airlines: [], countries: [], arrivalCount: 0, departureCount: 0 };

    const tabFlights = data.flights.filter((f) => f.direction === activeTab);
    const airlineSet = new Set(
      tabFlights.map((f) => toProperCase(f.airline_name)).filter(Boolean)
    );
    const countrySet = new Set(
      tabFlights.map((f) => lang === "he" ? f.country_he : toProperCase(f.country_en)).filter(Boolean)
    );

    return {
      airlines: Array.from(airlineSet).sort(),
      countries: Array.from(countrySet).sort(),
      arrivalCount: data.flights.filter((f) => f.direction === "arrival").length,
      departureCount: data.flights.filter((f) => f.direction === "departure").length,
    };
  }, [data, activeTab, lang]);

  const clearFilters = () => {
    setSelectedAirline("");
    setSelectedCountry("");
    setFlightSearch("");
  };

  // Format the "last fetched" time
  const formatFetchedAt = (isoStr: string | null | undefined) => {
    if (!isoStr) return t.unknown;
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return t.unknown;
    }
  };

  return (
    <main className="min-h-screen py-8 px-4 md:px-8 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
          {pageTitle}
        </h1>
        <p className="text-sm text-gray-500">{t.subtitle}</p>
      </motion.div>

      {/* Refresh status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-4 glass-panel rounded-xl px-4 py-2 text-xs max-w-md mx-auto"
      >
        <div className="flex items-center gap-2 text-gray-400">
          <Wifi className="w-3.5 h-3.5 text-green-400" />
          <span>{t.lastUpdate}</span>
          <span className="text-white font-medium">{formatFetchedAt(data?.fetched_at)}</span>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1 text-[#4ECDC4] hover:text-[#4ECDC4]/80 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{t.refresh}</span>
        </button>
      </motion.div>

      {/* Tab Bar */}
      <TabBar
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); clearFilters(); }}
        arrivalCount={arrivalCount}
        departureCount={departureCount}
      />

      {/* Filter Bar */}
      <FilterBar
        airlines={airlines}
        countries={countries}
        selectedAirline={selectedAirline}
        selectedCountry={selectedCountry}
        flightSearch={flightSearch}
        activeTab={activeTab}
        onAirlineChange={setSelectedAirline}
        onCountryChange={setSelectedCountry}
        onFlightSearchChange={setFlightSearch}
        onClear={clearFilters}
      />

      {/* Sort selector */}
      <div className="flex items-center gap-2 justify-start max-w-4xl mx-auto w-full text-xs">
        <span className="text-gray-500">{t.sortBy}</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="glass-panel text-white rounded-lg py-1.5 px-2 text-xs font-medium focus:outline-none focus:border-[#4ECDC4]/50 transition-all appearance-none cursor-pointer"
        >
          <option value="scheduled" className="bg-gray-900">{t.sortScheduled}</option>
          <option value="actual" className="bg-gray-900">{t.sortActual}</option>
          <option value="airline" className="bg-gray-900">{t.sortAirline}</option>
          <option value="city" className="bg-gray-900">{t.sortCity}</option>
          <option value="flight" className="bg-gray-900">{t.sortFlight}</option>
          <option value="status" className="bg-gray-900">{t.sortStatus}</option>
        </select>
        <button
          onClick={() => setSortAsc((prev) => !prev)}
          className="glass-panel rounded-lg p-1.5 text-gray-400 hover:text-[#4ECDC4] transition-colors"
          title={sortAsc ? t.sortAsc : t.sortDesc}
        >
          <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${sortAsc ? "" : "rotate-180"}`} />
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-[#4ECDC4]" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-10">
          <div className="inline-block glass-panel border border-[#FF6B6B]/30 bg-[#FF6B6B]/10 text-[#FF6B6B] px-6 py-4 rounded-xl font-medium">
            {t.errorLoading}
          </div>
        </div>
      )}

      {/* Flight list */}
      {!isLoading && !error && (
        <div className="flex flex-col gap-3 pb-10">
          <AnimatePresence mode="popLayout">
            {filteredFlights.length > 0 ? (
              filteredFlights.map((flight, idx) => (
                <FlightCard key={flight.flight_number + flight.scheduled} flight={flight} index={idx} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-gray-500"
              >
                <p className="text-lg">{t.noFlights}</p>
                <p className="text-sm mt-1">{t.tryFilters}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
