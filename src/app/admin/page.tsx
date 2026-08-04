import Link from "next/link";

import { canModerate, moderationQueues } from "@/features/admin/moderation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type QueueCount = {
  key: string;
  title: string;
  description: string;
  count: number;
};

type AdminDashboardData =
  | { status: "setup"; message: string }
  | { status: "signed-out" }
  | { status: "forbidden" }
  | { status: "ready"; queues: QueueCount[] };

async function getAdminDashboardData(): Promise<AdminDashboardData> {
  let supabase: Awaited<ReturnType<typeof createClient>>;

  try {
    supabase = await createClient();
  } catch {
    return {
      status: "setup",
      message:
        "Supabase environment variables are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before using moderation.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "signed-out" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!canModerate(profile?.role)) {
    return { status: "forbidden" };
  }

  const queues = await Promise.all(
    moderationQueues.map(async (queue) => {
      const { count } = await supabase
        .from(queue.key)
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

      return {
        key: queue.key,
        title: queue.title,
        description: queue.description,
        count: count ?? 0,
      };
    }),
  );

  return { status: "ready", queues };
}

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <main className="section-page">
      <section className="section-hero" aria-labelledby="admin-heading">
        <div className="section-hero__copy">
          <p className="eyebrow">Admin</p>
          <h1 id="admin-heading">审核后台</h1>
          <p>
            管理员和 moderator 在这里处理 pending questions、stories、replies、reports
            和 Verified Supporter applications。后台不会显示私人 Reflection Corner 记录。
          </p>
        </div>
        <div className="section-hero__art" aria-hidden="true" />
      </section>

      {data.status === "setup" ? (
        <aside className="notice-card">
          <p>{data.message}</p>
        </aside>
      ) : null}

      {data.status === "signed-out" ? (
        <aside className="notice-card">
          <p>
            请先登录管理员账号。Please <Link href="/sign-in">sign in</Link> as a
            moderator or admin.
          </p>
        </aside>
      ) : null}

      {data.status === "forbidden" ? (
        <aside className="notice-card">
          <p>这个页面只开放给 moderator 和 admin。This page is restricted.</p>
        </aside>
      ) : null}

      {data.status === "ready" ? (
        <section className="admin-queue-grid" aria-label="Moderation queues">
          {data.queues.map((queue) => (
            <article className="admin-queue-card" key={queue.key}>
              <span className="card-kicker">{queue.key.replaceAll("_", " ")}</span>
              <h2>{queue.title}</h2>
              <p>{queue.description}</p>
              <strong>{queue.count}</strong>
              <span>pending</span>
            </article>
          ))}
        </section>
      ) : null}
    </main>
  );
}
