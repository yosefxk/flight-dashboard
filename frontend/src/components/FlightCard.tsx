"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Plane } from "lucide-react";
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

function getStatusClass(status: string, isDelayed: boolean): string {
  const s = status.toUpperCase();
  if (s === "LANDED" || s === "DEPARTED") return "status-landed";
  if (s === "CANCELED" || s === "CANCELLED") return "status-canceled";
  if (isDelayed) return "status-delayed";
  return "status-default";
}

function formatTime(isoStr: string): string {
  if (!isoStr) return "--:--";
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "--:--";
  }
}

export default function FlightCard({ flight, index }: { flight: Flight; index: number }) {
  const { t, lang } = useI18n();
  const isArrival = flight.direction === "arrival";
  const cityName = lang === "he" ? flight.city_he : toProperCase(flight.city_en);
  const countryName = lang === "he" ? flight.country_he : toProperCase(flight.country_en);
  const statusText = lang === "he" ? flight.status_he : toProperCase(flight.status_en);
  const airlineName = toProperCase(flight.airline_name);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.5) }}
      className="glass-panel rounded-xl p-4 hover:border-white/15 transition-all"
    >
      {/* Top row: Flight number + Status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Plane className={`w-4 h-4 ${isArrival ? "text-[#4ECDC4] rotate-90" : "text-[#FF6B6B] -rotate-45"}`} />
          <span className="font-bold text-base">{flight.flight_number}</span>
          <span className="text-xs text-gray-500">{airlineName}</span>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusClass(flight.status_en, flight.is_delayed)}`}>
          {statusText || flight.status_en}
        </span>
      </div>

      {/* Middle row: City + Country */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
        <span className="font-medium">{cityName}</span>
        <span className="text-xs text-gray-500">({flight.city_code})</span>
        <span className="text-xs text-gray-500">• {countryName}</span>
      </div>

      {/* Bottom row: Times + Terminal */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-gray-400">{t.scheduled}</span>
            <span className="font-medium">{formatTime(flight.scheduled)}</span>
          </div>
          {flight.actual && flight.actual !== flight.scheduled && (
            <div className="flex items-center gap-1">
              <span className="text-gray-400">{t.actual}</span>
              <span className={`font-medium ${flight.is_delayed ? "text-yellow-400" : "text-green-400"}`}>
                {formatTime(flight.actual)}
              </span>
              {flight.is_delayed && (
                <span className="text-xs text-yellow-400/70">
                  (+{flight.delay_minutes}{t.delayMin})
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {flight.terminal && <span>{t.terminal} {flight.terminal}</span>}
          {flight.checkin_counters && <span>• {t.counter} {flight.checkin_counters}</span>}
        </div>
      </div>
    </motion.div>
  );
}
