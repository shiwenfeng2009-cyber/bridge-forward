import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: "https://bridge-forward-students.shiwenfeng2009.chatgpt.site/sitemap.xml" }; }
