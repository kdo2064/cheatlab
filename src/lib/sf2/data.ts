export interface ItemDef {
  id: string;
  name: string;
  zone: string;
  maxUpgrade: number;
}

export const WEAPONS: ItemDef[] = [
  { id: "WEAPON_KNIVES",          name: "Knives",          zone: "Zone 1", maxUpgrade: 200 },
  { id: "WEAPON_NUNCHAKU",        name: "Nunchaku",         zone: "Zone 1", maxUpgrade: 200 },
  { id: "WEAPON_STAFF",           name: "Bo Staff",         zone: "Zone 1", maxUpgrade: 200 },
  { id: "WEAPON_SHURIKENS",       name: "Shurikens",        zone: "Zone 1", maxUpgrade: 200 },
  { id: "WEAPON_SAI",             name: "Sai",              zone: "Zone 1", maxUpgrade: 330 },
  { id: "WEAPON_KUSARIGAMA",      name: "Kusarigama",       zone: "Zone 2", maxUpgrade: 430 },
  { id: "WEAPON_STEEL_BATONS",    name: "Steel Batons",     zone: "Zone 2", maxUpgrade: 430 },
  { id: "WEAPON_TONFA",           name: "Tonfa",            zone: "Zone 2", maxUpgrade: 430 },
  { id: "WEAPON_MACHETE",         name: "Machete",          zone: "Zone 2", maxUpgrade: 520 },
  { id: "WEAPON_KATANA",          name: "Katana",           zone: "Zone 2", maxUpgrade: 520 },
  { id: "WEAPON_GLAIVE",          name: "Glaive",           zone: "Zone 3", maxUpgrade: 620 },
  { id: "WEAPON_DUAL_SWORDS",     name: "Dual Swords",      zone: "Zone 3", maxUpgrade: 620 },
  { id: "WEAPON_SICKLE",          name: "Sickle",           zone: "Zone 3", maxUpgrade: 620 },
  { id: "WEAPON_COMPOSITE_SWORD", name: "Composite Sword",  zone: "Zone 3", maxUpgrade: 620 },
  { id: "WEAPON_WAR_HAMMER",      name: "War Hammer",       zone: "Zone 3", maxUpgrade: 620 },
  { id: "WEAPON_DAGGERS",         name: "Daggers",          zone: "Zone 4", maxUpgrade: 720 },
  { id: "WEAPON_CRESCENT_KNIVES", name: "Crescent Knives",  zone: "Zone 4", maxUpgrade: 720 },
  { id: "WEAPON_CRESCENT_SWORD",  name: "Crescent Sword",   zone: "Zone 4", maxUpgrade: 720 },
  { id: "WEAPON_CELESTIAL_SWORD", name: "Celestial Sword",  zone: "Zone 4", maxUpgrade: 720 },
  { id: "WEAPON_SERRATED_SWORD",  name: "Serrated Sword",   zone: "Zone 4", maxUpgrade: 720 },
  { id: "WEAPON_BLADE_WHIP",      name: "Blade Whip",       zone: "Zone 5", maxUpgrade: 820 },
  { id: "WEAPON_GHOST_LANTERN",   name: "Ghost Lantern",    zone: "Zone 5", maxUpgrade: 820 },
  { id: "WEAPON_SCORCHING_CLAWS", name: "Scorching Claws",  zone: "Zone 5", maxUpgrade: 820 },
  { id: "WEAPON_JIAN",            name: "Jian",             zone: "Zone 6", maxUpgrade: 920 },
  { id: "WEAPON_ECLIPSE",         name: "Eclipse",          zone: "Zone 6", maxUpgrade: 920 },
  { id: "WEAPON_GLADIUS",         name: "Gladius",          zone: "Zone 6", maxUpgrade: 920 },
  { id: "WEAPON_KERIS",           name: "Keris",            zone: "Zone 6", maxUpgrade: 920 },
  { id: "WEAPON_KNUCKLES",        name: "Knuckles",         zone: "Ranged",  maxUpgrade: 200 },
  { id: "WEAPON_STEEL_NUNCHAKU",  name: "Steel Nunchaku",   zone: "Special", maxUpgrade: 999 },
  { id: "WEAPON_SWORDS",          name: "Swords",           zone: "Special", maxUpgrade: 999 },
];

export const ARMORS: ItemDef[] = [
  { id: "ARMOR_ROBE",         name: "Robe",           zone: "Zone 1", maxUpgrade: 200 },
  { id: "ARMOR_OLD_LEATHER",  name: "Old Leather",    zone: "Zone 1", maxUpgrade: 200 },
  { id: "ARMOR_LEATHER",      name: "Leather",        zone: "Zone 2", maxUpgrade: 430 },
  { id: "ARMOR_FOREIGN",      name: "Foreign Outfit", zone: "Zone 2", maxUpgrade: 430 },
  { id: "ARMOR_BARBARIAN",    name: "Barbarian",      zone: "Zone 3", maxUpgrade: 620 },
  { id: "ARMOR_CHAIN_ROBE",   name: "Chain Robe",     zone: "Zone 3", maxUpgrade: 620 },
  { id: "ARMOR_RONIN",        name: "Ronin",          zone: "Zone 4", maxUpgrade: 720 },
  { id: "ARMOR_SAMURAI",      name: "Samurai",        zone: "Zone 4", maxUpgrade: 720 },
  { id: "ARMOR_SHOGUN",       name: "Shogun",         zone: "Zone 5", maxUpgrade: 820 },
  { id: "ARMOR_PLATE",        name: "Plate Armor",    zone: "Zone 5", maxUpgrade: 820 },
  { id: "ARMOR_CHAIN",        name: "Chain Armor",    zone: "Zone 6", maxUpgrade: 920 },
  { id: "ARMOR_DRAGON",       name: "Dragon Armor",   zone: "Zone 6", maxUpgrade: 920 },
  { id: "ARMOR_GUARD",        name: "Guard",          zone: "Special", maxUpgrade: 999 },
  { id: "ARMOR_SENSEI_KENDO", name: "Sensei Kendo",   zone: "Special", maxUpgrade: 999 },
];

