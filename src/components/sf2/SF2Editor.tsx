import { useState } from 'react';
import type { SF2GameData } from '../../lib/sf2/types';
import DashboardTab from './DashboardTab';
import ItemsTab from './ItemsTab';
import ShadowTab from './ShadowTab';
import LevelsTab from './LevelsTab';
import { WEAPONS, ARMORS, HELMS, RANGED, MAGIC } from '../../lib/sf2/data';

const TABS = [
  { id: 'dashboard', label: 'Dashboard'      },
  { id: 'weapons',   label: 'Weapons'        },
  { id: 'armor',     label: 'Armor'          },
  { id: 'helms',     label: 'Helms'          },
  { id: 'ranged',    label: 'Ranged & Magic' },
  { id: 'shadow',    label: 'Shadow'         },
  { id: 'levels',    label: 'Levels & Zones' },
];

function TabIcon({ id }: { id: string }) {
  const common = {
    width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (id) {
    case 'dashboard':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      );
    case 'weapons':
      return (
        <svg {...common}>
          <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
          <path d="m13 19 6-6M16 16l4 4M19 21l2-2" />
        </svg>
      );
    case 'armor':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'helms':
      return (
        <svg {...common}>
          <path d="M4 15a8 8 0 0 1 16 0v3H4z" />
          <path d="M12 7V3M4 18h16M9 13h6" />
        </svg>
      );
    case 'ranged':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1" />
        </svg>
      );
    case 'shadow':
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="4" />
          <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
        </svg>
      );
    case 'levels':
      return (
        <svg {...common}>
          <path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z" />
          <path d="M9 4v13.5M15 6.5V20" />
        </svg>
      );
    default:
      return null;
  }
}

interface Props {
  data: SF2GameData;
  unlimitedEnergy: boolean;
  onUnlimitedEnergyChange: (v: boolean) => void;
  onChange: (partial: Partial<SF2GameData>) => void;
  onSave: () => void;
  onRestore: () => void;
}

export default function SF2Editor({ data, unlimitedEnergy, onUnlimitedEnergyChange, onChange, onSave, onRestore }: Props) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const maxEverything = () => {
    const items = data.items.map((item) => ({ ...item, owned: true, upgradeLevel: item.maxUpgrade }));
    onChange({
      stats: {
        ...data.stats,
        money: 999999999, gems: 999999999, level: 52,
        strength: 9999, stamina: 99, currentZone: 'ZONE_6',
      },
      items,
      battles: data.battles.map((b) => ({ ...b, locked: false })),
      bodyUpgrade: 99999, headUpgrade: 99999, fistsUpgrade: 99999,
    });
    onUnlimitedEnergyChange(true);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-shrink-0 items-center border-b border-line bg-surface px-3">
        <div role="tablist" className="cl-scroll-x flex min-w-0 flex-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="cl-tab"
            >
              <TabIcon id={tab.id} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="ml-3 hidden flex-shrink-0 items-center gap-2 lg:flex">
          <span className="font-mono text-[10px] font-bold tracking-wider text-txt-muted">SF2</span>
          <span className="h-3 w-px bg-line" />
          <span className="text-[11px] font-medium text-txt-muted">Shadow Fight 2</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div key={activeTab} className="cl-fade mx-auto w-full max-w-[1280px] px-6 py-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              data={data}
              unlimitedEnergy={unlimitedEnergy}
              onUnlimitedEnergyChange={onUnlimitedEnergyChange}
              onChange={onChange}
              onSave={onSave}
              onRestore={onRestore}
              onMaxEverything={maxEverything}
            />
          )}
          {activeTab === 'weapons' && (
            <ItemsTab
              items={data.items.filter((i) => WEAPONS.some((w) => w.id === i.id))}
              equippedId={data.stats.weapon}
              onEquip={(id) => onChange({ stats: { ...data.stats, weapon: id } })}
              onChange={(updated) => {
                const newItems = data.items.map((i) => updated.find((u) => u.id === i.id) ?? i);
                onChange({ items: newItems });
              }}
            />
          )}
          {activeTab === 'armor' && (
            <ItemsTab
              items={data.items.filter((i) => ARMORS.some((a) => a.id === i.id))}
              equippedId={data.stats.armor}
              onEquip={(id) => onChange({ stats: { ...data.stats, armor: id } })}
              onChange={(updated) => {
                const newItems = data.items.map((i) => updated.find((u) => u.id === i.id) ?? i);
                onChange({ items: newItems });
              }}
            />
          )}
          {activeTab === 'helms' && (
            <ItemsTab
              items={data.items.filter((i) => HELMS.some((h) => h.id === i.id))}
              equippedId={data.stats.helm}
              onEquip={(id) => onChange({ stats: { ...data.stats, helm: id } })}
              onChange={(updated) => {
                const newItems = data.items.map((i) => updated.find((u) => u.id === i.id) ?? i);
                onChange({ items: newItems });
              }}
            />
          )}
          {activeTab === 'ranged' && (
            <ItemsTab
              items={[
                ...data.items.filter((i) => RANGED.some((r) => r.id === i.id)),
                ...data.items.filter((i) => MAGIC.some((m) => m.id === i.id)),
              ]}
              equippedId={data.stats.ranged + '|' + data.stats.magic}
              onEquip={(id) => {
                if (RANGED.some((r) => r.id === id))
                  onChange({ stats: { ...data.stats, ranged: id } });
                else
                  onChange({ stats: { ...data.stats, magic: id } });
              }}
              onChange={(updated) => {
                const newItems = data.items.map((i) => updated.find((u) => u.id === i.id) ?? i);
                onChange({ items: newItems });
              }}
            />
          )}
          {activeTab === 'shadow' && (
            <ShadowTab
              stats={data.stats}
              bodyUpgrade={data.bodyUpgrade}
              headUpgrade={data.headUpgrade}
              fistsUpgrade={data.fistsUpgrade}
              onChange={onChange}
            />
          )}
          {activeTab === 'levels' && (
            <LevelsTab
              battles={data.battles}
              currentZone={data.stats.currentZone}
              onCurrentZoneChange={(zone) => onChange({ stats: { ...data.stats, currentZone: zone } })}
              onChange={(battles) => onChange({ battles })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
