"use client";

import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface TabBarProps {
  activeTab: "arrival" | "departure";
  onTabChange: (tab: "arrival" | "departure") => void;
  arrivalCount: number;
  departureCount: number;
}

export default function TabBar({ activeTab, onTabChange, arrivalCount, departureCount }: TabBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex gap-2 w-full max-w-md mx-auto">
      <button
        onClick={() => onTabChange("arrival")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
          activeTab === "arrival"
            ? "bg-[#4ECDC4]/15 text-[#4ECDC4] border border-[#4ECDC4]/30 shadow-lg shadow-[#4ECDC4]/10"
            : "glass-panel text-gray-400 hover:text-gray-300"
        }`}
      >
        <PlaneLanding className="w-5 h-5" />
        <span>{t.arrivals}</span>
        <span className="text-xs opacity-70">({arrivalCount})</span>
      </button>
      <button
        onClick={() => onTabChange("departure")}
        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
          activeTab === "departure"
            ? "bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30 shadow-lg shadow-[#FF6B6B]/10"
            : "glass-panel text-gray-400 hover:text-gray-300"
        }`}
      >
        <PlaneTakeoff className="w-5 h-5" />
        <span>{t.departures}</span>
        <span className="text-xs opacity-70">({departureCount})</span>
      </button>
    </div>
  );
}
