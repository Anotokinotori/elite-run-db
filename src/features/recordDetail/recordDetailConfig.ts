import type { CSSProperties } from "react";

export const collapsedCopyStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

export const DETAIL_PANEL_SHELL_CLASS = "relative overflow-hidden rounded-[20px] bg-[#3d3c3d] drop-shadow-xl";
export const DETAIL_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-[#323132] text-white/90";
export const DETAIL_MUTED_SURFACE_CLASS = "rounded-[16px] border border-white/10 bg-[#272727]";
export const DETAIL_ICON_BUTTON_CLASS =
  "grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#272727] text-white/82 transition hover:bg-white/[0.12] hover:text-white";
export const DETAIL_LIKE_ACTIVE_ICON_CLASS = "text-[#ff8ea1]";
