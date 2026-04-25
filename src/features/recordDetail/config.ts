import type { CSSProperties } from "react";

export const collapsedCopyStyle: CSSProperties = {
  display: "-webkit-box",
  overflow: "hidden",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
};

export const DETAIL_PANEL_SHELL_CLASS =
  "relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#ffffff_0%,#f1eadf_34%,#dfe8f2_68%,#f8f6f1_100%)] shadow-[0_18px_34px_rgba(37,44,58,0.10)]";
export const DETAIL_PANEL_INNER_CLASS = "relative z-[1] m-[2px] rounded-[18px] bg-white text-[#333333]";
export const DETAIL_MUTED_SURFACE_CLASS = "rounded-[16px] border border-[#e5e7eb] bg-[#f7f8fa]";
export const DETAIL_ICON_BUTTON_CLASS =
  "grid h-9 w-9 place-items-center rounded-full border border-[#d8dde6] bg-white text-[#333333] transition hover:bg-[#eef1f5]";
export const DETAIL_LIKE_ACTIVE_ICON_CLASS = "text-[#ff8ea1]";
