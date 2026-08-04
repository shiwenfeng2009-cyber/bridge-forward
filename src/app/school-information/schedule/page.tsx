import BackToInformation from "../BackToInformation";

type Schedule = {
  day: string;
  code: string;
  tone: string;
  periods: [string, string][];
};

const bellSchedules: Schedule[] = [
  { day: "Monday", code: "A1 Day", tone: "blue", periods: [["8:30–9:30", "Pd. 1"], ["9:30–9:45", "Recess"], ["9:50–10:56", "Pd. 2"], ["11:02–12:02", "Pd. 3"], ["12:02–12:35", "Lunch"], ["12:40–1:40", "Pd. 6"], ["1:46–2:46", "Pd. 7"], ["2:51–3:25", "Tutorial"]] },
  { day: "Tuesday", code: "A2 Day", tone: "green", periods: [["8:30–9:30", "Pd. 1"], ["9:30–9:45", "Recess"], ["9:50–10:56", "Pd. 2"], ["11:02–12:02", "Pd. 4"], ["12:02–12:35", "Lunch"], ["12:40–1:05", "HR"], ["1:11–2:11", "Pd. 5"], ["2:51–3:25", "Tutorial"]] },
  { day: "Wednesday", code: "A3 Day", tone: "yellow", periods: [["8:30–9:30", "Pd. 3"], ["9:30–9:45", "Recess"], ["9:50–10:56", "Pd. 4"], ["11:02–12:02", "Pd. 5"], ["12:02–12:35", "Lunch"], ["12:40–1:40", "Pd. 6"], ["1:46–2:46", "Pd. 7"], ["2:51–3:25", "Tutorial"]] },
  { day: "Thursday", code: "B1 Day", tone: "pink", periods: [["8:30–9:45", "Pd. 1"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 2"], ["11:32–12:03", "CAP"], ["12:03–12:36", "Lunch"], ["12:41–1:56", "Pd. 3"]] },
  { day: "Friday", code: "B2 Day", tone: "purple", periods: [["8:30–9:45", "Pd. 4"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 5"], ["11:26–11:59", "Lunch"], ["12:04–1:19", "Pd. 6"], ["1:25–2:40", "Pd. 7"]] },
];

const cWeekSchedules: Schedule[] = [
  { day: "C1 Day", code: "", tone: "blue", periods: [["8:30–9:45", "Pd. 1"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 2"], ["11:32–11:57", "HR"], ["11:57–12:30", "Lunch"], ["12:35–1:50", "Pd. 3"]] },
  { day: "C2 Day", code: "", tone: "green", periods: [["8:30–9:45", "Pd. 4"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 5"], ["11:26–11:59", "Lunch"], ["12:04–1:19", "Pd. 6"], ["1:25–2:40", "Pd. 7"]] },
  { day: "C3 Day", code: "", tone: "yellow", periods: [["8:30–9:45", "Pd. 1"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 2"], ["11:32–12:03", "CAP"], ["12:03–12:36", "Lunch"], ["12:41–1:56", "Pd. 3"], ["2:01–3:05", "Tutorial"]] },
  { day: "C4 / B2 Day", code: "", tone: "pink", periods: [["8:30–9:45", "Pd. 4"], ["9:45–10:00", "Recess"], ["10:05–11:26", "Pd. 5"], ["11:26–11:59", "Lunch"], ["12:04–1:19", "Pd. 6"], ["1:25–2:40", "Pd. 7"]] },
];

const importantDates = [
  ["Aug 21, 2026", "Statehood Day 州日"], ["Sep 7, 2026", "Labor Day 劳动节"], ["Oct 5–9, 2026", "Fall Break 秋假"], ["Nov 3, 2026", "Election Day 选举日"], ["Nov 11, 2026", "Veterans Day 退伍军人节"],
  ["Nov 26, 2026", "Thanksgiving Day 感恩节"], ["Nov 27, 2026", "School Holiday 学校假日"], ["Dec 21, 2026–Jan 1, 2027", "Winter Break 冬假"], ["Dec 25, 2026", "Christmas Day 圣诞节"], ["Jan 1, 2027", "New Year’s Day 元旦"],
  ["Jan 4, 2027", "Teacher Work Day 教师工作日"], ["Jan 18, 2027", "Dr. Martin Luther King Jr. Day"], ["Feb 15, 2027", "Presidents’ Day 总统日"], ["Mar 15–19, 2027", "Spring Break 春假"], ["Mar 26, 2027", "Good Friday 耶稣受难日"], ["Mar 29, 2027", "Prince Jonah Kūhiō Day"], ["May 27, 2027", "Last Day for Students 学生最后一天"], ["May 28, 2027", "Last Day for Teachers 教师最后一天"], ["May 31, 2027", "Memorial Day 阵亡将士纪念日"],
] as const;

const monthNames = ["AUGUST 八月", "SEPTEMBER 九月", "OCTOBER 十月", "NOVEMBER 十一月"];
const monthIndexes = [7, 8, 9, 10];

function Month({ month, title }: { month: number; title: string }) {
  const firstDay = new Date(2026, month, 1).getDay();
  const days = new Date(2026, month + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - firstDay + 1;
    return day > 0 && day <= days ? day : null;
  });

  const toneFor = (day: number) => {
    if ((month === 7 && day === 21) || (month === 8 && day === 7) || (month === 10 && day === 3)) return "holiday";
    if ((month === 8 && day >= 21 && day <= 24) || (month === 9 && day === 1) || (month === 10 && (day === 26 || day === 27))) return "exam";
    if (month === 9 && day >= 5 && day <= 9) return "special";
    if (month === 7 && day === 3) return "work";
    return "";
  };

  return (
    <article className="schedule-web__month">
      <h3>{title}</h3>
      <div className="schedule-web__weekdays">{["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      <div className="schedule-web__days">
        {cells.map((day, index) => <span className={day ? toneFor(day) : ""} key={index}>{day ?? ""}</span>)}
      </div>
    </article>
  );
}

function ScheduleCard({ schedule }: { schedule: Schedule }) {
  return (
    <article className={`schedule-web__day schedule-web__day--${schedule.tone}`}>
      <header><strong>{schedule.day}</strong>{schedule.code && <span>{schedule.code}</span>}</header>
      <dl>{schedule.periods.map(([time, period]) => <div key={`${time}-${period}`}><dt>{time}</dt><dd>{period}</dd></div>)}</dl>
    </article>
  );
}

export default function ClassSchedulePage() {
  return (
    <main className="schedule-detail-page schedule-web">
      <BackToInformation className="schedule-detail-page__back-button" />
      <div className="schedule-web__container">
        <section className="schedule-web__hero">
          <div><p>校园指南 · SCHOOL GUIDE</p><h1>课程与时间表</h1><strong>Class &amp; Schedule</strong><span>清晰掌握每天的课程和重要时间。</span><small>Your daily guide to classes, periods, and important dates.</small></div>
          <aside><h2>如何判断本周是 A、B 还是 C Week？</h2><p>学校采用 A/B/C 轮换制，请查看下方日历确认本周安排。</p><div><b>A Week</b><span>A1</span><span>A2</span><span>A3</span></div><div><b>B Week</b><span>B1</span><span>B2</span></div><div><b>C Week</b><span>C1</span><span>C2</span><span>C3</span><span>C4</span></div></aside>
        </section>

        <section className="schedule-web__section"><h2>每日时间表 <small>Bell Schedules</small></h2><div className="schedule-web__grid schedule-web__grid--five">{bellSchedules.map(schedule => <ScheduleCard key={schedule.day} schedule={schedule} />)}</div></section>
        <section className="schedule-web__section"><h2>C 周时间表 <small>“C” Week Schedules</small></h2><div className="schedule-web__grid schedule-web__grid--four">{cWeekSchedules.map(schedule => <ScheduleCard key={schedule.day} schedule={schedule} />)}</div></section>
        <section className="schedule-web__section"><h2>A/B/C 日历 — 第一学期 <small>A/B/C Calendar — Semester 1</small></h2><div className="schedule-web__legend"><span className="exam">考试周</span><span className="holiday">假期</span><span className="special">特别安排</span><span className="work">教师工作日</span></div><div className="schedule-web__months">{monthIndexes.map((month, index) => <Month key={month} month={month} title={monthNames[index]} />)}</div></section>
        <section className="schedule-web__section"><h2>重要日期 <small>Important Dates · 2026–2027 School Year</small></h2><div className="schedule-web__dates">{importantDates.map(([date, event]) => <div key={`${date}-${event}`}><strong>{date}</strong><span>{event}</span></div>)}</div></section>
        <p className="schedule-web__tip">每周查看一次，掌握课程与重要日期。<small>Check this page weekly to stay on track.</small></p>
      </div>
    </main>
  );
}
