import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicQuestion } from "@/features/community/public-data";

export const dynamic = "force-dynamic";

export default async function PublicQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getPublicQuestion(id);
  if (!item) notFound();
  return (
    <main className="section-page">
      <article className="notice-card">
        <p className="eyebrow">Public question · 公开问题</p>
        <h1>{item.question.title}</h1>
        <p>{item.question.body}</p>
        <small>{item.question.display_name || "匿名同学 / Anonymous"}</small>
      </article>
      <section className="story-title-list" aria-label="Public replies">
        {item.replies.map((reply) => (
          <article className="story-row" key={reply.id}>
            <div><strong>{reply.display_name || "匿名同学 / Anonymous"}</strong><p>{reply.body}</p></div>
          </article>
        ))}
      </section>
      <Link className="account-back-link" href="/ask/questions">← Back to community · 返回社区</Link>
    </main>
  );
}
