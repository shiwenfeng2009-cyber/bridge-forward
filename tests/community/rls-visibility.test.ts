import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260831010000_public_community_visibility.sql"),
  "utf8",
);

describe("public community RLS migration", () => {
  for (const table of ["questions", "stories", "replies"]) {
    it(`allows anonymous public publishing and browsing for ${table}`, () => {
      expect(migration).toContain(`alter table public.${table} alter column author_id drop not null`);
      expect(migration).toContain(`grant select, insert on public.questions, public.stories, public.replies to anon`);
      expect(migration).toContain(`on public.${table} for insert`);
      expect(migration).toContain("to anon, authenticated");
      expect(migration).toContain("status = 'approved'");
      expect(migration).toContain("author_id is null or author_id = (select auth.uid())");
    });
  }

  it("keeps anonymous visitors from update and delete privileges", () => {
    expect(migration).toContain("revoke all on public.questions, public.stories, public.replies from anon, authenticated");
    expect(migration).not.toContain("grant select, insert, update, delete on public.questions, public.stories, public.replies to anon");
  });

  it("does not change private reflection, profile, report, or admin visibility", () => {
    expect(migration).not.toMatch(/alter table public\.(reflection|profiles|reports|moderation_actions)/);
  });
});
