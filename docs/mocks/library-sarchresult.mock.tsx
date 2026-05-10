import { useState } from "react";

const charImg = {
  Chasca: "https://enka.network/ui/UI_AvatarIcon_Chasca.png",
  Mavuika: "https://enka.network/ui/UI_AvatarIcon_Mavuika.png",
  Xilonen: "https://enka.network/ui/UI_AvatarIcon_Xilonen.png",
  Furina: "https://enka.network/ui/UI_AvatarIcon_Furina.png",
  Yelan: "https://enka.network/ui/UI_AvatarIcon_Yelan.png",
  Citlali: "https://enka.network/ui/UI_AvatarIcon_Citlali.png",
  Sayu: "https://enka.network/ui/UI_AvatarIcon_Sayu.png",
  Dehya: "https://enka.network/ui/UI_AvatarIcon_Dehya.png",
  Keqing: "https://enka.network/ui/UI_AvatarIcon_Keqing.png",
  Amber: "https://enka.network/ui/UI_AvatarIcon_Ambor.png",
};

const runs = [
  {
    id: "run-1", videoUrl: "https://www.youtube.com/watch?v=cUkSP9YgeRA",
    rank: 1, time: "04:41", userName: "Soluna", userHandle: "@soluna_rta",
    title: "Luna3 NPUI Chasca route / 400 elite sample",
    party: ["Chasca", "Mavuika", "Xilonen", "Furina"],
    platform: "PC", version: "Luna3", bracket: "Unlimited", ruleset: "NPUI",
    posted: "3日前", charCost: 12, weaponCost: 7,
    tags: ["PC", "Natlan", "高速処理", "WR"], accent: "#f32c16",
  },
  {
    id: "run-2", videoUrl: "https://www.youtube.com/watch?v=8yGn2O9yVi4",
    rank: 2, time: "05:08", userName: "Radicial", userHandle: "@radicial",
    title: "Middle cost Mavuika reference route",
    party: ["Mavuika", "Citlali", "Yelan", "Sayu"],
    platform: "PS5", version: "Luna3", bracket: "Middle", ruleset: "PUI",
    posted: "5日前", charCost: 6, weaponCost: 3,
    tags: ["Middle", "PS5", "安定寄り", "参考用"], accent: "#d09a02",
  },
  {
    id: "run-3", videoUrl: "https://www.youtube.com/watch?v=R6w8mN1pQ2Y",
    rank: 3, time: "05:31", userName: "Anotori", userHandle: "@anotokinotori",
    title: "Low cost Dehya pioneer / off meta sample",
    party: ["Dehya", "Keqing", "Amber", "Furina"],
    platform: "PC", version: "5.8", bracket: "Low", ruleset: "NPUI",
    posted: "1週間前", charCost: 3, weaponCost: 1,
    tags: ["Low", "OffMeta", "Pioneer", "短期決戦"], accent: "#af52de",
  },
  {
    id: "run-4", videoUrl: "https://www.youtube.com/watch?v=6sD9vW2mPjE",
    rank: 4, time: "05:44", userName: "Noir", userHandle: "@noir_ee",
    title: "High cost Yelan speed route / PC+PC",
    party: ["Yelan", "Furina", "Xilonen", "Sayu"],
    platform: "PC+PC", version: "5.7", bracket: "High", ruleset: "PUA",
    posted: "2週間前", charCost: 9, weaponCost: 5,
    tags: ["High", "PC+PC", "高速処理", "2人マルチ"], accent: "#0866c0",
  },
];

function getYouTubeVideoId(url) {
  try {
    const p = new URL(url);
    const host = p.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return p.pathname.slice(1) || null;
    if (host.endsWith("youtube.com")) return p.searchParams.get("v");
    return null;
  } catch { return null; }
}
function getYouTubeThumbnailUrl(url) {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

function IconCheck() {
  return <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m5 12 4 4L19 6"/></svg>;
}
function IconPlus() {
  return <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
}
function IconPlay() {
  return <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor"><path d="M8 5v14l11-7L8 5Z" stroke="none"/></svg>;
}
function IconBookmark({ filled }) {
  return filled
    ? <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M7 4h10a1 1 0 0 1 1 1v16l-6-3.5L6 21V5a1 1 0 0 1 1-1Z" stroke="none"/></svg>
    : <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 4h10a1 1 0 0 1 1 1v16l-6-3.5L6 21V5a1 1 0 0 1 1-1Z"/></svg>;
}

function CharCircle({ id, size = 30, accent }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      overflow: "hidden", flexShrink: 0, position: "relative",
      border: "1.5px solid rgba(255,255,255,0.11)",
      background: accent + "22",
    }}>
      {charImg[id] && (
        <img src={charImg[id]} alt={id} referrerPolicy="no-referrer"
          style={{
            position: "absolute",
            width: "165%", height: "165%",
            objectFit: "cover",
            top: "-16%", left: "-30%",
            objectPosition: "center 10%",
          }}
        />
      )}
    </div>
  );
}

function ActionBtn({ children, active, accent, disabled, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 4,
        fontSize: 11, fontWeight: 800,
        color: disabled ? "rgba(255,255,255,0.18)" : active ? accent : hov ? "#fff" : "rgba(255,255,255,0.44)",
        background: "none", border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 0, transition: "color 0.14s",
      }}
    >
      {children}
    </button>
  );
}

