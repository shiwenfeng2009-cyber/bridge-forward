import { NextResponse } from "next/server";

const targetMap = { ja: "ja", ko: "ko", fil: "tl" } as const;

const decodeText = (value: string) => {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const encodeText = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
};

function readTranslation(payload: unknown, fallback: string) {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return fallback;

  const translated = payload[0]
    .map((segment: unknown) =>
      Array.isArray(segment) && typeof segment[0] === "string" ? segment[0] : "",
    )
    .join("");

  return translated || fallback;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { encodedTexts?: unknown; target?: unknown };
    if (
      !Array.isArray(body.encodedTexts) ||
      !body.encodedTexts.length ||
      body.encodedTexts.length > 20 ||
      !(body.target === "ja" || body.target === "ko" || body.target === "fil")
    ) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const texts = body.encodedTexts.map((value) => decodeText(String(value)));
    if (texts.some((text) => text.length > 4000)) {
      return NextResponse.json({ error: "Text too long" }, { status: 400 });
    }

    const translations = await Promise.all(
      texts.map(async (text) => {
        const target = targetMap[body.target as keyof typeof targetMap];
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) return text;
        return readTranslation(await response.json(), text);
      }),
    );

    return NextResponse.json({ encodedTranslations: translations.map(encodeText) });
  } catch {
    return NextResponse.json({ error: "Translation unavailable" }, { status: 500 });
  }
}
