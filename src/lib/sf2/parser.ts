import { unzlibSync, zlibSync } from "fflate";
import { ALL_ITEM_DEFS, ALL_ZONES } from "./data";
import type { SF2GameData, SF2Item, SF2Save, WarriorStats, Battle } from "./types";

function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64);
  const arr = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
  return arr;
}

function uint8ArrayToBase64(arr: Uint8Array): string {
  let binary = "";
  const chunk = 8192;
  for (let i = 0; i < arr.length; i += chunk) {
    binary += String.fromCharCode(...arr.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function getAttr(xml: string, attr: string): string {
  const m = xml.match(new RegExp(`\\b${attr}="([^"]*)"`));
  return m ? m[1] : "";
}

function getAttrInt(xml: string, attr: string, fallback = 0): number {
  const v = getAttr(xml, attr);
  const n = parseInt(v, 10);
  return isNaN(n) ? fallback : n;
}

function setAttr(xml: string, attr: string, value: string | number): string {
  const re = new RegExp(`\\b${attr}="[^"]*"`);
  if (re.test(xml)) {
    return xml.replace(re, `${attr}="${value}"`);
  }
  return xml;
}

function getItemUpgrade(xml: string, itemId: string): number {
  const escaped = itemId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`Name="${escaped}"[^>]*UpgradeLevel="([^"]+)"`),
    new RegExp(`UpgradeLevel="([^"]+)"[^>]*Name="${escaped}"`),
  ];
  for (const re of patterns) {
    const m = xml.match(re);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > 0) return n;
    }
  }
  return 0;
}

function ensureItem(xml: string, itemId: string, upgradeLevel: number, count = 1): string {
  const escaped = itemId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const existsRe = new RegExp(`Name="${escaped}"`);

  if (existsRe.test(xml)) {
    return xml.replace(
      new RegExp(`<Item[^/]*Name="${escaped}"[^/]*/>`),
      (tag) => {
        tag = tag.replace(/UpgradeLevel="[^"]*"/, `UpgradeLevel="${upgradeLevel}"`);
        tag = tag.replace(/DeliveryUpgradeLevel="(?!-)[^"]*"/, `DeliveryUpgradeLevel="${upgradeLevel}"`);
        tag = tag.replace(/Count="\d[^"]*"/, `Count="${count}"`);
        tag = tag.replace(/DeliveryTime="\d[^"]*"/, `DeliveryTime="-1"`);
        return tag;
      }
    );
  }

  const newTag = `\t\t\t\t\t<Item AcquireType="Item" Count="${count}" DeliveryTime="-1" DeliveryUpgradeLevel="${upgradeLevel}" Equipped="0" Name="${itemId}" UpgradeLevel="${upgradeLevel}" />`;
  return xml.replace("</Items>", newTag + "\n\t\t\t\t</Items>");
}

function removeItem(xml: string, itemId: string): string {
  const escaped = itemId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return xml.replace(new RegExp(`\\s*<Item[^/]*Name="${escaped}"[^/]*/>`), "");
}

function parseBattles(xml: string): Battle[] {
  const battles: Battle[] = [];
  const re = /<Battle\b[^/]*\/>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const tag = m[0];
    const nameM = tag.match(/Name="([^"]+)"/);
    const lockedM = tag.match(/Locked="([^"]+)"/);
    if (!nameM) continue;
    const name = nameM[1];
    const locked = lockedM ? lockedM[1] === "1" : false;
    const zone = ALL_ZONES.find((z) => name.startsWith(z)) ?? "ZONE_1";
    battles.push({ name, locked, zone });
  }
  return battles;
}

function unlockAllBattles(xml: string): string {
  xml = xml.replace(/(<Battle\b[^/]*)Locked="1"/g, '$1Locked="0"');

  const existingNames = new Set<string>();
  const re = /<Battle\b[^>]*Name="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) existingNames.add(m[1]);

  const needed = [
    "ZONE_3|BOSS_BUTCHER|", "ZONE_3|Tournament|", "ZONE_3|Duel|", "ZONE_3|Survival|",
    "ZONE_4|BOSS_WASP|",    "ZONE_4|Tournament|", "ZONE_4|Duel|", "ZONE_4|Survival|",
    "ZONE_5|BOSS_HUNTRESS|","ZONE_5|Tournament|", "ZONE_5|Duel|", "ZONE_5|Survival|",
    "ZONE_6|BOSS_SAMURAI|", "ZONE_6|Tournament|", "ZONE_6|Duel|", "ZONE_6|Survival|",
    "ZONE_6|FINAL_BOSS|",
  ];

  const newTags = needed
    .filter((n) => !existingNames.has(n))
    .map((n) => `\t\t\t\t\t<Battle Hidden="0" Locked="0" Name="${n}" ReplayCount="0" />`)
    .join("\n");

  if (newTags) {
    xml = xml.replace("</Battles>", newTags + "\n\t\t\t\t</Battles>");
  }
  return xml;
}

