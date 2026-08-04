"use client";

import { useMemo, useState } from "react";

type Category = "administration" | "counseling" | "academics" | "student-life" | "operations";
type Group = "administration" | "counseling" | "support";
type Person = { name: string; role: string; roleZh: string; description: string; descriptionZh: string; photo: string; profile: string; group: Group; categories: Category[] };

const people: Person[] = [
  { name: "R. Martin", role: "Principal", roleZh: "校长", description: "School leadership and administration", descriptionZh: "学校领导与行政管理", photo: "/images/staff/r-martin.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1244334", group: "administration", categories: ["administration", "academics"] },
  { name: "B. Honda", role: "Vice Principal", roleZh: "副校长", description: "Administration and student support", descriptionZh: "行政管理与学生支持", photo: "/images/staff/b-honda.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1606336", group: "administration", categories: ["administration", "operations"] },
  { name: "M. Hangai", role: "Vice Principal", roleZh: "副校长", description: "Administration and school operations", descriptionZh: "行政管理与学校运营", photo: "/images/staff/m-hangai.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1606338", group: "administration", categories: ["administration", "operations"] },
  { name: "L. Kamikawa", role: "Vice Principal", roleZh: "副校长", description: "Administration and student services", descriptionZh: "行政管理与学生服务", photo: "/images/staff/l-kamikawa.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1824000", group: "administration", categories: ["administration", "student-life"] },
  { name: "T. Apana", role: "Counselor", roleZh: "学校辅导员", description: "Academic, personal, and college guidance", descriptionZh: "学业、个人与升学辅导", photo: "/images/staff/t-apana.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210700", group: "counseling", categories: ["counseling", "academics"] },
  { name: "C. Mann", role: "Counselor", roleZh: "学校辅导员", description: "Academic, personal, and college guidance", descriptionZh: "学业、个人与升学辅导", photo: "/images/staff/c-mann.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1812052", group: "counseling", categories: ["counseling", "academics"] },
  { name: "A. Rhodes", role: "Counselor, Outreach", roleZh: "辅导员／外展支持", description: "Counseling and outreach support", descriptionZh: "学生辅导与外展支持", photo: "/images/staff/a-rhodes.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210703", group: "counseling", categories: ["counseling", "student-life"] },
  { name: "T. Tongg", role: "Counselor", roleZh: "学校辅导员", description: "Academic, personal, and college guidance", descriptionZh: "学业、个人与升学辅导", photo: "/images/staff/t-tongg.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210702", group: "counseling", categories: ["counseling", "academics"] },
  { name: "S. Faildo-Lee", role: "Student Service Coordinator", roleZh: "学生服务协调员", description: "Student services and school support", descriptionZh: "学生事务与校内支持", photo: "/images/staff/s-faildo-lee.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210735", group: "support", categories: ["counseling", "student-life", "operations"] },
  { name: "N. Ishida", role: "Student Activities Coordinator", roleZh: "学生活动协调员", description: "Student activities, clubs, and events", descriptionZh: "学生活动、社团与校园活动", photo: "/images/staff/n-ishida.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210751", group: "support", categories: ["student-life"] },
  { name: "C. Morita", role: "Registrar", roleZh: "注册事务负责人", description: "Registration and student records", descriptionZh: "注册事务与学生档案", photo: "/images/staff/c-morita.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210785", group: "support", categories: ["operations", "academics"] },
  { name: "C. Shimoda", role: "Athletic Trainer", roleZh: "运动训练师", description: "Athletics health and exercise support", descriptionZh: "体育健康与运动支持", photo: "/images/staff/c-shimoda.jpg", profile: "https://www.moanaluahs.org/apps/pages/index.jsp?type=u&uREC_ID=1210809", group: "support", categories: ["student-life", "operations"] },
];

const filters: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All 所有" }, { value: "administration", label: "Administration 行政人员" },
  { value: "counseling", label: "Counseling 辅导支持" }, { value: "academics", label: "Academics 学术相关" },
  { value: "student-life", label: "Student Life 学生生活" }, { value: "operations", label: "Operations 运营支持" },
];
const groups: { value: Group; title: string }[] = [
  { value: "administration", title: "Administration 行政人员" },
  { value: "counseling", title: "School Counseling 学校辅导" },
  { value: "support", title: "Student & Support Staff 学生事务与支持人员" },
];

