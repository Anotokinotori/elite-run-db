import { describe, expect, it } from "vitest";

import { getYouTubeThumbnailUrl } from "./youtube";

describe("youtube helpers", () => {
  it("builds thumbnail URLs from youtube watch URLs", () => {
    expect(getYouTubeThumbnailUrl("https://www.youtube.com/watch?v=abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });

  it("builds thumbnail URLs from youtu.be URLs", () => {
    expect(getYouTubeThumbnailUrl("https://youtu.be/xyz789")).toBe("https://i.ytimg.com/vi/xyz789/hqdefault.jpg");
  });

  it("returns null for invalid or unsupported URLs", () => {
    expect(getYouTubeThumbnailUrl("not a url")).toBeNull();
    expect(getYouTubeThumbnailUrl("https://example.com/watch?v=abc123")).toBeNull();
  });
});
