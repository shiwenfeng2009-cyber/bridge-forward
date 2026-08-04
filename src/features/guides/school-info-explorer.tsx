"use client";

import { useMemo, useState } from "react";

type SchoolTopic = {
  id: string;
  label: string;
  zh: string;
  icon: string;
  summary: string;
  cards: Array<{
    title: string;
    zh: string;
    body: string;
    source?: {
      label: string;
      href: string;
    };
  }>;
};

const officialLinks = {
  bell: "https://www.moanaluahs.org/apps/bell_schedules/",
  abc: "https://www.moanaluahs.org/apps/pages/index.jsp?pREC_ID=791766&type=d&uREC_ID=432813",
  map: "https://www.moanaluahs.org/apps/pages/index.jsp?type=d&uREC_ID=472266",
  attendance: "https://www.moanaluahs.org/apps/pages/index.jsp?pREC_ID=792147&type=d&uREC_ID=434925",
  expectations: "https://www.moanaluahs.org/pdf/Student%20Expectations%201617.pdf",
  newStudents: "https://www.moanaluahs.org/apps/pages/index.jsp?type=d&uREC_ID=466382",
};

const schoolTopics: SchoolTopic[] = [
  {
    id: "us-system",
    label: "U.S. High School Basics",
    zh: "美国高中基本规则",
    icon: "✎",
    summary: "Understand the words adults use all the time: GPA, credits, graduation, AP, Honors, semester grade.",
    cards: [
      {
        title: "GPA and credits",
        zh: "GPA 和 credit 是什么",
        body: "GPA is your grade average. Credits are units you earn by passing classes. Graduation requirements are usually counted by credits and required subjects.",
      },
      {
        title: "AP / Honors / Regular",
        zh: "AP、Honors、Regular 的区别",
        body: "Regular classes are standard level. Honors classes usually move faster. AP classes are college-level and may have an AP exam. Choose difficulty with your counselor, not from pressure alone.",
      },
      {
        title: "Semester and final grades",
        zh: "Semester grade 和 final grade",
        body: "A semester grade usually summarizes one half of the school year. Some classes also have final exams or projects. Always check the teacher syllabus.",
      },
    ],
  },
  {
    id: "schedule",
    label: "Moanalua Schedule",
    zh: "Moanalua 课表",
    icon: "⌚",
    summary: "Use the official Bell Schedules and A-B-C Calendar together. The calendar tells you the day type; the bell schedule tells you times.",
    cards: [
      {
        title: "Bell Schedules",
        zh: "铃声时间表",
        body: "Moanalua posts multiple day schedules. For example, A1/A2/A3 days start at 8:30 AM and include recess, lunch, classes, and tutorial or meeting time depending on the day.",
        source: { label: "Official Bell Schedules", href: officialLinks.bell },
      },
      {
        title: "A-B-C Calendar",
        zh: "A-B-C 日历",
        body: "Check the A-B-C Calendar first because it tells you what schedule week/day to follow. The official page notes calendars can change.",
        source: { label: "Official A-B-C Calendar", href: officialLinks.abc },
      },
      {
        title: "Quick habit",
        zh: "每天早上先确认",
        body: "Before school, check the day type, your first class, lunch time, and whether there is tutorial, HR, CAP, or meeting time.",
      },
    ],
  },
  {
    id: "map",
    label: "Map & Getting Around",
    zh: "地图与找路",
    icon: "⌂",
    summary: "New students get lost. That is normal. Start with the office, counselor, cafeteria, library, and your first classroom.",
    cards: [
      {
        title: "Campus Map",
        zh: "校园地图",
        body: "Moanalua has an official campus map page with an attached map and ADA restroom list. Keep it bookmarked during your first month.",
        source: { label: "Official Campus Map", href: officialLinks.map },
      },
      {
        title: "New student welcome",
        zh: "新生欢迎页",
        body: "The official welcome page reminds new students there are many clubs, activities, and sports, and points students to tours, schedules, maps, and links.",
        source: { label: "Official New Students page", href: officialLinks.newStudents },
      },
      {
        title: "If you are lost",
        zh: "如果迷路了",
        body: "Ask a teacher, office staff, security, or another student: “Excuse me, where is ___?” Most people will simply point you in the right direction.",
      },
    ],
  },
  {
    id: "rules-life",
    label: "Rules & Daily Life",
    zh: "规则与校园生活",
    icon: "☘",
    summary: "Attendance, tardies, phone expectations, passes, clubs, lunch, and who to contact when something feels unclear.",
    cards: [
      {
        title: "Attendance Office",
        zh: "缺勤和迟到",
        body: "The Attendance Office is on the mauka side of the Administration Building. The official page explains absence reporting, tardy slips, early release, and the attendance phone number.",
        source: { label: "Official Attendance Office", href: officialLinks.attendance },
      },
      {
        title: "Student Expectations",
        zh: "学生规则",
        body: "Moanalua’s Student Expectations PDF covers dress code, phone use, field trips, tardies, absences, passes, off-limits areas, classroom expectations, and parking.",
        source: { label: "Official Student Expectations PDF", href: officialLinks.expectations },
      },
      {
        title: "Clubs and belonging",
        zh: "社团和归属感",
        body: "If making friends feels hard, clubs are one of the easiest structured ways to see the same people repeatedly without forcing a conversation from nothing.",
      },
    ],
  },
];

