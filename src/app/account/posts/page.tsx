import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function MyPostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/?auth=required#sign-in");

  const [{ data: questions }, { data: stories }] = await Promise.all([
    supabase.from("questions").select("id,title,status,created_at").eq("author_id", user.id).order("created_at", { ascending: false }),
    supabase.from("stories").select("id,title,status,created_at").eq("author_id", user.id).order("created_at", { ascending: false }),
  ]);
  const posts = [
    ...(questions || []).map((post) => ({ ...post, type: "问题 / Question" })),
    ...(stories || []).map((post) => ({ ...post, type: "故事 / Story" })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <main className="section-page account-page">
      <section className="account-card">
        <p className="eyebrow">YOUR CONTENT</p><h1>我的发布 / My posts</h1>
        {posts.length ? <div className="account-posts">{posts.map((post) => (
          <article key={`${post.type}-${post.id}`}><span>{post.type}</span><h2>{post.title}</h2><small>{post.status}</small></article>
        ))}</div> : <p className="notice-card">你还没有发布内容。You have not posted anything yet.</p>}
        <Link className="account-back-link" href="/account">← 返回个人资料 / Back to profile</Link>
      </section>
    </main>
  );
}
