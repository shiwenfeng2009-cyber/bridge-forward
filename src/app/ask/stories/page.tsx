import { postStoryFormAction } from "@/features/community/actions";
import { getApprovedStoryCards } from "@/features/community/public-data";

const sampleStoryTitles = [
  "My first lunch alone",
  "The first time I spoke in class",
  "How I found my first friend",
  "What I wish someone had told me",
] as const;

export default async function AskStoriesPage() {
  const approvedStories = await getApprovedStoryCards();
  const storiesToShow =
    approvedStories.length > 0
      ? approvedStories
      : sampleStoryTitles.map((title, index) => ({
          id: `sample-${index}`,
          title,
          body: "A reviewed student story will appear here after submission and moderation.",
          authorLabel: "Coming soon",
        }));

  return (
    <main className="section-page stories-page">
      <section className="section-hero section-hero--stories" aria-labelledby="public-stories-heading">
        <div className="section-hero__copy">
          <p className="eyebrow">Story Library / 故事目录</p>
          <h1 id="public-stories-heading">像浏览文章一样，找到和你相似的故事</h1>
          <p>
            You do not have to share everything immediately. Start by browsing titles, then open the story that feels
            closest to your moment. Student submissions are reviewed before they appear publicly.
          </p>
        </div>
        <div className="section-hero__art section-hero__art--stories" aria-hidden="true" />
      </section>

      <section className="story-library-layout">
        <div className="story-index-card">
          <p className="eyebrow">Index</p>
          <h2>故事目录</h2>
          <p>Browse by title first. Read only what feels helpful today.</p>
        </div>

        <div className="story-title-list" aria-label="Approved stories">
          {storiesToShow.map((story, index) => (
            <article className="story-row" key={story.id}>
              <span className="story-row__number">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{story.title}</h2>
                <p>{story.body}</p>
                <small>{story.authorLabel}</small>
              </div>
              <span aria-hidden="true">→</span>
            </article>
          ))}
        </div>
      </section>

      <section className="submit-story-card" aria-labelledby="stories-heading">
        <div>
          <p className="eyebrow">Submit a story</p>
          <h2 id="stories-heading">也可以把你的经历留给后来的人</h2>
          <p>
            You can submit anonymously. Stories are reviewed before publication. Write honestly; it does not need to
            sound like an essay.
          </p>
        </div>

        <form action={postStoryFormAction} className="auth-form">
          <input name="language" type="hidden" value="en" />
          <label>
            Story title
            <input name="title" placeholder="My first lunch alone" />
          </label>
          <label>
            Your story
            <textarea
              name="body"
              placeholder="Share what happened, what helped, and what you wish someone had told you."
              rows={8}
            />
          </label>
          <label className="checkbox-label">
            <input defaultChecked name="publishAsAnonymous" type="checkbox" />
            Publish as Anonymous Student
          </label>
          <button type="submit">Submit story for review</button>
        </form>
      </section>
    </main>
  );
}
