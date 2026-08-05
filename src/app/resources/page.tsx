import Link from "next/link";

type ResourceItem = { name: string; zh: string; description: string; href: string; domain?: string };

const academicTools: ResourceItem[] = [
  { name: "Google Classroom", zh: "谷歌课堂", description: "查看课程、作业和老师通知。", href: "https://classroom.google.com", domain: "classroom.google.com" },
  { name: "Google Docs", zh: "谷歌文档", description: "在线文档编辑与协作。", href: "https://docs.google.com", domain: "docs.google.com" },
  { name: "Google Slides", zh: "谷歌幻灯片", description: "制作演示文稿，展示你的想法。", href: "https://slides.google.com", domain: "slides.google.com" },
  { name: "Google Sheets", zh: "谷歌表格", description: "在线表格处理与数据分析。", href: "https://sheets.google.com", domain: "sheets.google.com" },
  { name: "Google Drive", zh: "谷歌云端硬盘", description: "云端存储文件，随时随地访问。", href: "https://drive.google.com", domain: "drive.google.com" },
  { name: "Gmail", zh: "谷歌邮箱", description: "学校官方邮箱，重要通知都在这里。", href: "https://mail.google.com", domain: "gmail.com" },
  { name: "Google Chrome", zh: "谷歌浏览器", description: "快速、安全的网页浏览器。", href: "https://www.google.com/chrome/", domain: "google.com" },
  { name: "Microsoft 365", zh: "微软办公软件", description: "Word、Excel、PowerPoint 与协作工具。", href: "https://www.microsoft365.com", domain: "microsoft.com" },
  { name: "Grammarly", zh: "英文写作助手", description: "语法检查与写作优化助手。", href: "https://www.grammarly.com", domain: "grammarly.com" },
  { name: "Canva", zh: "在线设计工具", description: "设计海报、简历、演示和视觉内容。", href: "https://www.canva.com", domain: "canva.com" },
];

const learningPlatforms: ResourceItem[] = [
  { name: "Khan Academy", zh: "可汗学院", description: "免费在线课程，涵盖数学、科学与练习。", href: "https://www.khanacademy.org", domain: "khanacademy.org" },
  { name: "Quizlet", zh: "学习卡片", description: "记忆卡片与学习工具，帮助巩固知识。", href: "https://quizlet.com", domain: "quizlet.com" },
  { name: "Common App", zh: "大学申请平台", description: "美国大学通用申请平台。", href: "https://www.commonapp.org", domain: "commonapp.org" },
  { name: "College Board", zh: "考试与升学", description: "SAT、AP、大学申请信息与搜索。", href: "https://www.collegeboard.org", domain: "collegeboard.org" },
  { name: "BigFuture", zh: "大学与职业规划", description: "探索大学、职业与奖学金信息。", href: "https://bigfuture.collegeboard.org", domain: "bigfuture.collegeboard.org" },
  { name: "Scoir", zh: "大学规划", description: "大学与职业探索和申请管理工具。", href: "https://www.scoir.com", domain: "scoir.com" },
  { name: "Naviance", zh: "升学规划", description: "学业规划、大学搜索与申请跟踪。", href: "https://www.powerschool.com/classroom/naviance/", domain: "powerschool.com" },
  { name: "IXL", zh: "个性化练习", description: "个性化练习，提升各学科能力。", href: "https://www.ixl.com", domain: "ixl.com" },
  { name: "Edpuzzle", zh: "互动视频学习", description: "观看课程并完成互动学习任务。", href: "https://edpuzzle.com", domain: "edpuzzle.com" },
  { name: "Coursera", zh: "大学在线课程", description: "大学课程与技能学习平台。", href: "https://www.coursera.org", domain: "coursera.org" },
  { name: "Udemy", zh: "在线技能课程", description: "在线课程学习，拓展兴趣与技能。", href: "https://www.udemy.com", domain: "udemy.com" },
  { name: "Duolingo", zh: "语言学习", description: "有趣的语言学习 App，每天进步一点点。", href: "https://www.duolingo.com", domain: "duolingo.com" },
];

const dailyLife: ResourceItem[] = [
  { name: "Google Translate", zh: "谷歌翻译", description: "多语言翻译，沟通无障碍。", href: "https://translate.google.com", domain: "translate.google.com" },
  { name: "TheBus", zh: "公交查询", description: "查看公交路线、时刻表和实时位置。", href: "https://www.thebus.org", domain: "thebus.org" },
  { name: "WhatsApp", zh: "即时通讯", description: "常用的通讯软件，与家人朋友保持联系。", href: "https://www.whatsapp.com", domain: "whatsapp.com" },
  { name: "Instagram", zh: "学校动态", description: "分享生活，关注学校活动与社群。", href: "https://www.instagram.com", domain: "instagram.com" },
  { name: "Discord", zh: "社群交流", description: "加入学习小组、社团或兴趣社区。", href: "https://discord.com", domain: "discord.com" },
  { name: "Spotify", zh: "音乐与播客", description: "学习放松时的好音乐伙伴。", href: "https://www.spotify.com", domain: "spotify.com" },
];

