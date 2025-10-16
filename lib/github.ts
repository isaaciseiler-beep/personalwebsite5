// lib/github.ts
export type RepoMeta = {
  stars: number | null;
  sha: string | null;
  url: string;
};

const REPO = "isaaciseiler-beep/personalwebsite5";
const API = "https://api.github.com";

export async function getRepoMeta(): Promise<RepoMeta> {
  // Unauthed fetch. Low volume is fine. Cache for 1h at the edge.
  const repoRes = await fetch(`${API}/repos/${REPO}`, {
    // Revalidate hourly
    next: { revalidate: 3600 },
    headers: { Accept: "application/vnd.github+json" },
  }).catch(() => null);

  let stars: number | null = null;
  if (repoRes?.ok) {
    const data = (await repoRes.json()) as { stargazers_count?: number };
    stars = typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  }

  const commitRes = await fetch(`${API}/repos/${REPO}/commits?per_page=1`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/vnd.github+json" },
  }).catch(() => null);

  let sha: string | null = null;
  if (commitRes?.ok) {
    const arr = (await commitRes.json()) as Array<{ sha?: string }>;
    sha = arr?.[0]?.sha ?? null;
  }

  return { stars, sha, url: `https://github.com/${REPO}.git` };
}
