import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { GlobalBackButton } from "@/components/global-back-button";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { createClient } from "@/lib/supabase/server";
import { getUserDisplayName, getUserInitial } from "@/features/auth/profile";

import "./globals.css";
import "./home-final.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://bridge-forward-students.shiwenfeng2009.chatgpt.site"),
  title: "Bridge Forward｜中国留学生校园同行社区",
  description: "为初到美国的中国学生提供校园信息、美国教育体系指南、同伴论坛与心理支持。",
  keywords: ["Bridge Forward", "Moanalua High School", "中国留学生", "校园指南", "学生心理支持"],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { title: "Bridge Forward", description: "School guidance, peer connection, and mental wellness support for immigrant students.", url: "/", siteName: "Bridge Forward", type: "website" },
};

async function getHeaderUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .maybeSingle();
    const label = getUserDisplayName(user, profile);
    return { label, initial: getUserInitial(label) };
  } catch {
    // Keep public pages available when Supabase is not configured (for example, during a local build).
    return null;
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getHeaderUser();
  return <html lang="zh-CN"><body><LanguageProvider><AnalyticsTracker /><SiteHeader user={user} /><GlobalBackButton />{children}</LanguageProvider></body></html>;
}
