const helpRoutes = [
  {
    title: "Trusted adult",
    zh: "可信任的成年人",
    body: "如果你不知道下一步怎么办，可以先找家人、监护人、老师、club advisor 或其他你信任的成年人。",
    en: "If you are not sure what to do next, start with a parent, guardian, teacher, club advisor, or another trusted adult.",
  },
  {
    title: "School counselor or staff",
    zh: "学校 counselor 或 staff",
    body: "如果问题和学校、课程、朋友、bullying 或适应有关，可以联系 counselor、teacher 或 school office。",
    en: "For school, class, friendship, bullying, or adjustment concerns, contact a counselor, teacher, or school office.",
  },
  {
    title: "988 Suicide & Crisis Lifeline",
    zh: "988 危机支持热线",
    body: "在美国可以 call、text 或 chat 988。988 Lifeline 是免费的、保密的，全年每天都有人接听。",
    en: "In the U.S., you can call, text, or chat 988. The 988 Lifeline is free, confidential, and available 24/7/365.",
  },
  {
    title: "Immediate danger",
    zh: "如果现在有立即危险",
    body: "如果你或别人现在处在立即危险中，请联系 911 或当地 emergency services。",
    en: "If you or someone else is in immediate danger, contact 911 or local emergency services.",
  },
] as const;

export default function ResourcesPage() {
  return (
    <main className="section-page">
      <section className="section-hero" aria-labelledby="resources-heading">
        <div className="section-hero__copy">
          <p className="eyebrow">Resources / Get Help</p>
          <h1 id="resources-heading">需要帮助时，可以从这里开始</h1>
          <p>
            Bridge Forward 提供 peer support、学校信息和同伴经验，但不能代替 counselor、
            医生、紧急服务或专业帮助。This site does not provide diagnosis or treatment.
          </p>
        </div>
        <div className="section-hero__art" aria-hidden="true" />
      </section>

      <section className="resources-grid" aria-label="Help routes">
        {helpRoutes.map((route) => (
          <article className="resource-card" key={route.title}>
            <span className="card-kicker">{route.zh}</span>
            <h2>{route.title}</h2>
            <p>{route.body}</p>
            <p>{route.en}</p>
          </article>
        ))}
      </section>

      <section className="notice-card" id="urgent-help">
        <p>
          如果你只是感到迷茫，可以先回到 Reflection Corner 或 Ask。  
          如果你现在不安全，请不要等网站回复，直接联系可信任的成年人、988 或 911。
        </p>
      </section>

      <section className="resource-sources" aria-label="Source notes">
        <h2>Source notes</h2>
        <ul>
          <li>
            988 information is based on the official 988 Suicide & Crisis Lifeline website.
          </li>
          <li>
            Moanalua High School information should be checked against official Hawaiʻi DOE
            or school pages before launch.
          </li>
          <li>
            Bridge Forward does not promise emergency monitoring. Public pages should be reviewed
            regularly before launch.
          </li>
        </ul>
      </section>
    </main>
  );
}
