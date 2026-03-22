"use client";

import { createContext, useContext, ReactNode } from "react";

export type Lang = "he" | "en";

const translations = {
  he: {
    title: "✈️ לוח טיסות",
    subtitle: 'נתב"ג – נמל התעופה בן גוריון',
    arrivals: "נחיתות",
    departures: "המראות",
    lastUpdate: "עדכון אחרון מרשות שדות התעופה:",
    refresh: "רענן",
    unknown: "לא ידוע",
    searchFlight: "חיפוש מספר טיסה...",
    allAirlines: "כל חברות התעופה",
    allCountriesArrivals: "כל מדינות המוצא",
    allCountriesDepartures: "כל מדינות היעד",
    clearFilters: "נקה מסננים",
    sortBy: "מיון:",
    sortScheduled: "זמן מתוכנן",
    sortActual: "זמן בפועל",
    sortAirline: "חברת תעופה",
    sortCity: "עיר",
    sortFlight: "מספר טיסה",
    sortStatus: "סטטוס",
    sortAsc: "סדר עולה",
    sortDesc: "סדר יורד",
    noFlights: "לא נמצאו טיסות",
    tryFilters: "נסה לשנות את המסננים",
    errorLoading: "שגיאה בטעינת נתוני טיסות",
    scheduled: "מתוכנן:",
    actual: "בפועל:",
    terminal: "טרמינל",
    counter: "דלפק",
    delayMin: "ד׳",
  },
  en: {
    title: "✈️ Flight Board",
    subtitle: "Ben Gurion Airport – TLV",
    arrivals: "Arrivals",
    departures: "Departures",
    lastUpdate: "Last update from airport authority:",
    refresh: "Refresh",
    unknown: "Unknown",
    searchFlight: "Search flight number...",
    allAirlines: "All Airlines",
    allCountriesArrivals: "All Origin Countries",
    allCountriesDepartures: "All Destination Countries",
    clearFilters: "Clear filters",
    sortBy: "Sort:",
    sortScheduled: "Scheduled",
    sortActual: "Actual",
    sortAirline: "Airline",
    sortCity: "City",
    sortFlight: "Flight #",
    sortStatus: "Status",
    sortAsc: "Ascending",
    sortDesc: "Descending",
    noFlights: "No flights found",
    tryFilters: "Try changing the filters",
    errorLoading: "Error loading flight data",
    scheduled: "Sched:",
    actual: "Actual:",
    terminal: "Terminal",
    counter: "Counter",
    delayMin: "min",
  },
};

interface I18nContextType {
  lang: Lang;
  t: (typeof translations)["he"];
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  t: translations.en,
  isRTL: false,
});

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const t = translations[lang];
  const isRTL = lang === "he";

  return (
    <I18nContext.Provider value={{ lang, t, isRTL }}>
      <div dir={isRTL ? "rtl" : "ltr"}>{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export function isValidLang(lang: string): lang is Lang {
  return lang === "he" || lang === "en";
}
