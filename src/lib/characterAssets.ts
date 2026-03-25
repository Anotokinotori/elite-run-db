export const ENKA_UI_BASE = "https://enka.network/ui" as const;

export type WeaponTypeCode = "01" | "02" | "03" | "04" | "05";
export type ElementTag = "Fire" | "Water" | "Wind" | "Electric" | "Ice" | "Rock" | "Grass";
export type WeaponTag = "Bow" | "Catalyst" | "Claymore" | "Sword" | "Pole";
export type RegionTag =
  | "Mondstadt"
  | "Liyue"
  | "Inazuma"
  | "Sumeru"
  | "Fontaine"
  | "Natlan"
  | "NodKrai"
  | "Fatui"
  | "Abyss"
  | "Other";

export type CharacterAssetPreset = {
  version: string;
  displayName: string;
  internalName: string;
  tcgName: string;
  elementTag: ElementTag;
  weaponTag: WeaponTag;
  regionTag: RegionTag;
  weaponTypeCode: WeaponTypeCode;
  gachaIconFallbackNames?: string[];
  gachaIconFallbackFiles?: string[];
};

export const CHARACTER_ASSET_PRESETS = {
  venti: { version: "1.0", displayName: "Venti", internalName: "Venti", tcgName: "Venti", elementTag: "Wind", weaponTag: "Bow", regionTag: "Mondstadt", weaponTypeCode: "01" },
  diluc: { version: "1.0", displayName: "Diluc", internalName: "Diluc", tcgName: "Diluc", elementTag: "Fire", weaponTag: "Claymore", regionTag: "Mondstadt", weaponTypeCode: "03" },
  jean: { version: "1.0", displayName: "Jean", internalName: "Qin", tcgName: "Jean", elementTag: "Wind", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  keqing: { version: "1.0", displayName: "Keqing", internalName: "Keqing", tcgName: "Keqing", elementTag: "Electric", weaponTag: "Sword", regionTag: "Liyue", weaponTypeCode: "04" },
  mona: { version: "1.0", displayName: "Mona", internalName: "Mona", tcgName: "Mona", elementTag: "Water", weaponTag: "Catalyst", regionTag: "Mondstadt", weaponTypeCode: "02" },
  qiqi: { version: "1.0", displayName: "Qiqi", internalName: "Qiqi", tcgName: "Qiqi", elementTag: "Ice", weaponTag: "Sword", regionTag: "Liyue", weaponTypeCode: "04" },
  amber: { version: "1.0", displayName: "Amber", internalName: "Ambor", tcgName: "Amber", elementTag: "Fire", weaponTag: "Bow", regionTag: "Mondstadt", weaponTypeCode: "01" },
  kaeya: { version: "1.0", displayName: "Kaeya", internalName: "Kaeya", tcgName: "Kaeya", elementTag: "Ice", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  lisa: { version: "1.0", displayName: "Lisa", internalName: "Lisa", tcgName: "Lisa", elementTag: "Electric", weaponTag: "Catalyst", regionTag: "Mondstadt", weaponTypeCode: "02" },
  barbara: { version: "1.0", displayName: "Barbara", internalName: "Barbara", tcgName: "Barbara", elementTag: "Water", weaponTag: "Catalyst", regionTag: "Mondstadt", weaponTypeCode: "02" },
  beidou: { version: "1.0", displayName: "Beidou", internalName: "Beidou", tcgName: "Beidou", elementTag: "Electric", weaponTag: "Claymore", regionTag: "Liyue", weaponTypeCode: "03" },
  bennett: { version: "1.0", displayName: "Bennett", internalName: "Bennett", tcgName: "Bennett", elementTag: "Fire", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  chongyun: { version: "1.0", displayName: "Chongyun", internalName: "Chongyun", tcgName: "Chongyun", elementTag: "Ice", weaponTag: "Claymore", regionTag: "Liyue", weaponTypeCode: "03" },
  fischl: { version: "1.0", displayName: "Fischl", internalName: "Fischl", tcgName: "Fischl", elementTag: "Electric", weaponTag: "Bow", regionTag: "Mondstadt", weaponTypeCode: "01" },
  ningguang: { version: "1.0", displayName: "Ningguang", internalName: "Ningguang", tcgName: "Ningguang", elementTag: "Rock", weaponTag: "Catalyst", regionTag: "Liyue", weaponTypeCode: "02" },
  noelle: { version: "1.0", displayName: "Noelle", internalName: "Noel", tcgName: "Noelle", elementTag: "Rock", weaponTag: "Claymore", regionTag: "Mondstadt", weaponTypeCode: "03" },
  razor: { version: "1.0", displayName: "Razor", internalName: "Razor", tcgName: "Razor", elementTag: "Electric", weaponTag: "Claymore", regionTag: "Mondstadt", weaponTypeCode: "03" },
  sucrose: { version: "1.0", displayName: "Sucrose", internalName: "Sucrose", tcgName: "Sucrose", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Mondstadt", weaponTypeCode: "02" },
  xiangling: { version: "1.0", displayName: "Xiangling", internalName: "Xiangling", tcgName: "Xiangling", elementTag: "Fire", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  xingqiu: { version: "1.0", displayName: "Xingqiu", internalName: "Xingqiu", tcgName: "Xingqiu", elementTag: "Water", weaponTag: "Sword", regionTag: "Liyue", weaponTypeCode: "04" },
  tartaglia: { version: "1.1", displayName: "Tartaglia", internalName: "Tartaglia", tcgName: "Tartaglia", elementTag: "Water", weaponTag: "Bow", regionTag: "Fatui", weaponTypeCode: "01" },
  zhongli: { version: "1.1", displayName: "Zhongli", internalName: "Zhongli", tcgName: "Zhongli", elementTag: "Rock", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  diona: { version: "1.1", displayName: "Diona", internalName: "Diona", tcgName: "Diona", elementTag: "Ice", weaponTag: "Bow", regionTag: "Mondstadt", weaponTypeCode: "01" },
  xinyan: { version: "1.1", displayName: "Xinyan", internalName: "Xinyan", tcgName: "Xinyan", elementTag: "Fire", weaponTag: "Claymore", regionTag: "Liyue", weaponTypeCode: "03" },
  albedo: { version: "1.2", displayName: "Albedo", internalName: "Albedo", tcgName: "Albedo", elementTag: "Rock", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  ganyu: { version: "1.2", displayName: "Ganyu", internalName: "Ganyu", tcgName: "Ganyu", elementTag: "Ice", weaponTag: "Bow", regionTag: "Liyue", weaponTypeCode: "01" },
  xiao: { version: "1.3", displayName: "Xiao", internalName: "Xiao", tcgName: "Xiao", elementTag: "Wind", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  hutao: { version: "1.3", displayName: "Hu Tao", internalName: "Hutao", tcgName: "HuTao", elementTag: "Fire", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  rosaria: { version: "1.4", displayName: "Rosaria", internalName: "Rosaria", tcgName: "Rosaria", elementTag: "Ice", weaponTag: "Pole", regionTag: "Mondstadt", weaponTypeCode: "05" },
  eula: { version: "1.5", displayName: "Eula", internalName: "Eula", tcgName: "Eula", elementTag: "Ice", weaponTag: "Claymore", regionTag: "Mondstadt", weaponTypeCode: "03" },
  yanfei: { version: "1.5", displayName: "Yanfei", internalName: "Feiyan", tcgName: "Yanfei", elementTag: "Fire", weaponTag: "Catalyst", regionTag: "Liyue", weaponTypeCode: "02" },
  kaedeharakazuha: { version: "1.6", displayName: "Kaedehara Kazuha", internalName: "Kazuha", tcgName: "KaedeharaKazuha", elementTag: "Wind", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  kamisatoayaka: { version: "2.0", displayName: "Kamisato Ayaka", internalName: "Ayaka", tcgName: "KamisatoAyaka", elementTag: "Ice", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  yoimiya: { version: "2.0", displayName: "Yoimiya", internalName: "Yoimiya", tcgName: "Yoimiya", elementTag: "Fire", weaponTag: "Bow", regionTag: "Inazuma", weaponTypeCode: "01" },
  sayu: { version: "2.0", displayName: "Sayu", internalName: "Sayu", tcgName: "Sayu", elementTag: "Wind", weaponTag: "Claymore", regionTag: "Inazuma", weaponTypeCode: "03" },
  raidenshogun: { version: "2.1", displayName: "Raiden Shogun", internalName: "Shougun", tcgName: "RaidenShogun", elementTag: "Electric", weaponTag: "Pole", regionTag: "Inazuma", weaponTypeCode: "05" },
  kujousara: { version: "2.1", displayName: "Kujou Sara", internalName: "Sara", tcgName: "KujouSara", elementTag: "Electric", weaponTag: "Bow", regionTag: "Inazuma", weaponTypeCode: "01" },
  sangonomiyakokomi: { version: "2.1", displayName: "Sangonomiya Kokomi", internalName: "Kokomi", tcgName: "SangonomiyaKokomi", elementTag: "Water", weaponTag: "Catalyst", regionTag: "Inazuma", weaponTypeCode: "02" },
  aloy: { version: "2.1", displayName: "Aloy", internalName: "Aloy", tcgName: "Aloy", elementTag: "Ice", weaponTag: "Bow", regionTag: "Other", weaponTypeCode: "01" },
  thoma: { version: "2.2", displayName: "Thoma", internalName: "Tohma", tcgName: "Thoma", elementTag: "Fire", weaponTag: "Pole", regionTag: "Inazuma", weaponTypeCode: "05" },
  aratakiitto: { version: "2.3", displayName: "Arataki Itto", internalName: "Itto", tcgName: "AratakiItto", elementTag: "Rock", weaponTag: "Claymore", regionTag: "Inazuma", weaponTypeCode: "03" },
  gorou: { version: "2.3", displayName: "Gorou", internalName: "Gorou", tcgName: "Gorou", elementTag: "Rock", weaponTag: "Bow", regionTag: "Inazuma", weaponTypeCode: "01" },
  shenhe: { version: "2.4", displayName: "Shenhe", internalName: "Shenhe", tcgName: "Shenhe", elementTag: "Ice", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  yunjin: { version: "2.4", displayName: "Yun Jin", internalName: "Yunjin", tcgName: "YunJin", elementTag: "Rock", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  yaemiko: { version: "2.5", displayName: "Yae Miko", internalName: "Yae", tcgName: "YaeMiko", elementTag: "Electric", weaponTag: "Catalyst", regionTag: "Inazuma", weaponTypeCode: "02" },
  kamisatoayato: { version: "2.6", displayName: "Kamisato Ayato", internalName: "Ayato", tcgName: "KamisatoAyato", elementTag: "Water", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  yelan: { version: "2.7", displayName: "Yelan", internalName: "Yelan", tcgName: "Yelan", elementTag: "Water", weaponTag: "Bow", regionTag: "Liyue", weaponTypeCode: "01" },
  kukishinobu: { version: "2.7", displayName: "Kuki Shinobu", internalName: "Shinobu", tcgName: "KukiShinobu", elementTag: "Electric", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  shikanoinheizou: { version: "2.8", displayName: "Shikanoin Heizou", internalName: "Heizo", tcgName: "ShikanoinHeizou", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Inazuma", weaponTypeCode: "02" },
  tighnari: { version: "3.0", displayName: "Tighnari", internalName: "Tighnari", tcgName: "Tighnari", elementTag: "Grass", weaponTag: "Bow", regionTag: "Sumeru", weaponTypeCode: "01" },
  collei: { version: "3.0", displayName: "Collei", internalName: "Collei", tcgName: "Collei", elementTag: "Grass", weaponTag: "Bow", regionTag: "Sumeru", weaponTypeCode: "01" },
  dori: { version: "3.0", displayName: "Dori", internalName: "Dori", tcgName: "Dori", elementTag: "Electric", weaponTag: "Claymore", regionTag: "Sumeru", weaponTypeCode: "03" },
  cyno: { version: "3.1", displayName: "Cyno", internalName: "Cyno", tcgName: "Cyno", elementTag: "Electric", weaponTag: "Pole", regionTag: "Sumeru", weaponTypeCode: "05" },
  candace: { version: "3.1", displayName: "Candace", internalName: "Candace", tcgName: "Candace", elementTag: "Water", weaponTag: "Pole", regionTag: "Sumeru", weaponTypeCode: "05" },
  nilou: { version: "3.1", displayName: "Nilou", internalName: "Nilou", tcgName: "Nilou", elementTag: "Water", weaponTag: "Sword", regionTag: "Sumeru", weaponTypeCode: "04" },
  nahida: { version: "3.2", displayName: "Nahida", internalName: "Nahida", tcgName: "Nahida", elementTag: "Grass", weaponTag: "Catalyst", regionTag: "Sumeru", weaponTypeCode: "02" },
  layla: { version: "3.2", displayName: "Layla", internalName: "Layla", tcgName: "Layla", elementTag: "Ice", weaponTag: "Sword", regionTag: "Sumeru", weaponTypeCode: "04" },
  wanderer: { version: "3.3", displayName: "Wanderer", internalName: "Wanderer", tcgName: "Wanderer", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Sumeru", weaponTypeCode: "02" },
  faruzan: { version: "3.3", displayName: "Faruzan", internalName: "Faruzan", tcgName: "Faruzan", elementTag: "Wind", weaponTag: "Bow", regionTag: "Sumeru", weaponTypeCode: "01" },
  alhaitham: { version: "3.4", displayName: "Alhaitham", internalName: "Alhatham", tcgName: "Alhaitham", elementTag: "Grass", weaponTag: "Sword", regionTag: "Sumeru", weaponTypeCode: "04" },
  yaoyao: { version: "3.4", displayName: "Yaoyao", internalName: "Yaoyao", tcgName: "Yaoyao", elementTag: "Grass", weaponTag: "Pole", regionTag: "Liyue", weaponTypeCode: "05" },
  dehya: { version: "3.5", displayName: "Dehya", internalName: "Dehya", tcgName: "Dehya", elementTag: "Fire", weaponTag: "Claymore", regionTag: "Sumeru", weaponTypeCode: "03" },
  mika: { version: "3.5", displayName: "Mika", internalName: "Mika", tcgName: "Mika", elementTag: "Ice", weaponTag: "Pole", regionTag: "Mondstadt", weaponTypeCode: "05" },
  baizhu: { version: "3.6", displayName: "Baizhu", internalName: "Baizhuer", tcgName: "Baizhu", elementTag: "Grass", weaponTag: "Catalyst", regionTag: "Liyue", weaponTypeCode: "02" },
  kaveh: { version: "3.6", displayName: "Kaveh", internalName: "Kaveh", tcgName: "Kaveh", elementTag: "Grass", weaponTag: "Claymore", regionTag: "Sumeru", weaponTypeCode: "03" },
  kirara: { version: "3.7", displayName: "Kirara", internalName: "Momoka", tcgName: "Kirara", elementTag: "Grass", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  lyney: { version: "4.0", displayName: "Lyney", internalName: "Liney", tcgName: "Lyney", elementTag: "Fire", weaponTag: "Bow", regionTag: "Fontaine", weaponTypeCode: "01" },
  lynette: { version: "4.0", displayName: "Lynette", internalName: "Linette", tcgName: "Lynette", elementTag: "Wind", weaponTag: "Sword", regionTag: "Fontaine", weaponTypeCode: "04" },
  freminet: { version: "4.0", displayName: "Freminet", internalName: "Freminet", tcgName: "Freminet", elementTag: "Ice", weaponTag: "Claymore", regionTag: "Fontaine", weaponTypeCode: "03" },
  neuvillette: { version: "4.1", displayName: "Neuvillette", internalName: "Neuvillette", tcgName: "Neuvillette", elementTag: "Water", weaponTag: "Catalyst", regionTag: "Fontaine", weaponTypeCode: "02" },
  wriothesley: { version: "4.1", displayName: "Wriothesley", internalName: "Wriothesley", tcgName: "Wriothesley", elementTag: "Ice", weaponTag: "Catalyst", regionTag: "Fontaine", weaponTypeCode: "02" },
  furina: { version: "4.2", displayName: "Furina", internalName: "Furina", tcgName: "Furina", elementTag: "Water", weaponTag: "Sword", regionTag: "Fontaine", weaponTypeCode: "04" },
  charlotte: { version: "4.2", displayName: "Charlotte", internalName: "Charlotte", tcgName: "Charlotte", elementTag: "Ice", weaponTag: "Catalyst", regionTag: "Fontaine", weaponTypeCode: "02" },
  navia: { version: "4.3", displayName: "Navia", internalName: "Navia", tcgName: "Navia", elementTag: "Rock", weaponTag: "Claymore", regionTag: "Fontaine", weaponTypeCode: "03" },
  chevreuse: { version: "4.3", displayName: "Chevreuse", internalName: "Chevreuse", tcgName: "Chevreuse", elementTag: "Fire", weaponTag: "Pole", regionTag: "Fontaine", weaponTypeCode: "05" },
  xianyun: { version: "4.4", displayName: "Xianyun", internalName: "Liuyun", tcgName: "Xianyun", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Liyue", weaponTypeCode: "02" },
  gaming: { version: "4.4", displayName: "Gaming", internalName: "Gaming", tcgName: "Gaming", elementTag: "Fire", weaponTag: "Claymore", regionTag: "Liyue", weaponTypeCode: "03" },
  chiori: { version: "4.5", displayName: "Chiori", internalName: "Chiori", tcgName: "Chiori", elementTag: "Rock", weaponTag: "Sword", regionTag: "Inazuma", weaponTypeCode: "04" },
  arlecchino: { version: "4.6", displayName: "Arlecchino", internalName: "Arlecchino", tcgName: "Arlecchino", elementTag: "Fire", weaponTag: "Pole", regionTag: "Fontaine", weaponTypeCode: "05" },
  clorinde: { version: "4.7", displayName: "Clorinde", internalName: "Clorinde", tcgName: "Clorinde", elementTag: "Electric", weaponTag: "Sword", regionTag: "Fontaine", weaponTypeCode: "04" },
  sethos: { version: "4.7", displayName: "Sethos", internalName: "Sethos", tcgName: "Sethos", elementTag: "Electric", weaponTag: "Bow", regionTag: "Sumeru", weaponTypeCode: "01" },
  sigewinne: { version: "4.7", displayName: "Sigewinne", internalName: "Sigewinne", tcgName: "Sigewinne", elementTag: "Water", weaponTag: "Bow", regionTag: "Fontaine", weaponTypeCode: "01" },
  emilie: { version: "4.8", displayName: "Emilie", internalName: "Emilie", tcgName: "Emilie", elementTag: "Grass", weaponTag: "Pole", regionTag: "Fontaine", weaponTypeCode: "05" },
  mualani: { version: "5.0", displayName: "Mualani", internalName: "Mualani", tcgName: "Mualani", elementTag: "Water", weaponTag: "Catalyst", regionTag: "Natlan", weaponTypeCode: "02" },
  kinich: { version: "5.0", displayName: "Kinich", internalName: "Kinich", tcgName: "Kinich", elementTag: "Grass", weaponTag: "Claymore", regionTag: "Natlan", weaponTypeCode: "03" },
  kachina: { version: "5.0", displayName: "Kachina", internalName: "Kachina", tcgName: "Kachina", elementTag: "Rock", weaponTag: "Pole", regionTag: "Natlan", weaponTypeCode: "05" },
  xilonen: { version: "5.1", displayName: "Xilonen", internalName: "Xilonen", tcgName: "Xilonen", elementTag: "Rock", weaponTag: "Sword", regionTag: "Natlan", weaponTypeCode: "04" },
  chasca: { version: "5.2", displayName: "Chasca", internalName: "Chasca", tcgName: "Chasca", elementTag: "Wind", weaponTag: "Bow", regionTag: "Natlan", weaponTypeCode: "01" },
  ororon: { version: "5.2", displayName: "Ororon", internalName: "Olorun", tcgName: "Ororon", elementTag: "Electric", weaponTag: "Bow", regionTag: "Natlan", weaponTypeCode: "01" },
  mavuika: { version: "5.3", displayName: "Mavuika", internalName: "Mavuika", tcgName: "Mavuika", elementTag: "Fire", weaponTag: "Claymore", regionTag: "Natlan", weaponTypeCode: "03" },
  citlali: { version: "5.3", displayName: "Citlali", internalName: "Citlali", tcgName: "Citlali", elementTag: "Ice", weaponTag: "Catalyst", regionTag: "Natlan", weaponTypeCode: "02" },
  lanyan: { version: "5.3", displayName: "Lan Yan", internalName: "Lanyan", tcgName: "LanYan", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Liyue", weaponTypeCode: "02" },
  yumemizukimizuki: { version: "5.4", displayName: "Yumemizuki Mizuki", internalName: "Mizuki", tcgName: "Mizuki", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Inazuma", weaponTypeCode: "02" },
  varesa: { version: "5.5", displayName: "Varesa", internalName: "Varesa", tcgName: "Varesa", elementTag: "Electric", weaponTag: "Catalyst", regionTag: "Natlan", weaponTypeCode: "02" },
  iansan: { version: "5.5", displayName: "Iansan", internalName: "Iansan", tcgName: "Iansan", elementTag: "Electric", weaponTag: "Pole", regionTag: "Natlan", weaponTypeCode: "05" },
  escoffier: { version: "5.6", displayName: "Escoffier", internalName: "Escoffier", tcgName: "Escoffier", elementTag: "Ice", weaponTag: "Pole", regionTag: "Fontaine", weaponTypeCode: "05" },
  ifa: { version: "5.6", displayName: "Ifa", internalName: "Ifa", tcgName: "Ifa", elementTag: "Wind", weaponTag: "Catalyst", regionTag: "Natlan", weaponTypeCode: "02" },
  skirk: { version: "5.7", displayName: "Skirk", internalName: "SkirkNew", tcgName: "Skirk", elementTag: "Ice", weaponTag: "Sword", regionTag: "Abyss", weaponTypeCode: "04" },
  dahlia: { version: "5.7", displayName: "Dahlia", internalName: "Dahlia", tcgName: "Dahlia", elementTag: "Water", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  ineffa: { version: "5.8", displayName: "Ineffa", internalName: "Ineffa", tcgName: "Ineffa", elementTag: "Electric", weaponTag: "Pole", regionTag: "NodKrai", weaponTypeCode: "05" },
  lauma: { version: "6.0", displayName: "Lauma", internalName: "Lauma", tcgName: "Lauma", elementTag: "Grass", weaponTag: "Catalyst", regionTag: "NodKrai", weaponTypeCode: "02" },
  flins: { version: "6.0", displayName: "Flins", internalName: "Flins", tcgName: "Flins", elementTag: "Electric", weaponTag: "Pole", regionTag: "NodKrai", weaponTypeCode: "05" },
  aino: { version: "6.0", displayName: "Aino", internalName: "Aino", tcgName: "Aino", elementTag: "Water", weaponTag: "Claymore", regionTag: "NodKrai", weaponTypeCode: "03" },
  nefer: { version: "6.1", displayName: "Nefer", internalName: "Nefer", tcgName: "Nefer", elementTag: "Grass", weaponTag: "Catalyst", regionTag: "NodKrai", weaponTypeCode: "02" },
  durin: { version: "6.2", displayName: "Durin", internalName: "Durin", tcgName: "Durin", elementTag: "Fire", weaponTag: "Sword", regionTag: "Mondstadt", weaponTypeCode: "04" },
  jahoda: { version: "6.2", displayName: "Jahoda", internalName: "Jahoda", tcgName: "Jahoda", elementTag: "Wind", weaponTag: "Bow", regionTag: "NodKrai", weaponTypeCode: "01" },
  columbina: { version: "6.3", displayName: "Columbina", internalName: "Columbina", tcgName: "Columbina", elementTag: "Water", weaponTag: "Catalyst", regionTag: "NodKrai", weaponTypeCode: "02" },
  zibai: { version: "6.3", displayName: "Zibai", internalName: "Zibai", tcgName: "Zibai", elementTag: "Rock", weaponTag: "Sword", regionTag: "Liyue", weaponTypeCode: "04" },
  illuga: { version: "6.3", displayName: "Illuga", internalName: "Illuga", tcgName: "Illuga", elementTag: "Rock", weaponTag: "Pole", regionTag: "NodKrai", weaponTypeCode: "05" },
  varka: {
    version: "6.4",
    displayName: "Varka",
    internalName: "Varka",
    tcgName: "Varka",
    elementTag: "Wind",
    weaponTag: "Claymore",
    regionTag: "Mondstadt",
    weaponTypeCode: "03",
    gachaIconFallbackFiles: ["UI_Gacha_AvatarIcon_Varka", "UI_AvatarIcon_Varka", "UI_AvatarIcon_Varka_Card"],
  },
} as const satisfies Record<string, CharacterAssetPreset>;

export const PRESET_ORDER = [
  "venti", "diluc", "jean", "keqing", "mona", "qiqi", "amber", "kaeya", "lisa", "barbara", "beidou", "bennett", "chongyun", "fischl", "ningguang", "noelle", "razor", "sucrose", "xiangling", "xingqiu", "tartaglia", "zhongli", "diona", "xinyan", "albedo", "ganyu", "xiao", "hutao", "rosaria", "eula", "yanfei", "kaedeharakazuha", "kamisatoayaka", "yoimiya", "sayu", "raidenshogun", "kujousara", "sangonomiyakokomi", "aloy", "thoma", "aratakiitto", "gorou", "shenhe", "yunjin", "yaemiko", "kamisatoayato", "yelan", "kukishinobu", "shikanoinheizou", "tighnari", "collei", "dori", "cyno", "candace", "nilou", "nahida", "layla", "wanderer", "faruzan", "alhaitham", "yaoyao", "dehya", "mika", "baizhu", "kaveh", "kirara", "lyney", "lynette", "freminet", "neuvillette", "wriothesley", "furina", "charlotte", "navia", "chevreuse", "xianyun", "gaming", "chiori", "arlecchino", "clorinde", "sethos", "sigewinne", "emilie", "mualani", "kinich", "kachina", "xilonen", "chasca", "ororon", "mavuika", "citlali", "lanyan", "yumemizukimizuki", "varesa", "iansan", "escoffier", "ifa", "skirk", "dahlia", "ineffa", "lauma", "flins", "aino", "nefer", "durin", "jahoda", "columbina", "zibai", "illuga", "varka",
] as const;

export type CharacterPresetKey = keyof typeof CHARACTER_ASSET_PRESETS;
export type CharacterImageVariant = "portrait" | "icon" | "circle" | "side" | "card" | "gachaIcon";

export type CharacterAssetNames = {
  avatarIcon: string;
  avatarCard: string;
  avatarCircle: string;
  avatarSide: string;
  gachaImg: string;
  gachaIconCandidates: string[];
  normalAttack: string;
  elementalSkill: string;
  elementalBurst: string;
  talentIcons: string[];
  constellationIcons: string[];
  namecardIcon: string;
  namecardPic: string;
  namecardAlpha: string;
  tcgCard: string;
  tcgCardGolden: string;
  tcgCardHd: string;
  tcgAvatarIcon: string;
  tcgTalent: string;
  tcgTalentGolden: string;
  tcgTalentHd: string;
  tcgSummons: string[];
  tcgElementTag: string;
  tcgWeaponTag: string;
  tcgRegionTag: string;
  tcgElementBuff: string;
};

const CHARACTER_PRESET_KEY_ALIASES: Partial<Record<string, CharacterPresetKey>> = {
  mav: "mavuika",
};

const UI_MIRROR_BASES = [
  "https://api.ambr.top/assets/UI",
  ENKA_UI_BASE,
  "http://file.microgg.cn/ui",
] as const;

export function resolveCharacterPresetKey(characterId: string) {
  const normalizedId = characterId.trim().toLowerCase();

  if (!normalizedId) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(CHARACTER_ASSET_PRESETS, normalizedId)) {
    return normalizedId as CharacterPresetKey;
  }

  return CHARACTER_PRESET_KEY_ALIASES[normalizedId] ?? null;
}

export function getCharacterAssetNames(key: CharacterPresetKey): CharacterAssetNames {
  const preset: CharacterAssetPreset = CHARACTER_ASSET_PRESETS[key];

  return {
    avatarIcon: `UI_AvatarIcon_${preset.internalName}`,
    avatarCard: `UI_AvatarIcon_${preset.internalName}_Card`,
    avatarCircle: `UI_AvatarIcon_${preset.internalName}_Circle`,
    avatarSide: `UI_AvatarIcon_Side_${preset.internalName}`,
    gachaImg: `UI_Gacha_AvatarImg_${preset.internalName}`,
    gachaIconCandidates: preset.gachaIconFallbackNames ?? preset.gachaIconFallbackFiles ?? [`UI_Gacha_AvatarIcon_${preset.internalName}`],
    normalAttack: `Skill_A_${preset.weaponTypeCode}`,
    elementalSkill: `Skill_S_${preset.internalName}_01`,
    elementalBurst: `Skill_E_${preset.internalName}_01`,
    talentIcons: ["01", "02", "03", "04", "05", "06", "07"].map((id) => `UI_Talent_S_${preset.internalName}_${id}`),
    constellationIcons: ["01", "02", "03", "04", "05", "06"].map((id) => `UI_Talent_U_${preset.internalName}_${id}`),
    namecardIcon: `UI_NameCardIcon_${preset.internalName}`,
    namecardPic: `UI_NameCardPic_${preset.internalName}_P`,
    namecardAlpha: `UI_NameCardPic_${preset.internalName}_Alpha`,
    tcgCard: `UI_Gcg_CardFace_Char_Avatar_${preset.tcgName}`,
    tcgCardGolden: `UI_Gcg_CardFace_Char_Avatar_${preset.tcgName}_Golden`,
    tcgCardHd: `UI_Gcg_CardFace_Char_Avatar_${preset.tcgName}_HD`,
    tcgAvatarIcon: `UI_Gcg_Char_AvatarIcon_${preset.tcgName}`,
    tcgTalent: `UI_Gcg_CardFace_Modify_Talent_${preset.tcgName}`,
    tcgTalentGolden: `UI_Gcg_CardFace_Modify_Talent_${preset.tcgName}_Golden`,
    tcgTalentHd: `UI_Gcg_CardFace_Modify_Talent_${preset.tcgName}_HD`,
    tcgSummons: [1, 2, 3, 4, 5, 6].map((n) => `UI_Gcg_CardFace_Summon_${preset.tcgName}_${n}`),
    tcgElementTag: `UI_Gcg_Tag_Element_${preset.elementTag}`,
    tcgWeaponTag: `UI_Gcg_Tag_Weapon_${preset.weaponTag}`,
    tcgRegionTag: `UI_Gcg_Tag_Faction_${preset.regionTag}`,
    tcgElementBuff: `UI_Gcg_Buff_Common_Element_${preset.elementTag}`,
  };
}

export function getCharacterAssetNamesByCharacterId(characterId: string) {
  const presetKey = resolveCharacterPresetKey(characterId);
  return presetKey ? getCharacterAssetNames(presetKey) : null;
}

export function toEnkaUiUrl(assetName: string) {
  return `${ENKA_UI_BASE}/${assetName}.png`;
}

export function toEnkaUiUrls(assetNames: string[]) {
  return assetNames.map(toEnkaUiUrl);
}

function toMirroredUiUrls(assetNames: string[]) {
  const urls: string[] = [];
  const seenUrls = new Set<string>();

  assetNames.forEach((assetName) => {
    const canonicalUrl = toEnkaUiUrl(assetName);

    UI_MIRROR_BASES.forEach((baseUrl) => {
      const mirroredUrl = baseUrl === ENKA_UI_BASE ? canonicalUrl : canonicalUrl.replace(ENKA_UI_BASE, baseUrl);

      if (!seenUrls.has(mirroredUrl)) {
        seenUrls.add(mirroredUrl);
        urls.push(mirroredUrl);
      }
    });
  });

  return urls;
}

function getCharacterImageAssetNames(names: CharacterAssetNames, variant: CharacterImageVariant) {
  switch (variant) {
    case "circle":
      return [names.avatarCircle, names.avatarIcon];
    case "side":
      return [names.avatarSide, names.avatarIcon];
    case "card":
      return [names.avatarCard, names.avatarIcon];
    case "gachaIcon":
      return [...names.gachaIconCandidates];
    case "icon":
      return [names.avatarIcon];
    case "portrait":
    default:
      return [names.gachaImg, names.avatarIcon];
  }
}

export function getCharacterImageCandidates(characterId: string, variant: CharacterImageVariant) {
  const names = getCharacterAssetNamesByCharacterId(characterId);

  if (!names) {
    return [];
  }

  return toMirroredUiUrls(getCharacterImageAssetNames(names, variant));
}

export function getCharacterAssetUrls(key: CharacterPresetKey) {
  const names = getCharacterAssetNames(key);

  return {
    avatarIcon: toEnkaUiUrl(names.avatarIcon),
    avatarCard: toEnkaUiUrl(names.avatarCard),
    avatarCircle: toEnkaUiUrl(names.avatarCircle),
    avatarSide: toEnkaUiUrl(names.avatarSide),
    gachaImg: toEnkaUiUrl(names.gachaImg),
    gachaIconCandidates: toEnkaUiUrls(names.gachaIconCandidates),
    normalAttack: toEnkaUiUrl(names.normalAttack),
    elementalSkill: toEnkaUiUrl(names.elementalSkill),
    elementalBurst: toEnkaUiUrl(names.elementalBurst),
    talentIcons: toEnkaUiUrls(names.talentIcons),
    constellationIcons: toEnkaUiUrls(names.constellationIcons),
    namecardIcon: toEnkaUiUrl(names.namecardIcon),
    namecardPic: toEnkaUiUrl(names.namecardPic),
    namecardAlpha: toEnkaUiUrl(names.namecardAlpha),
    tcgCard: toEnkaUiUrl(names.tcgCard),
    tcgCardGolden: toEnkaUiUrl(names.tcgCardGolden),
    tcgCardHd: toEnkaUiUrl(names.tcgCardHd),
    tcgAvatarIcon: toEnkaUiUrl(names.tcgAvatarIcon),
    tcgTalent: toEnkaUiUrl(names.tcgTalent),
    tcgTalentGolden: toEnkaUiUrl(names.tcgTalentGolden),
    tcgTalentHd: toEnkaUiUrl(names.tcgTalentHd),
    tcgSummons: toEnkaUiUrls(names.tcgSummons),
    tcgElementTag: toEnkaUiUrl(names.tcgElementTag),
    tcgWeaponTag: toEnkaUiUrl(names.tcgWeaponTag),
    tcgRegionTag: toEnkaUiUrl(names.tcgRegionTag),
    tcgElementBuff: toEnkaUiUrl(names.tcgElementBuff),
  };
}

export function getCharacterAssetUrlsByCharacterId(characterId: string) {
  const presetKey = resolveCharacterPresetKey(characterId);
  return presetKey ? getCharacterAssetUrls(presetKey) : null;
}