const scheduleRows = [
  ["A1 sample", "P1 · P2 · P3 · Lunch · P6 · P7 · Tutorial"],
  ["A2 sample", "P1 · P2 · P4 · Lunch · HR · P5 · Meeting"],
  ["A3 sample", "P3 · P4 · P5 · Lunch · P6 · P7 · Tutorial"],
  ["B/C sample", "Longer periods, recess, lunch, and meeting/tutorial/HR depending on the day"],
] as const;

export function SchoolInfoExplorer() {
  const [activeTopicId, setActiveTopicId] = useState("schedule");
  const activeTopic = useMemo(
    () => schoolTopics.find((topic) => topic.id === activeTopicId) ?? schoolTopics[0],
    [activeTopicId],
  );

  return (
    <section className="school-explorer" aria-labelledby="school-explorer-heading">
      <div className="school-explorer__intro">
        <p className="eyebrow">Click a category / 点一个分类</p>
        <h2 id="school-explorer-heading">先分类，再看具体信息</h2>
        <p>
          This page is built like a school starter kit: choose a big topic first, then open details and official sources.
          这样不会一下子被太多信息淹没。
        </p>
      </div>

      <div className="school-topic-tabs" role="tablist" aria-label="School information categories">
        {schoolTopics.map((topic) => (
          <button
            aria-controls={`school-panel-${topic.id}`}
            aria-selected={activeTopic.id === topic.id}
            id={`school-tab-${topic.id}`}
            key={topic.id}
            onClick={() => setActiveTopicId(topic.id)}
            role="tab"
            type="button"
          >
            <span aria-hidden="true">{topic.icon}</span>
            <strong>{topic.label}</strong>
            <small>{topic.zh}</small>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`school-tab-${activeTopic.id}`}
        className="school-topic-panel"
        id={`school-panel-${activeTopic.id}`}
        role="tabpanel"
      >
        <div className="school-topic-panel__header">
          <span className="school-topic-panel__icon" aria-hidden="true">
            {activeTopic.icon}
          </span>
          <div>
            <h3>{activeTopic.label}</h3>
            <strong>{activeTopic.zh}</strong>
            <p>{activeTopic.summary}</p>
          </div>
        </div>

        {activeTopic.id === "schedule" ? (
          <div className="schedule-card" aria-label="Moanalua schedule helper">
            <div>
              <h4>Moanalua schedule helper</h4>
              <p>Use this as a simple orientation. Always confirm the exact day on the official pages.</p>
            </div>
            <div className="schedule-mini-table">
              {scheduleRows.map(([day, periods]) => (
                <div key={day}>
                  <strong>{day}</strong>
                  <span>{periods}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {activeTopic.id === "map" ? (
          <div className="campus-map-card" aria-label="Campus map preview">
            <div className="campus-map-card__art" aria-hidden="true">
              <span className="map-building map-building--office">Office</span>
              <span className="map-building map-building--library">Library</span>
              <span className="map-building map-building--cafeteria">Cafeteria</span>
              <span className="map-path" />
            </div>
            <p>
              Mini map idea: mark your first classroom, lunch place, bathroom, and counselor/office. The official map is linked below.
            </p>
          </div>
        ) : null}

        <div className="school-topic-card-grid">
          {activeTopic.cards.map((card) => (
            <article className="school-topic-card" key={card.title}>
              <h4>{card.title}</h4>
              <strong>{card.zh}</strong>
              <p>{card.body}</p>
              {card.source ? (
                <a href={card.source.href} rel="noreferrer" target="_blank">
                  {card.source.label} →
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
