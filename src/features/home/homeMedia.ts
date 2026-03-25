const AMBR_NAME_MAP: Record<string, string> = {
  amber: "Ambor",
  bennett: "Bennett",
  chasca: "Chasca",
  chiori: "Chiori",
  citlali: "Citlali",
  collei: "Collei",
  dehya: "Dehya",
  furina: "Furina",
  keqing: "Keqing",
  mav: "Mavuika",
  neuvillette: "Neuvillette",
  sayu: "Sayu",
  wanderer: "Wanderer",
  xianyun: "Xianyun",
  xiangling: "Xiangling",
  xilonen: "Xilonen",
  xingqiu: "Xingqiu",
  yelan: "Yelan",
  zhongli: "Zhongli",
};

const UI_MIRRORS = [
  "https://api.ambr.top/assets/UI/",
  "https://enka.network/ui/",
  "http://file.microgg.cn/ui/",
] as const;

const IMAGE_PATTERNS = {
  portrait: (name: string) => `UI_Gacha_AvatarImg_${name}.png`,
  icon: (name: string) => `UI_AvatarIcon_${name}.png`,
  circle: (name: string) => `UI_AvatarIcon_${name}_Circle.png`,
  side: (name: string) => `UI_AvatarIcon_Side_${name}.png`,
};

const VARIANT_FALLBACKS = {
  circle: ["circle", "icon"],
  side: ["side", "icon"],
  portrait: ["portrait", "icon"],
  icon: ["icon"],
} as const;

export type CharacterImageVariant = keyof typeof VARIANT_FALLBACKS;

function getAmbrName(characterId: string) {
  return AMBR_NAME_MAP[characterId] ?? "Traveler";
}

export function getCharacterImageCandidates(characterId: string, variant: CharacterImageVariant) {
  const ambrName = getAmbrName(characterId);
  const chain = VARIANT_FALLBACKS[variant] ?? VARIANT_FALLBACKS.portrait;
  const urls: string[] = [];

  chain.forEach((currentVariant) => {
    const pattern = IMAGE_PATTERNS[currentVariant];
    UI_MIRRORS.forEach((base) => {
      urls.push(`${base}${pattern(ambrName)}`);
    });
  });

  return urls;
}
