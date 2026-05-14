import { getYouTubeVideoId } from "../../../lib/youtube";

export function formatCompactBracketLabel(label: string) {
  return label.length > 4 ? `${label.slice(0, 3)}.` : label;
}

export function getYouTubeThumbnailUrl(videoUrl: string) {
  const videoId = getYouTubeVideoId(videoUrl);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
}
