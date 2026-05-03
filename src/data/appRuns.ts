import { defaultRunId, mockRuns, type RunRecord } from "./mockRuns";

const highPlayerBlockTestRun: RunRecord = {
  id: "run-high-playerblock-test",
  title: "Chiori/Xilonen 28:52",
  userName: "Rundum",
  userHandle: "@rundum_test",
  postedLabel: "2日前",
  date: "2026-03-12",
  season: "6.1",
  versionLabel: "6.1",
  ruleset: "高難度",
  platform: "PC",
  region: "Asia",
  time: "28:52",
  videoUrl: "https://www.youtube.com/watch?v=8yGn2O9yVi4",
  summary:
    "High 階級の UI 確認用デモ記録です。プレイヤーブロックのモックに近い Chiori / Xilonen / Xianyun / Chasca 編成で、階級算出が High になるように凸数と武器コストを調整しています。",
  tags: ["高難度", "High", "Chiori", "Xilonen", "Xianyun", "Chasca", "PC"],
  likeCount: 29,
  shareCount: 4,
  mainAttackerId: "chasca",
  declaredMainAttackerIds: ["chasca", "chiori"],
  party: [
    { characterId: "chiori", cons: 0 },
    { characterId: "xilonen", cons: 2 },
    { characterId: "xianyun", cons: 0 },
    { characterId: "chasca", cons: 6 },
  ],
  weapons: [
    { weaponId: "urakuMisugiri", refine: 1 },
    { weaponId: "peakPatrol", refine: 1 },
    { weaponId: "craneSEchoingCall", refine: 1 },
    { weaponId: "favoniusWarbow", refine: 5 },
  ],
  comments: [],
  charCost: 12,
  weaponCost: 3,
  totalCost: 15,
  bracket: 3,
};

export const appRuns: RunRecord[] = [...mockRuns, highPlayerBlockTestRun];
export const defaultAppRunId = defaultRunId;

export function getAppRunById(runId: string) {
  return appRuns.find((run) => run.id === runId);
}
