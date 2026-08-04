"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import type { LanguageMode } from "@/lib/i18n/types";

const OPTIONS: ReadonlyArray<{ label: string; mode: LanguageMode }> = [
  { label: "中文", mode: "zh" },
  { label: "EN", mode: "en" },
  { label: "双语", mode: "bilingual" },
];

export function LanguageControl() {
  const { mode, setMode } = useLanguage();

  return (
    <div className="language-control" role="group" aria-label="语言选择 / Language">
      {OPTIONS.map((option) => (
        <button
          aria-pressed={mode === option.mode}
          className="language-control__button"
          key={option.mode}
          onClick={() => setMode(option.mode)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
