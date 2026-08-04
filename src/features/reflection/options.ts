export type ReflectionMood = "calm" | "lonely" | "anxious" | "confused" | "need_help";

type ReflectionOption = {
  sticker: string;
  label: { zh: string; en: string };
  message: { zh: string; en: string };
  actions: Array<{ zh: string; en: string }>;
  resources: string[];
};

export const reflectionOptions: Record<ReflectionMood, ReflectionOption> = {
  calm: {
    sticker: "☁",
    label: { zh: "我现在比较平静", en: "I feel calm" },
    message: {
      zh: "很好。可以记下今天是什么让你感觉稳定，这会帮助你以后找到自己的安全感来源。",
      en: "That is good to notice. Write down what helped you feel steady today.",
    },
    actions: [
      { zh: "写下一件今天帮到你的事。", en: "Write down one thing that helped today." },
      { zh: "把它当成下次可以重复的小方法。", en: "Keep it as a small step you can try again." },
    ],
    resources: [],
  },
  lonely: {
    sticker: "☂",
    label: { zh: "我有点孤单", en: "I feel lonely" },
    message: {
      zh: "孤单不代表你不被喜欢。刚到一个新地方，关系需要时间慢慢长出来。",
      en: "Feeling lonely does not mean you are unlikable. Connections take time in a new place.",
    },
    actions: [
      { zh: "明天试着和一个人说一句简单的话。", en: "Try one small sentence with one person tomorrow." },
      { zh: "找一个稳定的地方，比如 library、club room 或 counselor office。", en: "Choose one steady place, like the library, a club room, or counselor office." },
      { zh: "读一篇和你相似的故事。", en: "Read one story from someone who has felt something similar." },
    ],
    resources: ["/ask/stories"],
  },
  anxious: {
    sticker: "✦",
    label: { zh: "我有点紧张", en: "I feel anxious" },
    message: {
      zh: "先不用解决全部问题。把注意力放回下一件很小、很具体的事。",
      en: "You do not have to solve everything at once. Return to one small next step.",
    },
    actions: [
      { zh: "慢慢吸气、呼气三次。", en: "Take three slow breaths in and out." },
      { zh: "写下现在最担心的一个问题。", en: "Write down the one question you are most worried about." },
      { zh: "如果是英语表达，先准备一句开场白。", en: "If it is about English, prepare one sentence starter." },
    ],
    resources: ["/ask/questions"],
  },
  confused: {
    sticker: "◇",
    label: { zh: "我觉得很迷茫", en: "I feel confused" },
    message: {
      zh: "迷茫通常是因为信息太多。先把问题分成学校规则、朋友、语言或未来方向。",
      en: "Confusion often comes from too much information. Sort it into school, friends, language, or future plans.",
    },
    actions: [
      { zh: "先问一个最具体的问题。", en: "Ask one specific question first." },
      { zh: "去 School Information 找对应分类。", en: "Check the matching School Information category." },
    ],
    resources: ["/school-information", "/ask/questions"],
  },
  need_help: {
    sticker: "♡",
    label: { zh: "我需要帮助", en: "I need help" },
    message: {
      zh: "你不需要一个人撑着。可以找一位可信任的成年人、counselor、老师或家人。",
      en: "You do not have to handle this alone. Reach out to a trusted adult, counselor, teacher, or family member.",
    },
    actions: [
      { zh: "如果你现在不安全，立刻联系可信任的成年人或紧急服务。", en: "If you are not safe right now, contact a trusted adult or emergency services." },
      { zh: "在美国，也可以使用 988 Suicide & Crisis Lifeline。", en: "In the U.S., you can also use the 988 Suicide & Crisis Lifeline." },
    ],
    resources: ["/resources#urgent-help"],
  },
};

export function getReflectionSuggestion(mood: ReflectionMood) {
  return reflectionOptions[mood];
}
