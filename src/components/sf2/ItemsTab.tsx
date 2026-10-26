import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { SF2Item } from '../../lib/sf2/types';
import { ZONE_COLORS } from '../../lib/sf2/data';

interface Props {
  items: SF2Item[];
  equippedId: string;
  onEquip: (id: string) => void;
  onChange: (items: SF2Item[]) => void;
}

const accent = (color: string) => ({ '--accent': color } as CSSProperties);

function ItemCard({ item, isEquipped, onToggle, onUpgrade, onMax, onEquip }: {
  item: SF2Item;
  isEquipped: boolean;
  onToggle: () => void;
  onUpgrade: (v: number) => void;
  onMax: () => void;
  onEquip: () => void;
}) {
  const color = ZONE_COLORS[item.zone] ?? '#a09890';

  return (
    <div
      className={clsx(
        'flex flex-col rounded-card border border-line bg-card p-3 transition-[background-color,opacity] duration-100 hover:bg-elevated',
        isEquipped && 'border-l-[3px]',
        !item.owned && 'opacity-[0.45] hover:opacity-75'
      )}
      style={{ ...accent(color), borderLeftColor: isEquipped ? color : undefined }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-[12.5px] font-bold leading-snug text-txt-primary">{item.name}</p>
        <button
          role="switch"
          aria-checked={item.owned}
          onClick={onToggle}
          className="cl-toggle mt-px"
          title={item.owned ? 'Owned' : 'Not owned'}
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[9.5px] font-bold uppercase tracking-wide" style={{ color }}>{item.zone}</span>
        {isEquipped && (
          <>
            <span className="text-[9px] text-txt-muted">·</span>
            <span className="text-[9.5px] font-bold uppercase tracking-wide text-txt-primary">Equipped</span>
          </>
        )}
      </div>

      {item.owned ? (
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="cl-label-xs">LVL</span>
            <input
              type="number"
              value={item.upgradeLevel}
              min={0}
              max={item.maxUpgrade}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onUpgrade(Math.min(item.maxUpgrade, Math.max(0, v)));
              }}
              className="cl-input h-7 min-w-0 flex-1 px-2 text-center text-[11px] font-bold"
            />
            <span className="font-mono text-[10px] tabular-nums text-txt-muted">/{item.maxUpgrade}</span>
            <button
              onClick={onMax}
              className="cl-btn cl-btn-tint h-7 px-2 text-[9px] tracking-widest"
            >
              MAX
            </button>
          </div>
          {!isEquipped && (
            <button
              onClick={onEquip}
              className="cl-btn cl-btn-ghost h-7 w-full text-[10.5px]"
            >
              Equip
            </button>
          )}
        </div>
      ) : (
        <div className="mt-auto flex items-center gap-1.5 text-[10px] font-medium text-txt-muted">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Locked
        </div>
      )}
    </div>
  );
}

export default function ItemsTab({ items, equippedId, onEquip, onChange }: Props) {
  const updateItem = (id: string, patch: Partial<SF2Item>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const unlockAll = () => onChange(items.map((i) => ({ ...i, owned: true, upgradeLevel: i.maxUpgrade })));
  const lockAll   = () => onChange(items.map((i) => ({ ...i, owned: false, upgradeLevel: 0 })));

  const zones = Array.from(new Set(items.map((i) => i.zone)));

  const totalOwned = items.filter((i) => i.owned).length;
  const totalPct = items.length > 0 ? (totalOwned / items.length) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="cl-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1 sm:max-w-xs">
          <div className="flex items-baseline justify-between gap-3">
            <p className="cl-label">Collection</p>
            <p className="font-mono text-[11px] tabular-nums text-txt-muted">
              <span className="text-[15px] font-bold text-txt-primary">{totalOwned}</span> / {items.length} owned
            </p>
          </div>
          <div className="cl-progress mt-2.5">
            <span style={{ width: `${totalPct}%` }} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={unlockAll}
            className="cl-btn cl-btn-primary h-8 px-3.5 text-xs"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
            Unlock All + MAX
          </button>
          <button
            onClick={lockAll}
            className="cl-btn cl-btn-ghost cl-btn-ghost-danger h-8 px-3.5 text-xs"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            Lock All
          </button>
        </div>
      </div>

      {zones.map((zone) => {
        const zoneItems = items.filter((i) => i.zone === zone);
        const color = ZONE_COLORS[zone] ?? '#a09890';
        const ownedCount = zoneItems.filter((i) => i.owned).length;

        return (
          <section key={zone} className="cl-panel overflow-hidden">
            <div
              className="flex items-center gap-2.5 border-b border-l-[3px] border-b-line bg-surface px-4 py-2.5"
              style={{ borderLeftColor: color }}
            >
              <p className="text-[12px] font-bold uppercase tracking-wider" style={{ color }}>{zone}</p>
              <span className="cl-badge !py-0" style={accent(color)}>
                {ownedCount}/{zoneItems.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {zoneItems.map((item) => {
                const isEquipped = equippedId.includes(item.id);
                return (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isEquipped={isEquipped}
                    onToggle={() =>
                      updateItem(item.id, {
                        owned: !item.owned,
                        upgradeLevel: !item.owned ? item.maxUpgrade : 0,
                      })
                    }
                    onUpgrade={(v) => updateItem(item.id, { upgradeLevel: v })}
                    onMax={() => updateItem(item.id, { upgradeLevel: item.maxUpgrade })}
                    onEquip={() => onEquip(item.id)}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
