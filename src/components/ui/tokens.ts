export const dsTokens = {
  color: {
    ink: "#111827",
    inkSoft: "#333333",
    chromeDark: "#111116",
    chromeDarkHover: "#17171d",
    surface: "#ffffff",
    surfaceMuted: "#f7f8fa",
    surfaceApp: "#f5f6f8",
    surfaceCreate: "#f6f6f6",
    surfaceRaised: "#fbfcfd",
    border: "#d8dde6",
    borderMuted: "#e5e7eb",
    textMuted: "#5f6678",
    textSubtle: "#8d93a3",
    textCreateMuted: "#9999b1",
    danger: "#d24b5a",
    like: "#ff8ea1",
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    modal: "24px",
    pill: "999px",
  },
  shadow: {
    hairline: "0 1px 0 rgba(17,24,39,0.04)",
    card: "0 10px 24px rgba(21,27,38,0.06)",
    raised: "0 18px 34px rgba(21,27,38,0.11)",
    modal: "0 24px 60px rgba(0,0,0,0.18)",
    drawerLeft: "18px 0 44px rgba(31,41,55,0.12)",
    drawerRight: "-24px 0 60px rgba(31,41,55,0.16)",
  },
} as const;

export type DsTokenPath = typeof dsTokens;