function ContactCard({ person }: { person: Person }) {
  return <article className="person-card">
    <img className="person-card__photo" src={person.photo} alt={`${person.name} — ${person.role}`} />
    <div className="person-card__content">
      <h3><span>{person.role}</span> <small>{person.roleZh}</small></h3><strong>{person.name}</strong>
      <p>{person.description}<br /><span>{person.descriptionZh}</span></p>
      <a className="person-card__email" href={person.profile} target="_blank" rel="noreferrer">Email via official profile<br /><span>通过官网发送邮件</span></a>
      <div className="person-card__actions"><a href={person.profile} target="_blank" rel="noreferrer">Official profile <span>官网资料</span></a><a href="tel:18083051000">(808) 305-1000</a></div>
    </div>
  </article>;
}

export default function PeopleDirectory() {
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState<"all" | Category>("all");
  const visible = useMemo(() => people.filter(person => (filter === "all" || person.categories.includes(filter)) && `${person.name} ${person.role} ${person.roleZh} ${person.description} ${person.descriptionZh}`.toLowerCase().includes(query.trim().toLowerCase())), [filter, query]);
  return <div className="people-page__container people-page__container--directory-only">
    <div className="people-directory-heading"><p>MOANALUA HIGH SCHOOL · OFFICIAL STAFF INFORMATION</p><h1>Find the Right Person <span>找到可以帮助你的人</span></h1><a href="https://www.moanaluahs.org/apps/staff/" target="_blank" rel="noreferrer">View complete school staff directory →</a></div>
    <section className="people-tools" aria-label="人员搜索与分类"><label><span aria-hidden="true">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name or role…　搜索姓名或职务…" type="search" /></label><div className="people-tools__filters">{filters.map(({ value, label }) => <button aria-pressed={filter === value} key={value} onClick={() => setFilter(value)} type="button">{label}</button>)}</div></section>
    {groups.map(group => { const members = visible.filter(person => person.group === group.value); return members.length ? <section className={`people-group people-group--${group.value}`} key={group.value}><h2><i aria-hidden="true" />{group.title}</h2><div className="people-grid">{members.map(person => <ContactCard person={person} key={person.name} />)}</div></section> : null; })}
    {!visible.length && <p className="people-page__empty">没有找到匹配的联系人。<small>No matching staff found.</small></p>}
    <section className="people-guide people-guide--compact"><div className="people-guide__table"><h2>Who Can I Talk To? <span>我该联系谁？</span></h2><ul>
      <li><strong>Academic Questions<br /><span>学业问题</span></strong><b>→</b><em>Your Counselor<br /><span>你的辅导员</span></em><p>Classes, grades, scheduling<br /><span>课程、成绩、选课安排</span></p></li>
      <li><strong>College &amp; Career<br /><span>升学与职业规划</span></strong><b>→</b><em>School Counselor<br /><span>学校辅导员</span></em><p>College applications and career advice<br /><span>大学申请与职业建议</span></p></li>
      <li><strong>Personal or Social Support<br /><span>个人或社交支持</span></strong><b>→</b><em>Any Counselor or VP<br /><span>任意辅导员或副校长</span></em><p>Emotional support, conflicts, peer issues<br /><span>情绪支持、冲突、同伴问题</span></p></li>
      <li><strong>Activities &amp; Athletics<br /><span>活动与体育</span></strong><b>→</b><em>Activities Coordinator / Athletic Staff<br /><span>活动协调员／体育工作人员</span></em><p>Clubs, sports, events<br /><span>社团、体育、活动</span></p></li>
      <li><strong>Registration &amp; Records<br /><span>注册与档案</span></strong><b>→</b><em>Registrar<br /><span>注册事务负责人</span></em><p>Enrollment and student records<br /><span>入学注册与学生档案</span></p></li>
    </ul></div></section>
    <p className="people-page__source">Information checked against the <a href="https://www.moanaluahs.org/apps/staff/" target="_blank" rel="noreferrer">Moanalua High School Staff Directory</a>. Direct email addresses are not publicly displayed; email links open each official profile.</p>
  </div>;
}
