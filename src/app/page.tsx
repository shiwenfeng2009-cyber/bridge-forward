import Link from "next/link";
import { InlineSiteSearch } from "@/features/search/inline-site-search";

const pathways = [
  {
    href: "/school-information",
    number: "01",
    title: "校园指南",
    english: "School Guide",
    body: "学校规则、选课学分与美国教育体系",
    bodyEn: "Rules, credits, and the U.S. school system",
    tone: "green",
  },
  {
    href: "/ask/questions",
    number: "02",
    title: "同伴论坛",
    english: "Peer Community",
    body: "匿名提问，分享真实的学生经验",
    bodyEn: "Ask safely and learn from real experiences",
    tone: "yellow",
  },
  {
    href: "/ask/reflection",
    number: "03",
    title: "心灵港湾",
    english: "Wellness Space",
    body: "记录心情，找到温柔可靠的支持",
    bodyEn: "Reflect, breathe, and find caring support",
    tone: "pink",
  },
] as const;

export default function Home() {
  return (
    <main className="home-one-screen" id="top">
      <section className="home-stage" aria-labelledby="home-title">
        <div className="home-stage__shade" />
        <div className="home-stage__content">
          <h1 id="home-title">
            刚来美国，
            <span>也可以慢慢找到方向。</span>
          </h1>
          <p className="home-stage__subtitle">
            Support, guidance, and real stories for students.
          </p>
          <p className="home-stage__intro">
            校园信息、同伴经验与心理支持，都在一个温暖、清晰、值得信任的地方。
          </p>
        </div>

        <InlineSiteSearch className="home-stage__search" id="home-search" placeholder="搜索校园信息、规则或学生经验" />

        <div className="home-stage__paths" aria-label="首页主要功能">
          {pathways.map((item) => (
            <Link className={`home-glass-card home-glass-card--${item.tone}`} href={item.href} key={item.href}>
              <span className="home-glass-card__number">{item.number}</span>
              <span className="home-glass-card__title">
                <strong>{item.title}</strong>
                <small>{item.english}</small>
              </span>
              <span className="home-glass-card__body">
                {item.body}
                <small>{item.bodyEn}</small>
              </span>
              <span className="home-glass-card__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>

        <p className="home-stage__promise">
          <span aria-hidden="true">✦</span>
          在异国他乡，你不需要独自弄懂一切。
          <small>You belong here. We move forward together.</small>
        </p>
      </section>
    </main>
  );
}
