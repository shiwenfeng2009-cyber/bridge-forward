"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/language-context";

const moods = ["Happy 开心", "Sad 难过", "Stressed 压力", "Lonely 孤独", "Homesick 想家", "Angry 生气", "Tired 疲惫", "Grateful 感恩", "Anxious 焦虑", "Other 其他"];
const stories = [
  {icon:"♡", title:"The First Day I Felt Out of Place", zh:"第一天，我感觉格格不入", excerpt:"Moving to a new country was exciting, but the first week was really hard...", grade:"Grade 10", time:"3 days ago", views:56, body:"At lunch I didn’t know where to sit, and every conversation felt too fast. A student in biology smiled and invited me to join their table. I learned that belonging can begin with one small hello."},
  {icon:"☺", title:"How I Made My First Friend", zh:"我是怎样交到第一个朋友的", excerpt:"It all started with a simple ‘Hi’ in biology class...", grade:"Grade 11", time:"1 week ago", views:72, body:"I practiced one sentence before class: ‘Can I sit here?’ It felt small, but it opened a real conversation. We now study together after school."},
  {icon:"☆", title:"When Grades Didn’t Go as Planned", zh:"当成绩没有达到预期", excerpt:"I felt like I was failing at everything, but then I learned...", grade:"Grade 12", time:"2 weeks ago", views:68, body:"A lower grade did not mean I did not belong. My teacher helped me make a weekly plan, and I started asking questions before I felt completely stuck."},
  {icon:"☵", title:"I Miss Home, But I’m Trying", zh:"我很想家，但我仍在努力", excerpt:"Some nights I just want to go back, but I keep reminding myself...", grade:"Grade 9", time:"3 weeks ago", views:65, body:"I made a small routine: call home, write one memory, then name one new thing I am curious about here. Missing home and building a new home can both be true."}
];

