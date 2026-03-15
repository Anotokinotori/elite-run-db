export function getYouTubeVideoId(videoUrl: string) {
  try {
    const parsed = new URL(videoUrl);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (host.endsWith("youtube.com")) {
      const fromSearch = parsed.searchParams.get("v");

      if (fromSearch) {
        return fromSearch;
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] ?? null;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(videoUrl: string) {
  return getYouTubeVideoId(videoUrl) !== null;
}

export function getYouTubeEmbedUrl(
  videoUrl: string,
  options?: {
    autoplay?: boolean;
    mute?: boolean;
    enableJsApi?: boolean;
  },
) {
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoId) {
    return null;
  }

  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });

  if (options?.autoplay) {
    params.set("autoplay", "1");
  }

  if (options?.mute) {
    params.set("mute", "1");
  }

  if (options?.enableJsApi) {
    params.set("enablejsapi", "1");
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
