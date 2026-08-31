import ForumExperience from "./ForumExperience";
import { getPublicCommunityFeed } from "@/features/community/public-data";

export const dynamic = "force-dynamic";

export default async function AskQuestionsPage() {
  const publicFeed = await getPublicCommunityFeed();
  return <ForumExperience publicFeed={publicFeed} />;
}
