"use client";

import { usePathname, useRouter } from "next/navigation";

const routesWithOwnBack = new Set(["/ask/questions", "/ask/reflection", "/school-information/map", "/school-information/schedule", "/school-information/academics", "/school-information/clubs", "/school-information/people"]);

export function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/" || routesWithOwnBack.has(pathname)) return null;
  return <button className="global-back-button" type="button" aria-label="返回上一页 / Go back" title="返回上一页 / Go back" onClick={() => window.history.length > 1 ? router.back() : router.push("/")}>←</button>;
}
