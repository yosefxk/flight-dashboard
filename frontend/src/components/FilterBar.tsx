"use client";

import { Search, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface FilterBarProps {
  airlines: string[];
  countries: string[];
  selectedAirline: string;
  selectedCountry: string;
  flightSearch: string;
  activeTab: "arrival" | "departure";
  onAirlineChange: (val: string) => void;
  onCountryChange: (val: string) => void;
  onFlightSearchChange: (val: string) => void;
  onClear: () => void;
}

export default function FilterBar({
  airlines,
  countries,
  selectedAirline,
  selectedCountry,
  flightSearch,
  onAirlineChange,
  onCountryChange,
  onFlightSearchChange,
  onClear,
  activeTab,
}: FilterBarProps) {
  const { t, isRTL } = useI18n();
  const hasFilters = selectedAirline || selectedCountry || flightSearch;
  const countryLabel = activeTab === "arrival" ? t.allCountriesArrivals : t.allCountriesDepartures;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Flight search */}
      <div className="relative">
        <Search className={`absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500`} />
        <input
          type="text"
          value={flightSearch}
          onChange={(e) => onFlightSearchChange(e.target.value)}
          placeholder={t.searchFlight}
          className={`w-full glass-panel text-white rounded-xl py-3 ${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} text-sm font-medium focus:outline-none focus:border-[#4ECDC4]/50 transition-all placeholder:text-gray-500`}
        />
      </div>

      {/* Dropdowns row */}
      <div className="flex gap-2">
        <select
          value={selectedAirline}
          onChange={(e) => onAirlineChange(e.target.value)}
          className="flex-1 glass-panel text-white rounded-xl py-3 px-3 text-sm font-medium focus:outline-none focus:border-[#4ECDC4]/50 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">{t.allAirlines}</option>
          {airlines.map((a) => (
            <option key={a} value={a} className="bg-gray-900">{a}</option>
          ))}
        </select>

        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(e.target.value)}
          className="flex-1 glass-panel text-white rounded-xl py-3 px-3 text-sm font-medium focus:outline-none focus:border-[#4ECDC4]/50 transition-all appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">{countryLabel}</option>
          {countries.map((c) => (
            <option key={c} value={c} className="bg-gray-900">{c}</option>
          ))}
        </select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#FF6B6B] transition-colors mx-auto"
        >
          <X className="w-3 h-3" />
          <span>{t.clearFilters}</span>
        </button>
      )}
    </div>
  );
}
