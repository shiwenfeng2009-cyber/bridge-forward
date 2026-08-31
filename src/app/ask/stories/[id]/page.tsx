import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicStory } from "@/features/community/public-data";

export const dynamic = "force-dynamic";

export default async function PublicStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const story = await getPublicStory(id);
  if (!story) notFound();
  return (
    <main className="section-page">
      <article className="notice-card">
        <p className="eyebrow">Public story · 公开故事</p>
        <h1>{story.title}</h1>
        <p>{story.body}</p>
        <small>{story.publish_as_anonymous ? "匿名同学 / Anonymous" : story.display_name || "匿名同学 / Anonymous"}</small>
      </article>
      <Link className="account-back-link" href="/ask/stories">← Back to stories · 返回故事</Link>
    </main>
  );
}
