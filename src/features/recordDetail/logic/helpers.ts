import type { RunRecord } from "../../../data/mockRuns";
import { characterDb, weaponDb } from "../../../data/mockRuns";

import type { PartyBuildItem } from "../types";

export function postYouTubeCommand(iframe: HTMLIFrameElement | null, command: "playVideo" | "pauseVideo") {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({
      event: "command",
      func: command,
      args: [],
    }),
    "https://www.youtube.com",
  );
}

export function getInitials(label: string) {
  return label.slice(0, 2).toUpperCase();
}

export function getPartyBuildItems(run: RunRecord): PartyBuildItem[] {
  return run.party.map((member, index) => {
    const character = characterDb[member.characterId];
    const weaponLoadout = run.weapons[index];
    const weapon = weaponDb[weaponLoadout.weaponId];

    return {
      slot: index + 1,
      characterId: member.characterId,
      characterName: character?.name ?? member.characterId,
      cons: member.cons,
      weaponName: weapon?.name ?? weaponLoadout.weaponId,
      refine: weaponLoadout.refine,
      isMainAttacker: member.characterId === run.mainAttackerId,
    };
  });
}

export function parsePlatformTag(tag: string): RunRecord["platform"][] | null {
  const parts = tag.replace(/\s/g, "").split("+");

  if (parts.length === 0) {
    return null;
  }

  if (parts.every((part) => part === "PC" || part === "PS5" || part === "Mobile")) {
    return parts as RunRecord["platform"][];
  }

  return null;
}