import { useState } from "react";

import { fetchEnkaProfile, isValidEnkaUid, normalizeEnkaUidInput, type EnkaProfile, type EnkaProfileCharacter } from "../../../lib/enkaNetwork";

import {
  clearUidSelectedCharacter,
  getInitialUidSelectedCharacterIds,
  getResolvedUidSelectedCharacterIds,
  selectUidCharacter,
} from "../logic";
import type { SubmitPartySlot } from "../types";

export function useUidImport({ clearErrors }: { clearErrors: (prefixes: string[]) => void }) {
  const [showUidModal, setShowUidModal] = useState(false);
  const [uidProfile, setUidProfile] = useState<EnkaProfile | null>(null);
  const [uidLoading, setUidLoading] = useState(false);
  const [uidError, setUidError] = useState("");
  const [uidSelectedCharacterIds, setUidSelectedCharacterIds] = useState<string[]>([]);

  const openUidModal = (party: SubmitPartySlot[]) => {
    setUidSelectedCharacterIds(getInitialUidSelectedCharacterIds(party));
    setUidError("");
    setShowUidModal(true);
  };

  const closeUidModal = () => {
    setShowUidModal(false);
  };

  const handleFetchUid = async (uid: string, party: SubmitPartySlot[]) => {
    const normalizedUid = normalizeEnkaUidInput(uid);

    if (!isValidEnkaUid(normalizedUid)) {
      setUidError("UIDは9桁の数字で入力してください。");
      return;
    }

    setUidLoading(true);
    setUidError("");

    try {
      const profile = await fetchEnkaProfile(normalizedUid);
      const supportedCharacters = profile.characters.filter((character) => character.supported && character.characterId);

      setUidProfile(profile);
      setUidSelectedCharacterIds((currentSelectedIds) =>
        getResolvedUidSelectedCharacterIds(currentSelectedIds, profile, party),
      );

      if (profile.characters.length === 0) {
        setUidError("公開プロフィールに表示中のキャラクターが見つかりませんでした。Enka.Network 側の公開設定を確認してください。");
      } else if (supportedCharacters.length === 0) {
        setUidError("プロフィールは取得できましたが、このプロトタイプで対応しているキャラクターが見つかりませんでした。");
      }
    } catch (error) {
      setUidProfile(null);
      setUidError(error instanceof Error ? error.message : "プロフィール取得に失敗しました。");
    } finally {
      setUidLoading(false);
    }
  };

  const handleUidSearchSubmit = (uid: string, party: SubmitPartySlot[], event?: { preventDefault: () => void }) => {
    event?.preventDefault();
    openUidModal(party);
    void handleFetchUid(uid, party);
  };

  const handleUidSelectCharacter = (character: EnkaProfileCharacter) => {
    setUidSelectedCharacterIds((currentSelectedIds) => selectUidCharacter(currentSelectedIds, character));
  };

  const handleUidClearSlot = (index: number) => {
    setUidSelectedCharacterIds((currentSelectedIds) => clearUidSelectedCharacter(currentSelectedIds, index));
  };

  const handleUidApply = (applyParty: (profile: EnkaProfile, selectedCharacterIds: string[]) => void) => {
    if (!uidProfile) {
      return;
    }

    applyParty(uidProfile, uidSelectedCharacterIds);
    clearErrors(["party."]);
    closeUidModal();
  };

  return {
    closeUidModal,
    handleFetchUid,
    handleUidApply,
    handleUidClearSlot,
    handleUidSearchSubmit,
    handleUidSelectCharacter,
    openUidModal,
    setUidError,
    showUidModal,
    uidError,
    uidLoading,
    uidProfile,
    uidSelectedCharacterIds,
  };
}
