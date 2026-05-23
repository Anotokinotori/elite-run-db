import type { CSSProperties } from "react";

export const collapsedCopyStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

export const DETAIL_PANEL_SHELL_CLASS =
  "relative overflow-hidden rounded-[20px] bg-[#f4f3f1] shadow-[0_18px_34px_rgba(37,44,58,0.10)]";
export const DETAIL_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#f4f3f1] text-[#333333]";
export const DETAIL_MUTED_SURFACE_CLASS = "rounded-[16px] border border-[#e5e7eb] bg-[#FFFCF9]";
export const DETAIL_LIKE_ACTIVE_ICON_CLASS = "text-[#ff8ea1]";
