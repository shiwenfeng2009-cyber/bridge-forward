import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const extensions = new Set([".tsx", ".ts"]);
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name)) && !entry.name.includes("generated-translations")) files.push(full);
  }
}
walk(path.join(root, "src"));

const phrases = new Set();
for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/[\u3400-\u9fff][^\n\r<>"'`{};]*/g)) {
    const value = match[0].replace(/\\n/g, " ").replace(/\\u[^ ]+/g, "").trim();
    if (value && value.length <= 420) phrases.add(value);
  }
}

const sourcePhrases = [...phrases].sort((a, b) => b.length - a.length);
const targets = { ja: "ja", ko: "ko", fil: "tl" };
const result = { zh: Object.fromEntries(sourcePhrases.map((s) => [s, s])), ja: {}, ko: {}, fil: {} };
const delimiter = "\n[[[BRIDGE_FORWARD_SPLIT]]] \n";

function chunks(values, max = 1800) {
  const output = []; let current = [];
  for (const value of values) {
    if (current.length && current.join(delimiter).length + value.length > max) { output.push(current); current = []; }
    current.push(value);
  }
  if (current.length) output.push(current);
  return output;
}

for (const [key, target] of Object.entries(targets)) {
  for (const group of chunks(sourcePhrases)) {
    const query = group.join(delimiter);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=${target}&dt=t&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Translation failed: ${response.status}`);
    const data = await response.json();
    const translated = data[0].map((part) => part[0]).join("");
    const parts = translated.split(/\s*\[\[\[BRIDGE_FORWARD_SPLIT\]\]\]\s*/);
    group.forEach((source, index) => { result[key][source] = (parts[index] || source).trim(); });
    await new Promise((resolve) => setTimeout(resolve, 120));
  }
}

fs.writeFileSync(path.join(root, "src/lib/i18n/generated-translations.json"), JSON.stringify(result, null, 2) + "\n");
console.log(`Generated ${sourcePhrases.length} phrases in ${Object.keys(targets).length} languages.`);
