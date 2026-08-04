import Link from "next/link";

const askSections = [
  {
    href: "/ask/questions",
    imageClass: "mini-illustration--chat",
    kicker: "Forum",
    title: "Ask like a group chat",
    zh: "像群聊一样开口问",
    body: "Lunch, clubs, English, culture shock, confusing rules — small questions are welcome here.",
  },
  {
    href: "/ask/stories",
    imageClass: "mini-illustration--stories",
    kicker: "Story Library",
    title: "Browse student stories",
    zh: "像看文章一样读故事",
    body: "Scan titles first, then open the story that sounds closest to what you are feeling.",
  },
  {
    href: "/ask/reflection",
    imageClass: "mini-illustration--diary",
    kicker: "Private Journal",
    title: "Check in with yourself",
    zh: "留一个安静的心情角落",
    body: "A diary-like reflection corner. Private, gentle, and not a diagnosis.",
  },
] as const;

export default function AskPage() {
  return (
    <main className="section-page ask-landing">
      <section className="section-hero section-hero--chat" aria-labelledby="ask-heading">
        <div className="section-hero__copy">
          <p className="eyebrow">Ask hub</p>
          <h1 id="ask-heading">问题、故事和心情，都可以有一个出口</h1>
          <p>
            This is not a formal office and not social media. It should feel like a warm message board at school:
            you can first read how others asked, how they got through it, and then decide whether you want to share.
          </p>
        </div>
        <div className="section-hero__art section-hero__art--chat" aria-hidden="true" />
      </section>

      <section className="playful-hub-grid" aria-label="Ask categories">
        {askSections.map((section) => (
          <Link className="playful-hub-card" href={section.href} key={section.title}>
            <div className={`mini-illustration ${section.imageClass}`} aria-hidden="true" />
            <span className="card-kicker">{section.kicker}</span>
            <h2>{section.title}</h2>
            <strong>{section.zh}</strong>
            <p>{section.body}</p>
            <span className="bubble-link">Open →</span>
          </Link>
        ))}
      </section>

      <aside className="notice-card notice-card--soft">
        <p>
          第一版会继续审核问题、故事和新用户前几条回复。这样论坛会更安全，也更适合刚来的、
          比较内向的学生慢慢开口。
        </p>
      </aside>
    </main>
  );
}
