"use client";

import { useActionState } from "react";

import {
  loginAction,
  registerAction,
} from "@/features/auth/actions";
import { initialAuthActionState } from "@/features/auth/state";

export function AuthActionForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction, pending] = useActionState(action, initialAuthActionState);

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
      <label>{mode === "login" ? "登录方式" : "注册方式"} <small>{mode === "login" ? "Sign-in method" : "Account method"}</small>
        <select defaultValue="gmail" name="identifierType">
          <option value="gmail">Gmail / 邮箱</option>
          <option value="phone">电话号码 / Phone</option>
          <option value="student_id">学生证号 / Student ID</option>
        </select>
      </label>
      <label>账号 <small>Identifier</small><input autoComplete="username" name="identifier" required /></label>
      <label>密码 <small>Password</small><input autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} name="password" required type="password" /></label>
      {mode === "register" && (
        <>
          <label>姓名或社区昵称 <small>Name / Nickname</small><input maxLength={30} minLength={2} name="displayName" required /></label>
          <label>母语 <small>Native language</small><input defaultValue="中文" maxLength={40} minLength={2} name="nativeLanguage" required /></label>
        </>
      )}
      {state.message && (
        <p aria-live="polite" className={`auth-modal__message${state.ok ? " auth-modal__message--success" : ""}`} role="status">
          {state.message}
        </p>
      )}
      <button disabled={pending} type="submit">
        {pending ? "请稍候 / Please wait…" : mode === "login" ? "登录 / Sign in" : "创建账号 / Create account"}
      </button>
    </form>
  );
}