const quickLinks: ResourceItem[] = [
  { name: "Moanalua High School", zh: "学校官网", description: "www.moanaluahs.org", href: "https://www.moanaluahs.org", domain: "moanaluahs.org" },
  { name: "Moanalua Library", zh: "学校图书馆", description: "808-832-3050", href: "https://www.moanaluahs.org/apps/pages/index.jsp?uREC_ID=524381&type=d", domain: "moanaluahs.org" },
  { name: "UH Mānoa", zh: "夏威夷大学", description: "www.manoa.hawaii.edu", href: "https://manoa.hawaii.edu", domain: "manoa.hawaii.edu" },
  { name: "Fastweb", zh: "奖学金搜索", description: "www.fastweb.com", href: "https://www.fastweb.com", domain: "fastweb.com" },
  { name: "USCIS", zh: "移民与新生支持", description: "www.uscis.gov", href: "https://www.uscis.gov", domain: "uscis.gov" },
];

function ResourceIcon({ domain, name }: { domain?: string; name: string }) {
  return <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" width="34" height="34" loading="lazy" />;
}

function ResourceGrid({ items, compact = false }: { items: ResourceItem[]; compact?: boolean }) {
  return <div className={compact ? "resource-link-grid resource-link-grid--compact" : "resource-link-grid"}>{items.map((item) => <a className="resource-link-card" href={item.href} target="_blank" rel="noreferrer" key={item.name}><ResourceIcon domain={item.domain} name={item.name}/><span><strong>{item.name}</strong><b>{item.zh}</b><small>{item.description}</small></span><i aria-hidden="true">↗</i></a>)}</div>;
}

export default function ResourcesPage() {
  return <main className="resource-directory-page">
    <div className="resource-directory-shell">
      <Link className="resource-back" href="/school-information">← Back · 返回上一页</Link>
      <section className="resource-directory-hero" aria-label="Students using school resources beside the Moanalua campus"><img src="/images/resources-campus-coast.png" alt="Students using laptops beside a watercolor campus and Honolulu shoreline"/></section>
      <aside className="resource-reassurance"><span aria-hidden="true">♡</span><p>You are not alone. Help and support are always available.<br/><b>你并不孤单。无论何时，都有支持和帮助在你身边。</b></p></aside>
      <section className="resource-directory-section"><h1>校园联系方式 <span>Campus Contacts</span></h1><div className="resource-contact-grid">
        <a href="mailto:counseling@moanaluahs.org"><b>辅导员办公室</b><strong>Counseling Office</strong><span>808-832-3090</span><small>counseling@moanaluahs.org</small><i>学业、个人及情绪支持</i></a>
        <a href="mailto:studentaffairs@moanaluahs.org"><b>学生事务办公室</b><strong>Student Affairs</strong><span>808-832-3080</span><small>studentaffairs@moanaluahs.org</small><i>学生生活、活动与注册</i></a>
        <a href="mailto:attendance@moanaluahs.org"><b>出勤办公室</b><strong>Attendance Office</strong><span>808-832-3060</span><small>attendance@moanaluahs.org</small><i>请假、出勤相关问题</i></a>
        <a href="mailto:counseling@moanaluahs.org"><b>心理健康支持</b><strong>Mental Health Support</strong><span>808-832-3090</span><small>counseling@moanaluahs.org</small><i>心理咨询与支持服务</i></a>
      </div></section>
      <section className="resource-directory-section"><h2>学术工具（必备软件） <span>Academic Tools</span></h2><ResourceGrid items={academicTools}/></section>
      <section className="resource-directory-section"><h2>学习平台（学术提升 &amp; 大学申请） <span>Learning Platforms</span></h2><ResourceGrid items={learningPlatforms}/></section>
      <section className="resource-directory-section"><h2>生活资源（日常生活好帮手） <span>Daily Life</span></h2><ResourceGrid items={dailyLife}/></section>
      <section className="resource-directory-section"><h2>快速链接（更多有用网站） <span>Helpful Links</span></h2><ResourceGrid items={quickLinks} compact/></section>
      <footer className="resource-directory-footer"><p>Take it one step at a time.<br/>You are doing better than you think.</p><div aria-hidden="true"/></footer>
    </div>
  </main>;
}
