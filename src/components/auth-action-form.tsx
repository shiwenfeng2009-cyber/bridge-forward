"use client";

import { useActionState, useEffect, useState } from "react";

import {
  loginAction,
  registerAction,
  resendConfirmationAction,
} from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";

export function AuthActionForm({
  mode,
  reopenModalOnResult = false,
}: {
  mode: "login" | "register";
  reopenModalOnResult?: boolean;
}) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initialAuthActionState);
  const [resendState, resendFormAction, resendPending] = useActionState(resendConfirmationAction, initialAuthActionState);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    if (mode === "login" && new URLSearchParams(window.location.search).get("auth") === "confirmed") {
      setConfirmationMessage("邮箱已确认，请登录。Email confirmed—please sign in.");
    }
    if (reopenModalOnResult && (state.message || resendState.message)) {
      window.location.hash = mode === "login" ? "sign-in" : "create-account";
    }
  }, [mode, reopenModalOnResult, resendState.message, state.message]);

  const visibleMessage = state.message || resendState.message || confirmationMessage;
  const visibleMessageIsSuccess = state.ok || resendState.ok || Boolean(confirmationMessage);

  return (
    <form action={formAction} className={`auth-modal__form${mode === "register" ? " auth-modal__form--register" : ""}`}>
      {mode === "register" && (
        <label>身份展示 <small>Identity</small>
          <select defaultValue="anonymous" name="identityMode">
            <option value="anonymous">不透露具体身份 / Private</option>
            <option value="real_name">实名展示 / Real name</option>
          </select>
        </label>
      )}
      <input name="identifierType" type="hidden" value="gmail" />
      <label>邮箱 <small>Email</small><input autoComplete="email" name="identifier" required type="email" /></label>
      <label>密码 <small>Password</small><input autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} name="password" required type="password" /></label>
      {mode === "register" && (
        <>
          <label>姓名或社区昵称 <small>Name / Nickname</small><input maxLength={30} minLength={2} name="displayName" required /></label>
          <label>母语 <small>Native language</small><input defaultValue="中文" maxLength={40} minLength={2} name="nativeLanguage" required /></label>
        </>
      )}
      {visibleMessage && (
        <p aria-live="polite" className={`auth-modal__message${visibleMessageIsSuccess ? " auth-modal__message--success" : ""}`} role="status">
          {visibleMessage}
        </p>
      )}
      <button disabled={pending} type="submit">
        {pending ? "请稍候 / Please wait…" : mode === "login" ? "登录 / Sign in" : "创建账号 / Create account"}
      </button>
      {mode === "login" && (
        <button className="auth-modal__resend" disabled={resendPending} formAction={resendFormAction} formNoValidate type="submit">
          {resendPending ? "正在发送… / Sending…" : "没收到确认邮件？重新发送 / Resend confirmation"}
        </button>
      )}
    </form>
  );
}
