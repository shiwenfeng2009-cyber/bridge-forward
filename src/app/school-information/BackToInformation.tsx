"use client";

import { useRouter } from "next/navigation";

export default function BackToInformation({ className }: { className: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      aria-label="返回上一页 / Go back"
      className={className}
      onClick={() => window.history.length > 1 ? router.back() : router.push("/school-information")}
      title="返回上一页 / Go back"
    >
      ←
    </button>
  );
}
