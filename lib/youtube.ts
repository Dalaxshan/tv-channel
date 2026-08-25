import type { Episode } from "@/types";

const API_BASE = "https://www.googleapis.com/youtube/v3";

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API error ${res.status}: ${body}`);
  }
  return res.json();
}

// PT15M33S -> "15:33", PT1H2M3S -> "1:02:03"
function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

async function getChannelInfo(channelId: string, apiKey: string) {
  const url = `${API_BASE}/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`;
  const data = await fetchJson(url);
  const item = data.items?.[0];
  const uploadsPlaylistId = item?.contentDetails?.relatedPlaylists?.uploads;
  const channelTitle: string = item?.snippet?.title ?? "";
  if (!uploadsPlaylistId) throw new Error("Could not resolve uploads playlist for channel");
  return { uploadsPlaylistId, channelTitle };
}

type RawPlaylistVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

async function getPlaylistVideos(playlistId: string, apiKey: string): Promise<RawPlaylistVideo[]> {
  const videos: RawPlaylistVideo[] = [];
  let pageToken = "";

  do {
    const url = `${API_BASE}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${pageToken}&key=${apiKey}`;
    const data = await fetchJson(url);

    for (const item of data.items ?? []) {
      const snippet = item.snippet;
      if (!snippet?.resourceId?.videoId || snippet.title === "Private video" || snippet.title === "Deleted video") continue;

      videos.push({
        id: snippet.resourceId.videoId,
        title: snippet.title,
        description: snippet.description,
        thumbnail:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          "",
        publishedAt: snippet.publishedAt,
      });
    }

    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return videos;
}

// Fetch view counts + duration for a batch of video IDs (max 50 per API call)
async function getVideoDetails(videoIds: string[], apiKey: string) {
  const details: Record<string, { viewCount: number; duration: string }> = {};
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = `${API_BASE}/videos?part=statistics,contentDetails&id=${batch.join(",")}&key=${apiKey}`;
    const data = await fetchJson(url);
    for (const item of data.items ?? []) {
      details[item.id] = {
        viewCount: Number(item.statistics?.viewCount ?? 0),
        duration: formatDuration(item.contentDetails?.duration ?? "PT0S"),
      };
    }
  }
  return details;
}

/**
 * Fetches every video from the channel's uploads playlist, enriched with
 * view count, duration, and a `featured` flag (true if the video is in the
 * YOUTUBE_FEATURED_PLAYLIST_ID playlist), mapped into your Episode shape.
 *
 * `slug` is set to the YouTube video ID - your /videos/[slug] detail page
 * should fetch by video ID (e.g. via videos.list) to match.
 */
export async function getYouTubeEpisodes(): Promise<Episode[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  if (!apiKey || !channelId) {
    throw new Error("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID env vars");
  }

  const { uploadsPlaylistId, channelTitle } = await getChannelInfo(channelId, apiKey);
  const rawVideos = await getPlaylistVideos(uploadsPlaylistId, apiKey);
  const details = await getVideoDetails(rawVideos.map((v) => v.id), apiKey);

  // Featured video IDs, if a featured playlist is configured
  let featuredIds = new Set<string>();
  const featuredPlaylistId = process.env.YOUTUBE_FEATURED_PLAYLIST_ID;
  if (featuredPlaylistId) {
    const featuredVideos = await getPlaylistVideos(featuredPlaylistId, apiKey);
    featuredIds = new Set(featuredVideos.map((v) => v.id));
  }

  // Oldest-first pass to assign chronological episode numbers
  const chronological = [...rawVideos].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const episodeNumbers = new Map(chronological.map((v, i) => [v.id, i + 1]));

  return rawVideos.map((v) => ({
    slug: v.id,
    showSlug: channelId,
    title: v.title,
    image: v.thumbnail,
    publishDate: v.publishedAt,
    showTitle: channelTitle,
    episodeNumber: episodeNumbers.get(v.id) ?? 0,
    duration: details[v.id]?.duration ?? "0:00",
    viewCount: details[v.id]?.viewCount ?? 0,
    category: "Entertainment" as const,
    featured: featuredIds.has(v.id),
  }));
}