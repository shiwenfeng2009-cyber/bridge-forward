import { NextResponse } from "next/server";

const targetMap = { ja:"ja", ko:"ko", fil:"tl" } as const;
const decodeText=(value:string)=>{const binary=atob(value);const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));return new TextDecoder().decode(bytes)};
const encodeText=(value:string)=>{const bytes=new TextEncoder().encode(value);let binary="";for(const byte of bytes)binary+=String.fromCharCode(byte);return btoa(binary)};
export async function POST(request: Request) {
  try {
    const body=await request.json() as {encodedTexts?:unknown;target?:unknown};
    if(!Array.isArray(body.encodedTexts)||!body.encodedTexts.length||body.encodedTexts.length>20||!(body.target==="ja"||body.target==="ko"||body.target==="fil"))return NextResponse.json({error:"Invalid request"},{status:400});
    const texts=body.encodedTexts.map(value=>decodeText(String(value))); if(texts.some(text=>text.length>4000))return NextResponse.json({error:"Text too long"},{status:400});
    const translations=await Promise.all(texts.map(async text=>{const url=`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetMap[body.target as keyof typeof targetMap]}&dt=t&q=${encodeURIComponent(text)}`;const response=await fetch(url);if(!response.ok)return text;const data=await response.json();return data[0].map((part:unknown[])=>part[0]).join("")}));
    return NextResponse.json({encodedTranslations:translations.map(encodeText)});
  } catch { return NextResponse.json({error:"Translation unavailable"},{status:500}); }
}
