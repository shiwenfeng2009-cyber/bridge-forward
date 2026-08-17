import Link from "next/link";
import { submitModerationFormAction } from "@/features/admin/actions";
import { canModerate, moderationQueues } from "@/features/admin/moderation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let supabase;
  try { supabase = await createClient(); }
  catch { return <main className="admin-console"><div className="notice-card">后台连接尚未配置。</div></main>; }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <main className="admin-console"><div className="notice-card">请先使用管理员账号 <Link href="/sign-in">登录</Link>。</div></main>;
  const { data: profile } = await supabase.from("profiles").select("role,nickname").eq("id", user.id).single();
  if (!canModerate(profile?.role)) return <main className="admin-console"><div className="notice-card">此账号尚未获得管理员权限。</div></main>;

  // eslint-disable-next-line react-hooks/purity -- Server request time anchors the rolling moderation window.
  const since = new Date(Date.now() - 30 * 86400000).toISOString();
  const [{ count: members }, { count: views }, { data: recentViews }, ...queueResults] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("page_views").select("path,language,device_class,created_at").order("created_at", { ascending: false }).limit(40),
    ...moderationQueues.map(queue => supabase.from(queue.key).select("*").eq("status", "pending").order("created_at", { ascending: true }).limit(20)),
  ]);
  const pending = queueResults.reduce((sum, result) => sum + (result.data?.length ?? 0), 0);
  const byPath = new Map<string, number>();
  for (const item of recentViews ?? []) byPath.set(item.path, (byPath.get(item.path) ?? 0) + 1);

  return <main className="admin-console">
    <header><p>Bridge Forward Operations</p><h1>网站运营后台</h1><span>账号、公开内容审核与匿名访问统计（不显示密码或私人日记）</span></header>
    <section className="admin-metrics">
      <article><strong>{members ?? 0}</strong><span>注册账号</span></article>
      <article><strong>{views ?? 0}</strong><span>近 30 天页面浏览</span></article>
      <article><strong>{pending}</strong><span>待审核项目</span></article>
      <article><strong>{new Set((recentViews ?? []).map(v => `${v.path}:${v.created_at.slice(0,10)}`)).size}</strong><span>近期活跃页面/日</span></article>
    </section>
    <section className="admin-panel"><h2>近期热门页面</h2><div className="admin-paths">{[...byPath.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8).map(([path,count])=><div key={path}><code>{path}</code><strong>{count}</strong></div>)}</div></section>
    <section className="admin-panel"><h2>内容审核</h2>{moderationQueues.map((queue,index)=><div className="admin-queue" key={queue.key}><h3>{queue.title} <span>{queueResults[index].data?.length ?? 0}</span></h3>{(queueResults[index].data ?? []).map((item: Record<string, unknown>)=><article key={String(item.id)}><div><strong>{String(item.title ?? item.reason ?? queue.key)}</strong><p>{String(item.body ?? item.note ?? "等待审核")}</p></div><form action={submitModerationFormAction}><input type="hidden" name="targetTable" value={queue.key}/><input type="hidden" name="targetId" value={String(item.id)}/><button name="status" value="approved">通过</button><button name="status" value="rejected">拒绝</button><button name="status" value="removed">移除</button></form></article>)}{!queueResults[index].data?.length&&<p className="admin-empty">暂无待审核内容</p>}</div>)}</section>
  </main>;
}
