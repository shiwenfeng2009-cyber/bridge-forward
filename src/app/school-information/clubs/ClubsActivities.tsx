"use client";

import { useMemo, useState } from "react";

type Club = { name: string; zh: string; category: string };
const clubs: Club[] = [
  { name:"African American Cultural Club", zh:"非裔美国文化社", category:"Arts & Culture" }, { name:"Book Club", zh:"读书社", category:"Academic" },
  { name:"Called Christian Club", zh:"基督教学生社", category:"Service & Community" }, { name:"Chess Club", zh:"国际象棋社", category:"Academic" },
  { name:"Chinese Cultural Club", zh:"中华文化社", category:"Arts & Culture" }, { name:"Class of 2026", zh:"2026 届学生会", category:"Leadership" },
  { name:"Class of 2027", zh:"2027 届学生会", category:"Leadership" }, { name:"Dance Moanalua", zh:"Moanalua 舞蹈团", category:"Arts & Culture" },
  { name:"Development Team (Coding Club)", zh:"开发团队（编程社）", category:"Academic" }, { name:"DECA", zh:"商业与市场营销社", category:"Leadership" },
  { name:"FCCLA", zh:"家庭、职业与社区领袖协会", category:"Leadership" }, { name:"Gay Straight Alliance", zh:"多元性别友善联盟", category:"Special Interests" },
  { name:"Girls Who Code", zh:"女生编程社", category:"Academic" }, { name:"HOSA", zh:"未来健康专业人士协会", category:"Academic" },
  { name:"Interact Club", zh:"青年服务社", category:"Service & Community" }, { name:"Japanese Club", zh:"日本文化社", category:"Arts & Culture" },
  { name:"Korean Cultural Club", zh:"韩国文化社", category:"Arts & Culture" }, { name:"LEO Club", zh:"青少年狮子会", category:"Service & Community" },
  { name:"Library Club", zh:"图书馆社", category:"Academic" }, { name:"Math Team", zh:"数学队", category:"Academic" },
  { name:"Micronesian Club", zh:"密克罗尼西亚文化社", category:"Arts & Culture" }, { name:"National Art Honor Society", zh:"国家艺术荣誉协会", category:"Arts & Culture" },
  { name:"National Honor Society", zh:"国家荣誉协会", category:"Leadership" }, { name:"Pacific and Asian Affairs Council (PAAC)", zh:"太平洋与亚洲事务委员会", category:"Leadership" },
  { name:"PC Video Game Console Club", zh:"电脑与主机游戏社", category:"Special Interests" }, { name:"Peer Education Program (PEP)", zh:"同伴教育计划", category:"Leadership" },
  { name:"Photography Club", zh:"摄影社", category:"Arts & Culture" }, { name:"Polynesian Dance Club", zh:"波利尼西亚舞蹈社", category:"Arts & Culture" },
  { name:"Pre-Law Society (Mock Trial Team)", zh:"法律预科社（模拟法庭队）", category:"Academic" }, { name:"Robotics", zh:"机器人社", category:"Academic" },
  { name:"Science Academic Team (SAT)", zh:"科学学术队", category:"Academic" }, { name:"Science Club", zh:"科学社", category:"Academic" },
  { name:"Spanish Club", zh:"西班牙语社", category:"Arts & Culture" }, { name:"Speech and Debate Club", zh:"演讲与辩论社", category:"Academic" },
  { name:"Student Association", zh:"学生会", category:"Leadership" }, { name:"Yearbook", zh:"年鉴编辑部", category:"Leadership" },
];
const categories = ["All", "Academic", "Arts & Culture", "Leadership", "Service & Community", "Special Interests"];
const overview = [
  ["Academic", "学术类", "Math Team, Science Club, Robotics, Coding, Debate and more."],
  ["Arts & Culture", "艺术文化类", "Art, photography, dance and cultural clubs."],
  ["Leadership", "领导力类", "Student Association, DECA, FCCLA and honor societies."],
  ["Service", "服务类", "Interact, LEO and community-focused groups."],
  ["Special Interests", "兴趣社团", "Gaming, identity, technology and shared interests."],
];
const events = [["Homecoming", "返校节", "A week of activities leading up to the big game and dance.", "Usually in October"], ["Prom", "舞会", "An unforgettable night of dancing, photos, and memories with friends.", "Usually in April – May"], ["Spirit Week", "精神周", "Dress up, show your school spirit, and earn points for your class.", "During Homecoming Week"], ["Traditions", "传统活动", "Lei Day, May Day, Seniors vs. Staff games, and more.", "Throughout the year"]];
const sports = [
  ["Fall 秋季", "Air Riflery · Bowling · Cross Country · Football · Sideline Cheer · Competitive Cheer · Girls Volleyball · Soft Tennis · JV Softball"],
  ["Winter 冬季", "Basketball · Paddling · Soccer · Swimming · JV Tennis · Wrestling · JV Baseball"],
  ["Spring 春季", "Varsity Baseball · Girls Flag Football · Varsity Softball · Golf · Judo · Tennis · Track & Field · Girls Water Polo · Boys Volleyball"],
];

