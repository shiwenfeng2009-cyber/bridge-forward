"use client";

import { useActionState } from "react";

import { submitStoryAction, type CommunityActionState } from "./actions";

const initialState: CommunityActionState = { ok: false, message: "" };

export function StorySubmissionForm() {
  const [state, action, pending] = useActionState(submitStoryAction, initialState);

  return (
    <form action={action} className="auth-form">
      <input name="language" type="hidden" value="en" />
      <label>
        Story title
        <input name="title" placeholder="My first lunch alone" required />
      </label>
      <label>
        Your story
        <textarea
          name="body"
          placeholder="Share what happened, what helped, and what you wish someone had told you."
          required
          rows={8}
        />
      </label>
      <label className="checkbox-label">
        <input defaultChecked name="publishAsAnonymous" type="checkbox" />
        Publish as 匿名同学 / Anonymous
      </label>
      <button disabled={pending} type="submit">{pending ? "Publishing…" : "Publish story"}</button>
      {state.message && <p className="forum-notice" role="status">{state.message}</p>}
    </form>
  );
}
