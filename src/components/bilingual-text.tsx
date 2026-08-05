"use client";

import { useLanguage } from "@/lib/i18n/language-context";
import type { LanguageMode } from "@/lib/i18n/types";

type BilingualTextProps = {
  zh: string;
  en: string;
  mode?: LanguageMode;
  className?: string;
};

export function BilingualText({ zh, en, mode, className }: BilingualTextProps) {
  const language = useLanguage();
  const activeMode = mode ?? language.mode;
  return <span className={className}><span lang="en" data-no-translate>{en}</span><span className="bilingual-divider" aria-hidden="true"> / </span><span lang={activeMode}>{zh}</span></span>;
}
