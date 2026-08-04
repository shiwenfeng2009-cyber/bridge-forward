import Link from "next/link";

const informationCards = [
  {
    number: "01",
    className: "information-scene-card--map",
    href: "/school-information/map",
    title: "学校地图",
    english: "School Map",
    description: "查找教学楼、办公室和校园内的重要地点。",
    tone: "green",
  },
  {
    number: "02",
    className: "information-scene-card--schedule",
    href: "/school-information/schedule",
    title: "课程表",
    english: "Class Schedule",
    description: "查看每日课程安排、上课时间和重要日期。",
    tone: "blue",
  },
  {
    number: "03",
    className: "information-scene-card--people",
    href: "/school-information/people",
    title: "可以帮助你的人",
    english: "People Who Can Help",
    description: "认识老师、辅导员和校园支持人员。",
    tone: "yellow",
  },
  {
    number: "04",
    className: "information-scene-card--courses",
    href: "/school-information/academics",
    title: "成绩与课程",
    english: "Grades & Courses",
    description: "了解成绩、学分、选课流程与毕业要求。",
    tone: "pink",
  },
  {
    number: "05",
    className: "information-scene-card--clubs",
    href: "/school-information/clubs",
    title: "社团活动",
    english: "Clubs & Activities",
    description: "探索社团、校园活动和认识新朋友的机会。",
    tone: "purple",
  },
  {
    number: "06",
    className: "information-scene-card--resources",
    href: "/resources",
    title: "重要资源链接",
    english: "Important Resources",
    description: "查看常用链接、联系方式和校园资源。",
    tone: "blue",
  },
] as const;

export default function SchoolInformationPage() {
  return (
    <main className="information-scene-page">
      <section className="information-scene" aria-labelledby="information-scene-title">
        <div className="information-scene__intro">
          <h1 id="information-scene-title">Welcome to Your New Journey<br/><span>欢迎开启你的新旅程 ♥</span></h1>
          <p>You don’t have to figure everything out at once.</p>
          <small>你不需要一次就弄懂所有事情，我们一步一步来。</small>
        </div>

        <form className="information-scene__search" action="/search" role="search">
          <label className="sr-only" htmlFor="scene-search">搜索校园信息</label>
          <span aria-hidden="true">⌕</span>
          <input id="scene-search" name="q" placeholder="搜索校园信息或资源" type="search" />
          <button type="submit">搜索 <small>Search</small></button>
        </form>

        <nav className="information-scene__cards" aria-label="校园信息分类">
          {informationCards.map((card) => (
            <Link
              className={`information-scene-card information-scene-card--${card.tone} ${card.className}`}
              href={card.href}
              key={card.number}
            >
              <span className="information-scene-card__number">{card.number}</span>
              <span className="information-scene-card__copy">
                <strong>{card.title}</strong>
                <small>{card.english}</small>
                <span>{card.description}</span>
              </span>
              <span className="information-scene-card__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}
