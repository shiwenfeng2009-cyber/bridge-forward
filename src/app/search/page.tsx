import { SearchPanel } from "@/features/search/search-panel";

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

export default function SearchPage({ searchParams }: SearchPageProps = {}) {
  const initialQuery = searchParams?.q ?? "";
  return (
    <main className="section-page search-page">
      <section className="section-hero section-hero--search" aria-labelledby="search-heading">
        <div className="section-hero__copy">
          <p className="eyebrow">Search / 搜索</p>
          <h1 id="search-heading">搜索你现在最需要知道的事</h1>
          <p>
            Search school rules, Moanalua resources, student questions, stories, and reflection tools.
            第一版先搜索网站内的学校信息、论坛入口、故事和自我整理资源。
          </p>
        </div>
        <div className="section-hero__art section-hero__art--search" aria-hidden="true" />
      </section>

      <SearchPanel initialQuery={initialQuery} />
    </main>
  );
}