export const HELMS: ItemDef[] = [
  { id: "HELM_KENDO_MASK",     name: "Kendo Mask",     zone: "Zone 1", maxUpgrade: 330 },
  { id: "HELM_SOLDIER_KABUTO", name: "Soldier Kabuto", zone: "Zone 2", maxUpgrade: 520 },
  { id: "HELM_CLOSED",         name: "Closed Helmet",  zone: "Zone 2", maxUpgrade: 520 },
  { id: "HELM_LOBSTER",        name: "Lobster Helm",   zone: "Zone 3", maxUpgrade: 620 },
  { id: "HELM_BLOOD",          name: "Blood Helm",     zone: "Zone 3", maxUpgrade: 620 },
  { id: "HELM_SMART_GABLED",   name: "Smart Gabled",   zone: "Zone 4", maxUpgrade: 720 },
  { id: "HELM_SHADOW",         name: "Shadow Helm",    zone: "Zone 4", maxUpgrade: 720 },
  { id: "HELM_NINJA",          name: "Ninja Hood",     zone: "Zone 5", maxUpgrade: 820 },
  { id: "HELM_SAMURAI",        name: "Samurai Helm",   zone: "Zone 5", maxUpgrade: 820 },
  { id: "HELM_DEMON",          name: "Demon Mask",     zone: "Zone 6", maxUpgrade: 920 },
  { id: "HELM_BRONZE",         name: "Bronze Helm",    zone: "Special", maxUpgrade: 999 },
  { id: "HELM_KABUTO",         name: "Kabuto",         zone: "Special", maxUpgrade: 999 },
];

export const RANGED: ItemDef[] = [
  { id: "RANGED_KUNAI",    name: "Kunai",          zone: "Zone 1", maxUpgrade: 330 },
  { id: "RANGED_SHURIKEN", name: "Shuriken",       zone: "Zone 2", maxUpgrade: 430 },
  { id: "RANGED_STARS",    name: "Throwing Stars", zone: "Zone 3", maxUpgrade: 620 },
  { id: "RANGED_NEEDLES",  name: "Needles",        zone: "Zone 4", maxUpgrade: 720 },
  { id: "RANGED_BOMB",     name: "Smoke Bomb",     zone: "Zone 5", maxUpgrade: 820 },
  { id: "RANGED_COINS",    name: "Coin Bomb",      zone: "Zone 5", maxUpgrade: 820 },
  { id: "RANGED_DISC",     name: "Razor Disc",     zone: "Zone 6", maxUpgrade: 920 },
];

export const MAGIC: ItemDef[] = [
  { id: "MAGIC_LIGHTNING",  name: "Lightning",          zone: "Zone 1", maxUpgrade: 330 },
  { id: "MAGIC_STONE",      name: "Stone Rain",         zone: "Zone 2", maxUpgrade: 430 },
  { id: "MAGIC_HORIZONTAL", name: "Horiz. Lightning",   zone: "Zone 2", maxUpgrade: 520 },
  { id: "MAGIC_ICE",        name: "Ice Wall",           zone: "Zone 3", maxUpgrade: 620 },
  { id: "MAGIC_FIREBALL",   name: "Fireball",           zone: "Zone 4", maxUpgrade: 720 },
  { id: "MAGIC_FIREBIRD",   name: "Fire Bird",          zone: "Zone 5", maxUpgrade: 820 },
  { id: "MAGIC_ICESHARDS",  name: "Ice Shards",         zone: "Zone 6", maxUpgrade: 920 },
];

export const ALL_ITEM_DEFS: ItemDef[] = [
  ...WEAPONS,
  ...ARMORS,
  ...HELMS,
  ...RANGED,
  ...MAGIC,
];

export const ZONE_COLORS: Record<string, string> = {
  "Zone 1": "#22c55e",
  "Zone 2": "#3b82f6",
  "Zone 3": "#a855f7",
  "Zone 4": "#f97316",
  "Zone 5": "#ef4444",
  "Zone 6": "#eab308",
  "Ranged":  "#06b6d4",
  "Special": "#6b7280",
};

export const ALL_ZONES = ["ZONE_1", "ZONE_2", "ZONE_3", "ZONE_4", "ZONE_5", "ZONE_6"];

export const WEAPON_IDS = WEAPONS.map((w) => w.id);
export const ARMOR_IDS  = ARMORS.map((a) => a.id);
export const HELM_IDS   = HELMS.map((h) => h.id);
export const RANGED_IDS = RANGED.map((r) => r.id);
export const MAGIC_IDS  = MAGIC.map((m) => m.id);
