import type { Episode, Category } from "@/types";

export async function getEpisodesByShowSlug(
  slug: string,
  showTitle: string,
  category: Category,
  maxResults = 50,
): Promise<Episode[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) return [];

  const results: Episode[] = [];
  let pageToken: string | undefined;
  let position = 0;

  try {
    do {
      const params = new URLSearchParams({
        key: apiKey,
        channelId,
        part: "snippet",
        q: showTitle,
        type: "video",
        order: "date",
        maxResults: "50",
      });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${params.toString()}`,
        { next: { revalidate: 300 } },
      );
      if (!res.ok) {
        console.error("YouTube API error:", await res.text());
        break;
      }

      const data = await res.json();
      for (const item of data.items ?? []) {
        const videoId = item.id?.videoId;
        const snippet = item.snippet;
        if (!videoId || !snippet?.title) continue;

        results.push({
          slug: videoId,
          showSlug: slug,
          showTitle,
          episodeNumber: ++position,
          title: snippet.title,
          duration: "",
          publishDate: snippet.publishedAt ?? "",
          image:
            snippet.thumbnails?.high?.url ??
            snippet.thumbnails?.medium?.url ??
            snippet.thumbnails?.default?.url ??
            "",
          category,
          youtubeId: videoId,
        });

        if (results.length >= maxResults) break;
      }

      pageToken = data.nextPageToken;
    } while (pageToken && results.length < maxResults);

    return results;
  } catch (error) {
    console.error("Failed to fetch YouTube episodes:", error);
    return results;
  }
}