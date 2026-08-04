"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { saveReflectionAction, type ReflectionActionState } from "./actions";
import {
  type ReflectionMood,
  getReflectionSuggestion,
  reflectionOptions,
} from "./options";

const moodOrder = ["calm", "lonely", "anxious", "confused", "need_help"] as const;
const initialState: ReflectionActionState = { ok: false, message: "" };

export function ReflectionCorner() {
  const [selectedMood, setSelectedMood] = useState<ReflectionMood>("calm");
  const [state, formAction, pending] = useActionState(saveReflectionAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const suggestion = getReflectionSuggestion(selectedMood);

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <section className="reflection-corner reflection-corner--notebook" aria-labelledby="reflection-corner-heading">
      <div className="reflection-corner__header">
        <p className="eyebrow">Private Reflection Journal / 私人日记本</p>
        <h2 id="reflection-corner-heading">今天的你，比较接近哪一种感觉？</h2>
        <p className="reflection-corner__notice">
          This tool is for self-reflection only. It does not provide diagnosis or treatment.
          Saved notes stay private to your account.
        </p>
      </div>

      <div className="reflection-notebook">
        <div className="reflection-notebook__left">
          <h3>Mood stickers</h3>
          <div className="reflection-options reflection-options--stickers" role="group" aria-label="Reflection choices">
            {moodOrder.map((mood) => {
              const option = reflectionOptions[mood];

              return (
                <button
                  aria-pressed={selectedMood === mood}
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  type="button"
                >
                  <span className="mood-sticker" aria-hidden="true">
                    {option.sticker}
                  </span>
                  <strong>{option.label.zh}</strong>
                  <small>{option.label.en}</small>
                </button>
              );
            })}
          </div>
        </div>

        <article className="reflection-suggestion reflection-suggestion--paper" aria-live="polite">
          <h3>{suggestion.label.en}</h3>
          <strong>{suggestion.label.zh}</strong>
          <p>{suggestion.message.zh}</p>
          <p>{suggestion.message.en}</p>
          <ul>
            {suggestion.actions.map((action) => (
              <li key={action.en}>
                <span>{action.zh}</span>
                <small>{action.en}</small>
              </li>
            ))}
          </ul>
          {suggestion.resources.length > 0 ? (
            <div className="reflection-resources">
              {suggestion.resources.map((resource) => (
                <a href={resource} key={resource}>
                  Open resource →
                </a>
              ))}
            </div>
          ) : null}
        </article>
      </div>

      <form action={formAction} className="reflection-save reflection-save--diary" ref={formRef}>
        <input name="mood" type="hidden" value={selectedMood} />
        <label>
          Optional private note / 可选私人笔记
          <textarea
            maxLength={500}
            name="note"
            placeholder="Write like a diary: Today felt hard because... One small thing I can try tomorrow is..."
            rows={6}
          />
        </label>
        <div className="reflection-save__footer">
          <p>你也可以不保存，只看建议。保存的内容不会公开显示。</p>
          <button disabled={pending} type="submit">
            {pending ? "Saving..." : "Save privately"}
          </button>
        </div>
      </form>

      {state.message ? (
        <div className="search-toast reflection-toast" role="status">
          {state.message}
        </div>
      ) : null}
    </section>
  );
}