export function parseSF2Save(fileContent: string): SF2GameData {
  const raw = JSON.parse(fileContent) as Record<string, unknown>;
  const data = raw["data"] as Record<string, unknown>;
  const encoded = data["SF2User"] as string;

  const compressed = base64ToUint8Array(encoded);
  const decompressed = unzlibSync(compressed);
  const xml = new TextDecoder("utf-8").decode(decompressed);

  const ownedIds = new Set(
    Array.from(xml.matchAll(/Name="([^"]+)"/g)).map((m) => m[1])
  );

  const stats: WarriorStats = {
    money:         getAttrInt(xml, "Money"),
    gems:          getAttrInt(xml, "Emeralds"),
    level:         getAttrInt(xml, "Level", 1),
    experience:    getAttrInt(xml, "Experience"),
    power:         getAttrInt(xml, "Power", 6),
    powerSyncTime: getAttrInt(xml, "PowerSyncTime"),
    strength:      getAttrInt(xml, "Strength", 1),
    stamina:       getAttrInt(xml, "Stamina", 3),
    currentZone:   getAttr(xml, "CurrentZone") || "ZONE_1",
    weapon:        getAttr(xml, "Weapon") || "WEAPON_KNIVES",
    armor:         getAttr(xml, "Armor")  || "ARMOR_ROBE",
    helm:          getAttr(xml, "Helm")   || "HELM_KENDO_MASK",
    ranged:        getAttr(xml, "Ranged") || "NoRanged",
    magic:         getAttr(xml, "Magic")  || "NoMagic",
  };

  const items: SF2Item[] = ALL_ITEM_DEFS.map((def) => ({
    id:           def.id,
    name:         def.name,
    zone:         def.zone,
    maxUpgrade:   def.maxUpgrade,
    owned:        ownedIds.has(def.id),
    upgradeLevel: getItemUpgrade(xml, def.id) || def.maxUpgrade,
  }));

  const battles = parseBattles(xml);

  return {
    save: { raw, xml },
    stats,
    items,
    battles,
    bodyUpgrade:  getItemUpgrade(xml, "Body")  || 9999,
    headUpgrade:  getItemUpgrade(xml, "Head")  || 9999,
    fistsUpgrade: getItemUpgrade(xml, "Fists") || 9999,
  };
}

export interface SerializeOptions {
  stats: WarriorStats;
  items: SF2Item[];
  battles: Battle[];
  bodyUpgrade: number;
  headUpgrade: number;
  fistsUpgrade: number;
  unlimitedEnergy: boolean;
  unlockAllLevels: boolean;
}

export function serializeSF2Save(original: SF2Save, opts: SerializeOptions): string {
  let xml = original.xml;

  xml = setAttr(xml, "Money",    opts.stats.money);
  xml = setAttr(xml, "Emeralds", opts.stats.gems);
  xml = setAttr(xml, "Level",    opts.stats.level);
  xml = setAttr(xml, "Strength", opts.stats.strength);
  xml = setAttr(xml, "Stamina",  opts.stats.stamina);
  xml = setAttr(xml, "CurrentZone", opts.stats.currentZone);
  xml = setAttr(xml, "Weapon",   opts.stats.weapon);
  xml = setAttr(xml, "Armor",    opts.stats.armor);
  xml = setAttr(xml, "Helm",     opts.stats.helm);
  xml = setAttr(xml, "Ranged",   opts.stats.ranged);
  xml = setAttr(xml, "Magic",    opts.stats.magic);

  if (opts.unlimitedEnergy) {
    xml = setAttr(xml, "Power",           6);
    xml = setAttr(xml, "PowerSyncTime",  -1);
    xml = setAttr(xml, "PeriodicPlayTime", 0);
    xml = ensureItem(xml, "Energy_Refill", 9999, 9999);
  } else {
    xml = setAttr(xml, "Power", opts.stats.power);
  }

  for (const item of opts.items) {
    if (item.owned) {
      xml = ensureItem(xml, item.id, item.upgradeLevel);
    } else {
      xml = removeItem(xml, item.id);
    }
  }

  xml = ensureItem(xml, "Body",  opts.bodyUpgrade,  1);
  xml = ensureItem(xml, "Head",  opts.headUpgrade,  1);
  xml = ensureItem(xml, "Fists", opts.fistsUpgrade, 1);

  if (opts.unlockAllLevels) {
    xml = unlockAllBattles(xml);
  } else {
    for (const battle of opts.battles) {
      const escaped = battle.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const val = battle.locked ? "1" : "0";
      xml = xml.replace(
        new RegExp(`(<Battle\\b[^/]*Name="${escaped}"[^/]*)Locked="[01]"`),
        `$1Locked="${val}"`
      );
    }
  }

  const encoded = new TextEncoder().encode(xml);
  const compressed = zlibSync(encoded, { level: 9 });
  const b64 = uint8ArrayToBase64(compressed);

  const out = { ...original.raw };
  (out["data"] as Record<string, unknown>)["SF2User"] = b64;
  (out as Record<string, unknown>)["updatedAt"] = Date.now();

  return JSON.stringify(out);
}
