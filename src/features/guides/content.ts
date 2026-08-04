export type Bilingual = {
  zh: string;
  en: string;
};

export type GuideItem = {
  id: string;
  title: Bilingual;
  body: Bilingual;
  scope: "general" | "moanalua";
  sourceUrl?: string;
  reviewedOn?: string;
};

export type GuideSection = {
  id: string;
  title: Bilingual;
  description: Bilingual;
  items: GuideItem[];
};

const reviewedOn = "2026-06-27";

export const guideSections: GuideSection[] = [
  {
    id: "grades-credits",
    title: { zh: "成绩、学分和毕业", en: "Grades, Credits, and Graduation" },
    description: {
      zh: "先看懂 GPA、credit、graduation requirement 和不同课程等级，很多迷茫会少一半。",
      en: "Start with GPA, credits, graduation requirements, and course levels. It makes the system less confusing.",
    },
    items: [
      {
        id: "gpa-credit",
        scope: "general",
        title: { zh: "GPA 和 credit 是什么？", en: "What are GPA and credits?" },
        body: {
          zh: "GPA 是成绩平均表现的一种计算方式；credit 是完成课程后获得的学分。不同学校会有自己的毕业要求，所以不要只听朋友说，要和 counselor 确认。",
          en: "GPA is one way schools summarize grades; credits are earned by completing courses. Graduation requirements can vary, so confirm your plan with a counselor.",
        },
      },
      {
        id: "course-levels",
        scope: "general",
        title: { zh: "Regular、Honors、AP 有什么区别？", en: "Regular, Honors, and AP courses" },
        body: {
          zh: "Regular 通常是标准课程，Honors 节奏更快，AP 是大学水平课程并可能有 AP exam。选课时要平衡挑战、语言适应和自己的压力。",
          en: "Regular classes are standard, Honors classes often move faster, and AP courses are college-level with optional AP exams. Balance challenge with adjustment and workload.",
        },
      },
      {
        id: "hid​​oe-grad",
        scope: "moanalua",
        title: { zh: "Hawaiʻi DOE 毕业要求要看官方页面", en: "Check official Hawaiʻi DOE graduation requirements" },
        body: {
          zh: "Moanalua High 属于 Hawaiʻi public school system。毕业要求和 credit 细节应以上线时 Hawaiʻi DOE 官方 graduation requirements 页面和 counselor 建议为准。",
          en: "Moanalua High is part of Hawaiʻi public schools. Graduation and credit details should be checked against the official Hawaiʻi DOE graduation requirements page and your counselor.",
        },
        sourceUrl: "https://www.hawaiipublicschools.org/TeachingAndLearning/StudentLearning/GraduationRequirements/Pages/home.aspx",
        reviewedOn,
      },
    ],
  },
  {
    id: "daily-school-life",
    title: { zh: "每天上学怎么运转", en: "Daily School Life" },
    description: {
      zh: "Schedule、attendance、tardy、lunch、locker、club 都是刚来时最容易卡住的小事。",
      en: "Schedules, attendance, tardies, lunch, lockers, and clubs are small things that can feel big at first.",
    },
    items: [
      {
        id: "attendance",
        scope: "general",
        title: { zh: "absence 和 tardy 要认真处理", en: "Take absences and tardies seriously" },
        body: {
          zh: "如果你缺席或迟到，通常需要按学校流程说明原因。不要因为害怕英语就不处理，可以请 counselor、office staff 或家人帮你确认。",
          en: "If you are absent or tardy, schools usually have a process for documenting it. If English feels hard, ask a counselor, office staff member, or family member for help.",
        },
      },
      {
        id: "clubs",
        scope: "general",
        title: { zh: "加入 club 是交朋友的低压力方式", en: "Clubs can be a lower-pressure way to meet people" },
        body: {
          zh: "你不需要一开始就认识很多人。先去一个自己有兴趣的 club，看一次也可以。固定出现几次，关系通常会自然一点。",
          en: "You do not need to know many people first. Visit a club that sounds interesting. Showing up a few times can make connection feel more natural.",
        },
      },
      {
        id: "moanalua-page",
        scope: "moanalua",
        title: { zh: "Moanalua-specific 信息要看学校官方页面", en: "Use official Moanalua pages for school-specific details" },
        body: {
          zh: "Bell schedule、办公室联系方式、具体活动和最新公告可能会变化。Bridge Forward 会把 Moanalua-specific 内容单独标注，并提醒你以学校官方页面为准。",
          en: "Bell schedules, office contacts, activities, and announcements can change. Bridge Forward labels Moanalua-specific details and points students back to official school pages.",
        },
        sourceUrl: "https://hawaiipublicschools.org/schools/moanalua-high/",
        reviewedOn,
      },
    ],
  },
  {
    id: "asking-for-help",
    title: { zh: "怎么开口求助", en: "How to Ask for Help" },
    description: {
      zh: "你不需要把问题讲得很完美。能说出第一句，就已经是在往前走。",
      en: "You do not need perfect English to ask for help. One clear first sentence is enough to start.",
    },
    items: [
      {
        id: "email-teacher",
        scope: "general",
        title: { zh: "给老师发 email 的简单格式", en: "A simple teacher email format" },
        body: {
          zh: "Subject 写课程和问题；开头问好；说明你是哪节课的学生；用一两句话说问题；最后 thank you。短而清楚比复杂更好。",
          en: "Use a subject with the class and issue, greet the teacher, say which class you are in, explain the question in one or two sentences, and end with thank you.",
        },
      },
      {
        id: "counselor-help",
        scope: "general",
        title: { zh: "什么时候找 counselor？", en: "When should I see a counselor?" },
        body: {
          zh: "选课、学分、大学方向、适应困难、被欺负、不知道找谁时，都可以先找 counselor。你可以说：I am new and I am not sure who to ask.",
          en: "You can see a counselor for courses, credits, college planning, adjustment, bullying, or when you do not know who to ask. Try: I am new and I am not sure who to ask.",
        },
      },
      {
        id: "hid​​oe-ap",
        scope: "moanalua",
        title: { zh: "AP 信息以学校和 College Board/DOE 说明为准", en: "Confirm AP details with school and official sources" },
        body: {
          zh: "AP 课程和考试安排可能因学校和年份不同而变化。选 AP 前建议确认课程要求、考试时间、费用和 counselor/teacher 建议。",
          en: "AP course and exam details can vary by school year. Before choosing AP, confirm course expectations, exam timing, costs, and counselor or teacher advice.",
        },
        sourceUrl: "https://www.hawaiipublicschools.org/TeachingAndLearning/StudentLearning/AdvancedPlacement/Pages/home.aspx",
        reviewedOn,
      },
    ],
  },
];

export const checklistItems = [
  {
    id: "know_counselor",
    label: { zh: "我知道我的 counselor 是谁", en: "I know who my counselor is" },
  },
  {
    id: "check_grades",
    label: { zh: "我知道怎么查成绩和 schedule", en: "I know how to check grades and my schedule" },
  },
  {
    id: "email_teacher",
    label: { zh: "我知道怎么给老师发 email", en: "I know how to email a teacher" },
  },
  {
    id: "understand_attendance",
    label: { zh: "我知道 absence/tardy 要怎么处理", en: "I understand what to do about absence or tardy" },
  },
  {
    id: "explore_club",
    label: { zh: "我至少看过一个 club 或 activity", en: "I have explored at least one club or activity" },
  },
  {
    id: "know_help_routes",
    label: { zh: "我知道遇到困难可以找谁", en: "I know where to go when I need help" },
  },
] as const;
