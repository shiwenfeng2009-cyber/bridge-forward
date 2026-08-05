"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import translations from "./generated-translations.json";
import type { LanguageMode } from "./types";

type Dictionary = Record<string, string>;
const dictionaries = translations as Record<LanguageMode, Dictionary>;

function translateKnown(value: string, mode: LanguageMode) {
  if (mode === "zh") return value;
  let output = value;
  for (const source of Object.keys(dictionaries[mode]).sort((a,b)=>b.length-a.length)) {
    if (output.includes(source)) output = output.replaceAll(source, dictionaries[mode][source]);
  }
  return output;
}

type LanguageContextValue = {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
  translateDynamic: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<LanguageMode>("zh");
  const originals = useRef(new WeakMap<Text, string>());
  const cache = useRef(new Map<string,string>());

  useEffect(() => {
    const saved = window.localStorage.getItem("bridge-secondary-language") as LanguageMode | null;
    if (saved === "zh" || saved === "ja" || saved === "ko" || saved === "fil") setModeState(saved);
  }, []);

  function setMode(next: LanguageMode) {
    setModeState(next);
    window.localStorage.setItem("bridge-secondary-language", next);
  }

  const translateDynamic = useCallback(async (text: string) => {
    if (mode === "zh" || !/[\u3400-\u9fff]/.test(text)) return text;
    const known = translateKnown(text, mode);
    if (!/[\u3400-\u9fff]/.test(known)) return known;
    const key = `${mode}:${text}`;
    if (cache.current.has(key)) return cache.current.get(key)!;
    try {
      const response = await fetch("/api/translate", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({texts:[text],target:mode}) });
      if (!response.ok) return known;
      const data = await response.json() as {translations?:string[]};
      const result = data.translations?.[0] || known;
      cache.current.set(key,result);
      return result;
    } catch { return known; }
  }, [mode]);

  useEffect(() => {
    document.documentElement.dataset.secondaryLanguage = mode;
    document.documentElement.lang = mode === "zh" ? "zh-CN" : mode;
    let cancelled = false;
    async function translateRoot(root: ParentNode) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      await Promise.all(nodes.map(async (node) => {
        const parent=node.parentElement;
        if(!parent||parent.closest("script,style,[data-no-translate]")||!/[㐀-鿿]/.test(originals.current.get(node)??node.data))return;
        if(!originals.current.has(node))originals.current.set(node,node.data);
        const source=originals.current.get(node)!;
        const next=mode==="zh"?source:await translateDynamic(source);
        if(!cancelled&&node.isConnected)node.data=next;
      }));
      await Promise.all(Array.from(root.querySelectorAll?.("input[placeholder],textarea[placeholder]")??[]).map(async element=>{
        const field=element as HTMLInputElement; const original=field.dataset.originalPlaceholder??field.placeholder;
        field.dataset.originalPlaceholder=original; field.placeholder=mode==="zh"?original:await translateDynamic(original);
      }));
    }
    translateRoot(document.body);
    const observer=new MutationObserver(records=>{for(const record of records)for(const node of Array.from(record.addedNodes))if(node.nodeType===Node.ELEMENT_NODE)translateRoot(node as Element);else if(node.nodeType===Node.TEXT_NODE&&node.parentElement)translateRoot(node.parentElement)});
    observer.observe(document.body,{childList:true,subtree:true});
    return()=>{cancelled=true;observer.disconnect()};
  },[mode,translateDynamic]);

  return <LanguageContext.Provider value={{mode,setMode,translateDynamic}}>{children}</LanguageContext.Provider>;
}

export function useLanguage(){const context=useContext(LanguageContext);if(!context)throw new Error("useLanguage must be used within a LanguageProvider");return context;}
