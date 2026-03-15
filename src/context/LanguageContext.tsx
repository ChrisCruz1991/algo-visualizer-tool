"use client";

import { createContext, useContext, useState } from "react";
import type { SupportedLanguage } from "@/engine/types";

type LanguageContextValue = {
  selectedLanguage: SupportedLanguage;
  setSelectedLanguage: (lang: SupportedLanguage) => void;
};

const LanguageContext = createContext<LanguageContextValue>({
  selectedLanguage: "typescript",
  setSelectedLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] = useState<SupportedLanguage>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedLanguage") as SupportedLanguage | null;
      if (stored && ["typescript", "python", "java", "cpp"].includes(stored)) {
        return stored;
      }
    }
    return "typescript";
  });

  const setSelectedLanguage = (lang: SupportedLanguage) => {
    setSelectedLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedLanguage", lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