export default function MentalWellnessExperience(){
  const router=useRouter();
  const {mode:languageMode,translateDynamic}=useLanguage();
  const [mode,setMode]=useState<"anonymous"|"private">("anonymous");
  const [entry,setEntry]=useState(""); const [mood,setMood]=useState(""); const [status,setStatus]=useState("");
  const [lights,setLights]=useState(0); const [query,setQuery]=useState(""); const [open,setOpen]=useState<number|null>(null);
  const [storyFilter,setStoryFilter]=useState("All"); const [showLights,setShowLights]=useState(false); const [sharedStories,setSharedStories]=useState<typeof stories>([]);
  const [translatedEntry,setTranslatedEntry]=useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrate the user's local-only journal after mount.
  useEffect(()=>{ const saved=localStorage.getItem("bridge-private-diary"); if(saved) setEntry(saved); const n=localStorage.getItem("bridge-lights"); if(n) setLights(Number(n)); try{const raw=localStorage.getItem("bridge-anonymous-stories");if(raw)setSharedStories(JSON.parse(raw));}catch{} },[]);
  const allStories=useMemo(()=>[...sharedStories,...stories],[sharedStories]);
  const anonymousLights=sharedStories;
  const visible=useMemo(()=>allStories.filter(s=>(storyFilter==="All"||s.grade===storyFilter)&&(s.title+s.zh+s.excerpt+s.body).toLowerCase().includes(query.toLowerCase())),[allStories,query,storyFilter]);
  useEffect(()=>{let active=true;const timer=window.setTimeout(async()=>{if(languageMode==="zh"||!entry.trim()){if(active)setTranslatedEntry("");return;}const translated=await translateDynamic(entry);if(active)setTranslatedEntry(translated)},450);return()=>{active=false;window.clearTimeout(timer)}},[entry,languageMode,translateDynamic]);
  function submit(){ if(!entry.trim()){setStatus("Write a few words first. 请先写下一点感受。");return;} if(mode==="private"){localStorage.setItem("bridge-private-diary",entry);setStatus("Saved privately on this device. 已私密保存在此设备。") } else {const next=lights+1;const item={icon:"✦",title:"A New Anonymous Light",zh:"一束新的匿名心声",excerpt:entry.slice(0,110)+(entry.length>110?"…":""),grade:"Anonymous",time:"Just now",views:0,body:entry};const updated=[item,...sharedStories];setSharedStories(updated);localStorage.setItem("bridge-anonymous-stories",JSON.stringify(updated));setLights(next);localStorage.setItem("bridge-lights",String(next));setEntry("");setStatus("Your light has been shared anonymously. 你的一束光已匿名留下。");setShowLights(true)}}
  return <main className="mental-page">
    <div className="mental-shell">
      <button className="mental-back" type="button" onClick={()=>window.history.length>1?router.back():router.push("/")}>← Back · 返回上一页</button>
      <section className="mental-hero" aria-label="A peaceful diary beside the Honolulu shoreline">
        <img src="/images/mental-wellness-diary-hero.png" alt="Open diary beside a calm Honolulu shoreline" />
        <div className="mental-diary-copy"><strong>Dear Diary,</strong><span>How are you feeling today?</span></div>
      </section>
      <section className="mental-compose-grid">
        <div className="mental-compose-card">
          <div className="mental-tabs"><button className={mode==="anonymous"?"active":""} onClick={()=>setMode("anonymous")}>✎ Write Anonymously<br/><span>匿名书写</span></button><button className={mode==="private"?"active":""} onClick={()=>setMode("private")}>▣ Save Privately<br/><span>私密保存</span></button></div>
          <label className="sr-only" htmlFor="diary-entry">Diary entry</label><textarea id="diary-entry" maxLength={1000} value={entry} onChange={e=>setEntry(e.target.value)} placeholder="How are you feeling today? 你今天感觉怎么样？"/><small className="mental-count">{entry.length}/1000</small>{translatedEntry&&translatedEntry!==entry?<div className="diary-translation"><strong>Translation · 翻译</strong><p>{translatedEntry}</p></div>:null}
          <h2>How are you feeling? <span>你现在感觉如何？</span></h2><div className="mood-grid">{moods.map(m=><button key={m} className={mood===m?"active":""} onClick={()=>setMood(m)}>○ {m}</button>)}</div>
          <button className="mental-submit" onClick={submit}>{mode==="private"?"Save Privately 私密保存":"Share Anonymously 匿名分享"} ↗</button><p className="mental-status" role="status">{status||"Your words may be a light for someone else. 你的话语，可能会成为别人的光。"}</p>
        </div>
        <button className="light-card" type="button" onClick={()=>setShowLights(true)} aria-haspopup="dialog"><h2>✦ Leave a Light ✦</h2><p>Every time you share, a star will light up in the sky.</p><strong>{lights.toLocaleString()}</strong><b>lights have been left here.</b><span>已经有 {lights.toLocaleString()} 位同学在这里留下了一束光。</span><small>Read anonymous stories · 查看匿名故事 →</small><div className="light-coast" aria-hidden="true"/></button>
      </section>
      <section className="stories-panel" id="anonymous-stories"><header><h2>🌿 Stories <span>同伴故事</span></h2><p>Read anonymous stories from students. You might find you are not alone.<br/>阅读他人的故事，也许你会发现，你并不孤单。</p></header><div className="story-tools"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search stories by keyword or topic... 搜索故事"/><select aria-label="Filter stories" value={storyFilter} onChange={e=>setStoryFilter(e.target.value)}><option>All</option><option>Anonymous</option><option>Grade 9</option><option>Grade 10</option><option>Grade 11</option><option>Grade 12</option></select></div><div className="story-list">{visible.map((s,i)=><article key={`${s.title}-${i}`} className={open===i?"open":""}><button onClick={()=>setOpen(open===i?null:i)}><span className="story-icon">{s.icon}</span><span className="story-main"><strong>{s.title}</strong><em>{s.zh}</em><small>{s.excerpt}</small></span><span className="story-meta">{s.grade}　•　{s.time}　◉ {s.views}</span><b>›</b></button>{open===i&&<p>{s.body}<br/><span>这是一段匿名同伴故事；你并不需要独自面对。</span></p>}</article>)}</div>{visible.length===0&&<p className="mental-empty">No matching stories · 没有符合筛选条件的故事</p>}</section>
      {showLights&&<div className="light-dialog" role="dialog" aria-modal="true" aria-label="Anonymous stories" onClick={()=>setShowLights(false)}><section onClick={e=>e.stopPropagation()}><button className="light-dialog__close" onClick={()=>setShowLights(false)} aria-label="Close">×</button><h2>✦ Anonymous Lights <span>匿名心声</span></h2><p>Shared without names, so no one has to feel alone.</p>{anonymousLights.length===0?<div className="light-dialog__empty"><strong>No anonymous lights yet.</strong><span>这里暂时还没有心声。第一条会在有人匿名发布后出现。</span></div>:<div>{anonymousLights.map((s,i)=><button key={`${s.title}-light-${i}`} onClick={()=>{setShowLights(false);setOpen(i);document.getElementById("anonymous-stories")?.scrollIntoView({behavior:"smooth"})}}><strong>{s.title}</strong><span>{s.excerpt}</span><small>{s.time}　›</small></button>)}</div>}</section></div>}
      <section className="need-panel"><h2>Need Someone? <span>你很重要，支持一直都在。 ♥</span></h2><div className="need-grid"><Link href="/school-information/people"><b>Counselor</b><span>辅导员</span><p>Talk to a school counselor about anything.</p><i>专业、保密的支持 →</i></Link><Link href="/school-information/people"><b>Peer Mentor</b><span>同伴导师</span><p>Connect with upperclass students.</p><i>倾听与理解 →</i></Link><Link href="/school-information"><b>Wellness Room</b><span>心灵空间</span><p>A quiet place to relax, reset, and breathe.</p><i>放松身心 →</i></Link><Link href="/school-information/people"><b>Trusted Teacher</b><span>信任的老师</span><p>Reach out to a teacher you feel comfortable with.</p><i>找一位信任的老师 →</i></Link></div></section>
      <footer className="mental-footer"><span>Be gentle with yourself.<br/>You are doing better than you think. ♡</span></footer>
    </div>
  </main>
}