const detailedEvents = [
  { name:"Homecoming", zh:"返校节", audience:"Grades 9–12 · 9–12 年级", timing:"2025 example: Sep 22–26 · 2026 date pending", what:"A full school-spirit week with themed dress days, class activities, a pep rally, the homecoming game, and a dance.", whatZh:"全校精神周：每天有不同穿搭主题、年级活动、助威集会、返校比赛与舞会。", grade:"All grades participate. Each class may earn spirit points; seniors often lead traditions and school-spirit activities.", gradeZh:"所有年级都可参加；各年级通常以班级为单位累计精神分，高年级会承担更多带领与传统活动。" },
  { name:"Junior Prom", zh:"十一年级舞会", audience:"Primarily Grade 11 · 主要面向 11 年级", timing:"Mar 7, 2026 · 5:00–9:00 PM · Hyatt Regency Waikīkī", what:"A formal evening of music, dancing, photos, and time with classmates. Ticket, guest, and dress requirements are announced by the school.", whatZh:"正式舞会，包括音乐、跳舞、合影与同学交流；购票、携带校外来宾和着装规则以学校公告为准。", grade:"This published event is Junior Prom. Other grades should check announcements for grade-specific dances and eligibility rules.", gradeZh:"本次公布的是十一年级舞会；其他年级请查看当年公告中的专属舞会与参加资格。" },
  { name:"Spirit Week", zh:"精神周", audience:"Grades 9–12 · 9–12 年级", timing:"During Homecoming Week · 2025 example: Sep 22–26", what:"Students follow a daily theme, join lunchtime or class competitions, and show Moanalua pride before the homecoming game.", whatZh:"学生按每日主题穿搭，参加午间或年级竞赛，并在返校比赛前为学校加油。", grade:"Themes are shared schoolwide, while competitions and points are usually organized by graduating class.", gradeZh:"主题通常全校统一，比赛与积分多按毕业年份分组。" },
  { name:"May Day & Senior Traditions", zh:"五月节与毕业班传统", audience:"Performers & seniors · 表演学生与 12 年级", timing:"Spring · 2026 seniors: May 19 last day; May 26 graduation, 6:00–7:30 PM", what:"May Day celebrates Hawaiian and Polynesian culture through lei, music, and dance. Senior traditions continue through the last day, commencement, and lei-giving.", whatZh:"五月节以花环、音乐和舞蹈庆祝夏威夷与波利尼西亚文化；毕业班还会参加最后上课日、毕业典礼与献花环活动。", grade:"Performers rehearse in advance. Grade 12 has separate graduation milestones; underclass students follow event notices for their role.", gradeZh:"演出学生需提前排练；12 年级有独立毕业节点，其他年级按演出与活动公告参加。" },
];