export function RecordCard({ run, isCandidate, isWatch, limit, onCompare, onWatch, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const thumbnail = getYouTubeThumbnailUrl(run.videoUrl);

  const shadow = isCandidate
    ? `0 0 0 2px ${run.accent}, 0 8px 28px ${run.accent}2e`
    : hovered
    ? `0 14px 36px ${run.accent}26, 0 4px 14px rgba(0,0,0,0.55)`
    : "0 1px 4px rgba(0,0,0,0.6)";

  return (
    <article
      onClick={onOpen}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column",
        overflow: "hidden", cursor: "pointer", background: "#111116",
        boxShadow: shadow,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: 3, background: run.accent, zIndex: 10,
      }} />

      {/* Thumbnail */}
      <div style={{ position: "relative", height: 160, marginLeft: 3, overflow: "hidden", background: "#0a0a12" }}>
        {thumbnail && (
          <img src={thumbnail} alt="" referrerPolicy="no-referrer"
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", filter: "brightness(0.76) saturate(0.88)",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        )}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.1) 40%, rgba(17,17,22,0.97) 100%)",
        }} />

        <div style={{
          position: "absolute", top: 9, left: 9,
          display: "flex", alignItems: "center", gap: 3,
          padding: "3px 7px", background: "rgba(0,0,0,0.74)",
          fontSize: 9, fontWeight: 900, letterSpacing: "0.09em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.72)",
        }}>
          <IconPlay /> YouTube
        </div>

        <div style={{
          position: "absolute", top: 9, right: 9,
          padding: "3px 7px", background: run.accent,
          fontSize: 9, fontWeight: 900, letterSpacing: "0.14em",
          textTransform: "uppercase", color: "#fff",
        }}>
          {run.bracket}
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 10px 8px 10px",
          display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.36)", textTransform: "uppercase",
          }}>
            #{run.rank} · {run.posted}
          </span>
          <span style={{
            fontFamily: "Impact, 'Arial Narrow', 'Haettenschweiler', sans-serif",
            fontSize: 42, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em",
            textShadow: "0 2px 12px rgba(0,0,0,0.9)",
          }}>
            {run.time}
          </span>
        </div>
      </div>

      {/* Info section — characters live here, no dedicated strip */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 9,
        padding: "11px 11px 10px 11px", marginLeft: 3,
        background: "#111116", flex: 1,
      }}>

        {/* ── Identity row: chars + separator + name + badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {/* Overlapping portrait circles */}
          <div style={{ display: "flex", flexShrink: 0 }}>
            {run.party.map((id, i) => (
              <div key={id} style={{ marginLeft: i === 0 ? 0 : -9, zIndex: run.party.length - i }}>
                <CharCircle id={id} size={30} accent={run.accent} />
              </div>
            ))}
          </div>

          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          <span style={{
            fontSize: 13, fontWeight: 800, color: "#fff",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1,
          }}>
            {run.userName}
          </span>

          <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
            {[run.platform, run.ruleset].map((v) => (
              <span key={v} style={{
                fontSize: 9, fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.42)",
                border: "1px solid rgba(255,255,255,0.09)",
                padding: "2px 5px",
              }}>
                {v}
              </span>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Title */}
        <p style={{
          margin: 0, fontSize: 12, fontWeight: 600, lineHeight: 1.45,
          color: "rgba(217,217,217,0.86)",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {run.title}
        </p>

        {/* Cost + version strip */}
        <div style={{
          display: "flex", gap: 5, alignItems: "center",
          padding: "5px 8px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}>
          {[["Char", run.charCost], ["Weapon", run.weaponCost], ["Ver", run.version]].map(([label, val], i) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ width: 1, height: 9, background: "rgba(255,255,255,0.09)" }} />}
              <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.26)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
              <span style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.78)" }}>{val}</span>
            </span>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {run.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{
              fontSize: 10, fontWeight: 700,
              color: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.05)",
              padding: "2px 7px",
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          paddingTop: 8, marginTop: "auto",
        }}>
          <ActionBtn disabled={limit && !isCandidate} active={isCandidate} accent={run.accent}
            onClick={(e) => { e.stopPropagation(); onCompare(); }}>
            {isCandidate ? <IconCheck /> : <IconPlus />}
            {isCandidate ? "追加済み" : limit ? "2件まで" : "比較に追加"}
          </ActionBtn>
          <ActionBtn active={isWatch} accent={run.accent}
            onClick={(e) => { e.stopPropagation(); onWatch(); }}>
            <IconBookmark filled={isWatch} />
            {isWatch ? "保存済み" : "あとで見る"}
          </ActionBtn>
        </div>
      </div>
    </article>
  );
}

export default function Demo() {
  const [compareIds, setCompareIds] = useState([]);
  const [watchIds, setWatchIds] = useState([]);
  const toggleCompare = (id) =>
    setCompareIds((p) => p.includes(id) ? p.filter((x) => x !== id) : p.length >= 2 ? p : [...p, id]);
  const toggleWatch = (id) =>
    setWatchIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [id, ...p]);

  return (
    <div style={{ background: "#EDECEC", padding: "20px 16px", minHeight: "100vh", fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase", color: "#888" }}>
          最近の投稿 — {runs.length}件
        </span>
        {compareIds.length > 0 && (
          <span style={{ fontSize: 11, fontWeight: 800, color: "#333", background: "#fff", padding: "4px 10px", border: "1px solid #ddd" }}>
            比較候補 {compareIds.length}/2件
          </span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))", gap: 14 }}>
        {runs.map((run) => (
          <RecordCard key={run.id} run={run}
            isCandidate={compareIds.includes(run.id)}
            isWatch={watchIds.includes(run.id)}
            limit={compareIds.length >= 2}
            onCompare={() => toggleCompare(run.id)}
            onWatch={() => toggleWatch(run.id)}
            onOpen={() => {}}
          />
        ))}
      </div>
    </div>
  );
}