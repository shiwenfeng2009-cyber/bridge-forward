"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import type { LanguageMode } from "@/lib/i18n/types";

const OPTIONS: ReadonlyArray<{ label: string; mode: LanguageMode }> = [
  { label: "中文", mode: "zh" },
  { label: "日本語", mode: "ja" },
  { label: "한국어", mode: "ko" },
  { label: "Filipino", mode: "fil" },
];

export function LanguageControl() {
  const { mode, setMode } = useLanguage();

  return (
    <div className="language-control" role="group" aria-label="Secondary language / 第二语言">
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