const detailedSports = [
  { season:"Fall", zh:"秋季", items:[["Air Riflery","气步枪"],["Bowling","保龄球"],["Cross Country","越野跑"],["Football","美式橄榄球"],["Sideline Cheer","场边啦啦队"],["Competitive Cheer","竞技啦啦队"],["Girls Volleyball","女子排球"],["Soft Tennis","软式网球"],["JV Softball","初级校队垒球"]] },
  { season:"Winter", zh:"冬季", items:[["Basketball","篮球"],["Paddling","独木舟竞速"],["Soccer","足球"],["Swimming","游泳"],["JV Tennis","初级校队网球"],["Wrestling","摔跤"],["JV Baseball","初级校队棒球"]] },
  { season:"Spring", zh:"春季", items:[["Varsity Baseball","校队棒球"],["Girls Flag Football","女子腰旗橄榄球"],["Varsity Softball","校队垒球"],["Golf","高尔夫"],["Judo","柔道"],["Tennis","网球"],["Track & Field","田径"],["Girls Water Polo","女子水球"],["Boys Volleyball","男子排球"]] },
];

export default function ClubsActivities() {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("All"); const [showAll, setShowAll] = useState(true);
  const visible = useMemo(() => clubs.filter(c => (category === "All" || c.category === category) && `${c.name} ${c.zh}`.toLowerCase().includes(query.trim().toLowerCase())), [query, category]);
  return <div className="clubs-page__container">
    <header className="clubs-hero"><div><p>STUDENT LIFE · 学生生活</p><h1>Get Involved,<br />Make Memories <span>参与活动，收获成长与友谊</span></h1><small>From clubs and sports to dances and traditions, there’s a place for everyone at Moanalua.<br />从社团、运动到舞会和传统活动，在 Moanalua，你总能找到属于自己的舞台。</small></div><img src="/images/school-information-clean.png" alt="Moanalua High School watercolor campus" /></header>

    <section className="clubs-section"><h2><b>1</b> Explore &amp; Join Clubs <span>探索并加入社团</span></h2><p>Moanalua offers a wide variety of clubs. Join something you love or try something new!<br />我们有丰富多样的社团，找到你的兴趣，结识志同道合的朋友。</p><div className="clubs-overview">{overview.map((x,i)=><article key={x[0]}><i>{String(i+1).padStart(2,"0")}</i><h3>{x[0]} <span>{x[1]}</span></h3><p>{x[2]}</p><button onClick={()=>{setCategory(x[0]==="Service"?"Service & Community":x[0]);setShowAll(true)}} type="button">Learn More</button></article>)}</div><aside className="clubs-join"><strong>How to Join <span>如何加入？</span></strong><p>Most clubs recruit at the beginning of the school year during Club Fair. You can also contact the club advisor anytime.<br />大多数社团在学年初的社团招新会上招募新成员，也可以随时联系社团指导老师。</p><button onClick={()=>setShowAll(v=>!v)} aria-expanded={showAll} type="button">{showAll ? "Hide Club List 收起列表" : "Club List 社团列表"} →</button></aside>
      {showAll && <div className="club-directory"><header><div><h3>Official Club Directory <span>官方完整社团名单</span></h3><small>{clubs.length} clubs listed by Moanalua High School</small></div><label><span>Search 搜索</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Club name / 社团名称" /></label></header><div className="club-filters">{categories.map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)} type="button">{c}</button>)}</div><div className="club-list">{visible.map(c=><a key={c.name} href="https://www.moanaluahs.org/m/departments/index.jsp?show=CLU" target="_blank" rel="noreferrer"><strong>{c.name}</strong><span>{c.zh}</span><small>{c.category}</small></a>)}</div>{!visible.length&&<p className="club-empty">No matching club. 没有找到匹配的社团。</p>}</div>}
    </section>

    <section className="clubs-section"><h2><b>2</b> Events &amp; Traditions <span>重要活动与传统</span></h2><div className="event-grid">{events.map((x,i)=><article key={x[0]}><i>{String(i+1).padStart(2,"0")}</i><h3>{x[0]} <span>{x[1]}</span></h3><p>{x[2]}<br /><span>{i===0?"一周的精彩活动，以足球比赛和舞会达到高潮。":i===1?"与朋友们共度难忘的夜晚，留下美好回忆。":i===2?"换上主题服装，为班级加油，赢取精神分数。":"花环日、五一节、师生对抗赛等传统活动。"}</span></p><small>{x[3]}</small></article>)}</div></section>
    <section className="clubs-section"><h2><b>3</b> Sports &amp; Athletics <span>体育运动</span></h2><div className="sports-panel"><aside><strong>Represent Moanalua with pride!</strong><p>We offer sports for all seasons and skill levels.<br />为 Moanalua 的荣誉而战！我们提供多种体育项目。</p><a href="https://www.moanaluahs.org/m/pages/index.jsp?type=d&uREC_ID=432947" target="_blank" rel="noreferrer">Athletics Website 体育官网 →</a></aside>{sports.map(s=><article key={s[0]}><h3>{s[0]}</h3><p>{s[1]}</p></article>)}</div></section>
    <section className="clubs-section"><h2><b>4</b> Get Involved Tips <span>参与小贴士</span></h2><div className="clubs-tips">{[["Try Something New","勇于尝试新事物","Step out of your comfort zone and discover new passions."],["Meet New Friends","结识新朋友","Clubs and activities are a great way to build lasting friendships."],["Build Your Future","成就未来","Leadership and involvement look great on college applications."],["Have Fun!","享受乐趣","High school is about memories. Make every moment count!"]].map((x,i)=><article key={x[0]}><i>{i+1}</i><strong>{x[0]} <span>{x[1]}</span></strong><p>{x[2]}</p></article>)}</div></section>
    <footer className="clubs-help"><strong>Need help finding the right activity for you?<span>我们在这里帮助你！</span></strong><a href="/school-information/people">Ask a Counselor 咨询辅导员 →</a><a href="https://www.moanaluahs.org/apps/staff/" target="_blank" rel="noreferrer">Visit the Activities Office 访问活动办公室 →</a><a href="https://www.instagram.com/moanaluahs/" target="_blank" rel="noreferrer">Follow @moanaluahs 关注学校社交媒体 →</a></footer>
    <p className="clubs-source">Club and athletics information verified against the official Moanalua High School website · 社团和体育信息来源：Moanalua High School 官网</p>
    <section className="clubs-section clubs-events-detailed"><h2><b>2</b> Events &amp; Traditions <span>重要活动与传统</span></h2><p className="clubs-date-note">Published dates are shown where available. Annual dates can change—please check the school calendar before making plans.<br />已公布的日期会明确标注；每年安排可能调整，参加前请再次查看学校校历。</p><div className="event-detail-grid">{detailedEvents.map((event,i)=><article key={event.name}><i>{String(i+1).padStart(2,"0")}</i><h3>{event.name}<span>{event.zh}</span></h3><strong>{event.audience}</strong><p>{event.what}<span>{event.whatZh}</span></p><dl><div><dt>Grade notes · 年级区别</dt><dd>{event.grade}<span>{event.gradeZh}</span></dd></div><div><dt>Date &amp; place · 日期与地点</dt><dd>{event.timing}</dd></div></dl></article>)}</div></section>
    <section className="clubs-section clubs-sports-detailed"><h2><b>3</b> Sports &amp; Athletics <span>体育运动</span></h2><div className="sports-panel sports-panel--bilingual"><aside><strong>Represent Moanalua with pride!<span>为 Moanalua 的荣誉而战！</span></strong><p>Sports are offered across three seasons and at different team levels.<br />体育项目分三个赛季，并设有不同校队级别。</p><a href="https://www.moanaluahs.org/m/pages/index.jsp?type=d&amp;uREC_ID=432947" target="_blank" rel="noreferrer">Athletics Website 体育官网 →</a></aside>{detailedSports.map(group=><article key={group.season}><h3>{group.season} <span>{group.zh}</span></h3><ul>{group.items.map(([en,zh])=><li key={en}><b>{en}</b><span>{zh}</span></li>)}</ul></article>)}</div></section>
  </div>;
}
