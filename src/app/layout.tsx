import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { GlobalBackButton } from "@/components/global-back-button";
import { LanguageProvider } from "@/lib/i18n/language-context";
import { AnalyticsTracker } from "@/components/analytics-tracker";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><LanguageProvider><AnalyticsTracker /><SiteHeader /><GlobalBackButton />{children}</LanguageProvider></body></html>;
}
