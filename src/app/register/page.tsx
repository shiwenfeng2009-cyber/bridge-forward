import { submitRegisterAction } from "@/features/auth/actions";

export default function RegisterPage() {
  return (
    <main className="section-page auth-page">
      <section className="auth-card" aria-labelledby="register-heading">
        <p className="eyebrow">Create account</p>
        <h1 id="register-heading">创建你的 Bridge Forward 账号</h1>
        <p>
          必填信息只有 email、password、nickname 和 native language。
          年级和兴趣可以之后再填。
        </p>

        <form action={submitRegisterAction} className="auth-form">
          <label>
            Email
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input
              autoComplete="new-password"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </label>
          <label>
            Nickname / 昵称
            <input maxLength={30} minLength={2} name="nickname" required type="text" />
          </label>
          <label>
            Native language / 母语
            <input maxLength={40} minLength={2} name="nativeLanguage" required type="text" />
          </label>
          <label>
            Grade / 年级（optional）
            <input max={12} min={9} name="grade" type="number" />
          </label>
          <label>
            Interests / 兴趣（optional, comma separated）
            <input name="interests" placeholder="band, bowling, art" type="text" />
          </label>
          <button type="submit">Create account</button>
        </form>
      </section>
    </main>
  );
}
