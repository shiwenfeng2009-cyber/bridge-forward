"use client";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { searchItems } from "./search-data";
const normalize=(value:string)=>value.trim().toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu," ").replace(/\s+/g," ");
export function InlineSiteSearch({className,id,placeholder}:{className:string;id:string;placeholder:string}){
  const [query,setQuery]=useState(""); const [active,setActive]=useState(false);
  const results=useMemo(()=>{const value=normalize(query);if(!value)return[];const tokens=value.split(" ").filter(Boolean);return searchItems.filter(item=>{const content=normalize([item.title,item.zh,item.type,item.body,...item.keywords].join(" "));return content.includes(value)||tokens.every(token=>content.includes(token));}).slice(0,6)},[query]);
  function submit(event:FormEvent){event.preventDefault();setActive(true)}
  const show=active&&query.trim().length>0;
  return <div className="inline-search-wrap"><form className={className} onSubmit={submit} role="search"><label className="sr-only" htmlFor={id}>Search completed Bridge Forward content</label><span aria-hidden="true">⌕</span><input id={id} value={query} onChange={event=>{setQuery(event.target.value);setActive(true)}} placeholder={placeholder} type="search" autoComplete="off"/><button type="submit">搜索 <small>Search</small></button></form>{show?<section className="inline-search-results" aria-live="polite"><header><strong>{results.length?`${results.length} results`:"No search results"}</strong><span>{results.length?"找到以下网站内容":"没有搜索结果，请尝试其他关键词"}</span></header>{results.map(item=><Link href={item.href} key={item.id}><span>{item.type}</span><strong>{item.title}</strong><small>{item.zh}</small><p>{item.body}</p></Link>)}</section>:null}</div>
}
