"use client";

import { createContext, useContext, useEffect, useState } from "react";

import type { LanguageMode } from "./types";

const JA: Record<string, string> = {
  "首页": "ホーム", "登录": "ログイン", "创建账号": "アカウント作成", "返回上一页": "前のページへ",
  "学校信息": "学校情報", "校园地图": "校内地図", "课程与时间表": "授業と時間割", "认识可以帮助你的人": "相談できる人",
  "成绩与课程": "成績と科目", "社团活动": "クラブ活動", "重要资源链接": "重要なリンク", "同伴故事": "仲間のストーリー",
  "匿名分享": "匿名で共有", "私密保存": "非公開で保存", "你今天感觉怎么样？": "今日はどんな気持ちですか？",
  "搜索故事": "ストーリーを検索", "筛选": "絞り込み", "辅导员": "カウンセラー", "同伴导师": "ピアメンター",
  "你很重要，支持一直都在。": "あなたは大切です。いつでも支えがあります。", "没有搜索结果": "検索結果がありません"
};
const KO: Record<string, string> = {
  "首页": "홈", "登录": "로그인", "创建账号": "계정 만들기", "返回上一页": "이전 페이지",
  "学校信息": "학교 정보", "校园地图": "캠퍼스 지도", "课程与时间表": "수업 및 시간표", "认识可以帮助你的人": "도움을 줄 수 있는 사람들",
  "成绩与课程": "성적 및 과목", "社团活动": "동아리 활동", "重要资源链接": "중요 자료 링크", "同伴故事": "또래 이야기",
  "匿名分享": "익명으로 공유", "私密保存": "비공개 저장", "你今天感觉怎么样？": "오늘 기분이 어떠세요?",
  "搜索故事": "이야기 검색", "筛选": "필터", "辅导员": "상담교사", "同伴导师": "또래 멘토",
  "你很重要，支持一直都在。": "당신은 소중하며 언제나 도움을 받을 수 있습니다.", "没有搜索结果": "검색 결과가 없습니다"
};
const FIL: Record<string, string> = {
  "首页": "Home", "登录": "Mag-sign in", "创建账号": "Gumawa ng account", "返回上一页": "Bumalik",
  "学校信息": "Impormasyon ng paaralan", "校园地图": "Mapa ng campus", "课程与时间表": "Mga klase at iskedyul", "认识可以帮助你的人": "Mga taong makatutulong",
  "成绩与课程": "Mga grado at kurso", "社团活动": "Mga club at aktibidad", "重要资源链接": "Mahahalagang link", "同伴故事": "Mga kuwento ng kapwa mag-aaral",
  "匿名分享": "Ibahagi nang hindi nagpapakilala", "私密保存": "I-save nang pribado", "你今天感觉怎么样？": "Ano ang nararamdaman mo ngayon?",
  "搜索故事": "Maghanap ng kuwento", "筛选": "Salain", "辅导员": "Tagapayo", "同伴导师": "Peer mentor",
  "你很重要，支持一直都在。": "Mahalaga ka at laging may suportang handang tumulong.", "没有搜索结果": "Walang resulta"
};

function translateText(value: string, mode: LanguageMode) {
  if (mode === "zh") return value;
  const dictionary = mode === "ja" ? JA : mode === "ko" ? KO : FIL;
  let translated = value;
  for (const [source, target] of Object.entries(dictionary)) translated = translated.replaceAll(source, target);
  return translated;
}

type LanguageContextValue = {
  mode: LanguageMode;
  setMode: (mode: LanguageMode) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<LanguageMode>("zh");

  useEffect(() => {
    const saved = window.localStorage.getItem("bridge-secondary-language") as LanguageMode | null;
    if (saved === "zh" || saved === "ja" || saved === "ko" || saved === "fil") setModeState(saved);
  }, []);

  function setMode(next: LanguageMode) {
    setModeState(next);
    window.localStorage.setItem("bridge-secondary-language", next);
    document.documentElement.dataset.secondaryLanguage = next;
  }

  useEffect(() => {
    document.documentElement.dataset.secondaryLanguage = mode;
    document.documentElement.lang = mode === "zh" ? "zh-CN" : mode;
    const nodes: Text[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    for (const node of nodes) {
      const parent = node.parentElement;
      if (!parent || parent.closest("script,style,[data-no-translate]") || !/[\u3400-\u9fff]/.test(node.data)) continue;
      const source = node.parentElement?.dataset.originalSecondaryText ?? node.data;
      if (node.parentElement) node.parentElement.dataset.originalSecondaryText = source;
      node.data = translateText(source, mode);
    }
  }, [mode]);

  return (
    <LanguageContext.Provider value={{ mode, setMode }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}
