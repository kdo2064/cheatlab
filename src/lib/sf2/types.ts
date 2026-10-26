export interface SF2Save {
  raw: Record<string, unknown>;
  xml: string;
}

export interface WarriorStats {
  money: number;
  gems: number;
  level: number;
  experience: number;
  power: number;
  powerSyncTime: number;
  strength: number;
  stamina: number;
  currentZone: string;
  weapon: string;
  armor: string;
  helm: string;
  ranged: string;
  magic: string;
}

export interface SF2Item {
  id: string;
  name: string;
  zone: string;
  maxUpgrade: number;
  owned: boolean;
  upgradeLevel: number;
}

export interface Battle {
  name: string;
  locked: boolean;
  zone: string;
}

export interface SF2GameData {
  save: SF2Save;
  stats: WarriorStats;
  items: SF2Item[];
  battles: Battle[];
  bodyUpgrade: number;
  headUpgrade: number;
  fistsUpgrade: number;
}
