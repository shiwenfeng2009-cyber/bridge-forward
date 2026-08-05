"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { searchItems, suggestedSearches } from "./search-data";

type SearchPanelProps = {
  initialQuery: string;
};

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ");
}

export function SearchPanel({ initialQuery }: SearchPanelProps) {
  const [query, setQuery] = useState(initialQuery);
  const [toast, setToast] = useState<string | null>(null);

  const results = useMemo(() => {
    const normalized = normalize(query);

    if (!normalized) {
      return searchItems;
    }

    const tokens = normalized.split(" ").filter(Boolean);
    return searchItems.filter((item) => {
      const searchable = [item.title, item.zh, item.type, item.body, ...item.keywords]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalized) || tokens.every((token) => searchable.includes(token));
    });
  }, [query]);

  function runSearch(nextQuery = query) {
    const normalized = normalize(nextQuery);
    setToast(
      normalized
        ? `Found ${results.length} result${results.length === 1 ? "" : "s"} for “${nextQuery.trim()}”.`
        : "Showing the main Bridge Forward guide sections.",
    );
    window.setTimeout(() => setToast(null), 2600);
  }

  return (
    <section className="search-shell search-shell--interactive" aria-label="Site search">
      <form
        className="search-page-form search-page-form--glass"
        onSubmit={(event) => {
          event.preventDefault();
          runSearch();
        }}
        role="search"
      >
        <label className="sr-only" htmlFor="site-search">
          搜索 Ask、故事或学校信息 / Search Ask, stories, or school information
        </label>
        <input
          aria-label="搜索 Ask、故事或学校信息 / Search Ask, stories, or school information"
          id="site-search"
          name="q"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：地图、GPA、lunch、club、害怕说英语..."
          type="search"
          value={query}
        />
        <button type="submit">Search</button>
      </form>

      <div className="suggestion-grid suggestion-grid--buttons" aria-label="Suggested searches">
        {suggestedSearches.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => {
              setQuery(suggestion);
              setToast(`Try opening results for “${suggestion}”.`);
              window.setTimeout(() => setToast(null), 2200);
            }}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="search-results" aria-live="polite">
        <p className="search-results__count">
          {results.length === 0
            ? `No search results for “${query.trim()}”. 没有搜索结果。Try map, schedule, GPA, clubs, counselor, or stories.`
            : `${results.length} result${results.length === 1 ? "" : "s"}`}
        </p>

        <div className="search-result-grid">
          {results.map((item) => (
            <Link className="search-result-card" href={item.href} key={item.id}>
              <span>{item.type}</span>
              <h2>{item.title}</h2>
              <strong>{item.zh}</strong>
              <p>{item.body}</p>
            </Link>
          ))}
        </div>
      </div>

      {toast ? (
        <div className="search-toast" role="status">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
