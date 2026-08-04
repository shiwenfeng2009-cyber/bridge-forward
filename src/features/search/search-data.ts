export type SearchItem = {
  id: string;
  title: string;
  zh: string;
  type: "School" | "Ask" | "Stories" | "Journal" | "Resources";
  href: string;
  body: string;
  keywords: string[];
};

export const searchItems: SearchItem[] = [
  {
    id: "school-home",
    title: "School Information",
    zh: "学校信息",
    type: "School",
    href: "/school-information",
    body: "GPA, credits, graduation requirements, attendance, tardy rules, counselor, clubs, Moanalua schedule, and campus map.",
    keywords: ["school", "rules", "gpa", "credit", "graduation", "attendance", "tardy", "counselor", "club", "学校", "规则"],
  },
  {
    id: "moanalua-map",
    title: "Moanalua Campus Map",
    zh: "Moanalua 校园地图",
    type: "School",
    href: "/school-information?topic=map",
    body: "Find the official campus map and a simple way to think about where to go first.",
    keywords: ["map", "campus", "lost", "building", "room", "地图", "迷路", "教室"],
  },
  {
    id: "bell-schedule",
    title: "Bell Schedules and A-B-C Calendar",
    zh: "铃声时间表与 A-B-C 日历",
    type: "School",
    href: "/school-information?topic=schedule",
    body: "Use the official Bell Schedules and A-B-C Calendar to check what kind of school day it is.",
    keywords: ["schedule", "bell", "calendar", "abc", "period", "late start", "时间表", "课表"],
  },
  {
    id: "education-system",
    title: "U.S. High School Basics",
    zh: "美国高中基本规则",
    type: "School",
    href: "/school-information?topic=us-system",
    body: "Understand GPA, credits, graduation requirements, AP, Honors, regular classes, semester grades, and final grades.",
    keywords: ["gpa", "credit", "ap", "honors", "regular", "semester", "final grade", "美国高中"],
  },
  {
    id: "ask-questions",
    title: "Ask Questions",
    zh: "论坛提问",
    type: "Ask",
    href: "/ask/questions",
    body: "A forum-style space to ask about lunch, English confidence, clubs, school culture, or confusing situations.",
    keywords: ["ask", "question", "forum", "lunch", "friends", "english", "club", "提问", "朋友", "午餐"],
  },
  {
    id: "stories",
    title: "Student Stories",
    zh: "学生故事",
    type: "Stories",
    href: "/ask/stories",
    body: "Read student stories by title, including first lunch alone, speaking in class, finding a friend, and what students wish they knew.",
    keywords: ["story", "stories", "lonely", "lunch", "friend", "share", "故事", "孤独"],
  },
  {
    id: "journal",
    title: "Private Reflection Journal",
    zh: "私人心情日记",
    type: "Journal",
    href: "/ask/reflection",
    body: "A private notebook-style reflection corner. It is for self-reflection only and does not provide diagnosis or treatment.",
    keywords: ["journal", "reflection", "mood", "diary", "private", "anxious", "lonely", "日记", "心情"],
  },
  {
    id: "resources",
    title: "Get Help Resources",
    zh: "需要帮助时",
    type: "Resources",
    href: "/resources",
    body: "Peer support cannot replace professional help. Find trusted adults, school counselor/staff, 988, and emergency guidance.",
    keywords: ["help", "988", "counselor", "trusted adult", "resources", "帮助", "辅导员"],
  },
];

export const suggestedSearches = ["map", "schedule", "GPA", "lunch", "counselor", "stories"] as const;
