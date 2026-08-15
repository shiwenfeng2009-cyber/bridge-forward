export type AuthActionState = { ok: boolean; message: string };
export const initialAuthActionState: AuthActionState = { ok: false, message: "" };

export function friendlyAuthError(code?: string, fallback = "暂时无法完成操作。Please try again.") {
  switch (code) {
    case "invalid_credentials":
      return "账号或密码不正确。Invalid email/phone or password.";
    case "email_not_confirmed":
      return "请先打开确认邮件完成验证。Please confirm your email before signing in.";
    case "user_already_exists":
    case "email_exists":
    case "phone_exists":
      return "此账号已经存在。This account already exists. Please sign in instead.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "尝试次数过多，请稍后再试。Too many attempts. Please try again later.";
    case "email_address_invalid":
    case "validation_failed":
      return "请输入有效的邮箱地址。Please enter a valid email address.";
    case "phone_provider_disabled":
      return "暂不支持手机号注册，请使用邮箱。Phone registration is not available; please use email.";
    default:
      return fallback;
  }
}
