import type { CSSProperties, ReactNode } from 'react';
import type { SF2GameData, WarriorStats } from '../../lib/sf2/types';
import { WEAPONS, ARMORS, HELMS, RANGED, MAGIC } from '../../lib/sf2/data';

interface Props {
  stats: WarriorStats;
  bodyUpgrade: number;
  headUpgrade: number;
  fistsUpgrade: number;
  onChange: (partial: Partial<SF2GameData>) => void;
}

const accent = (color: string) => ({ '--accent': color } as CSSProperties);

function SectionHeader({ title, hint, right }: { title: string; hint?: string; right?: ReactNode }) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="cl-label">{title}</p>
        {hint && <p className="text-[11px] text-txt-muted">{hint}</p>}
      </div>
      {right}
    </div>
  );
}

function ShadowIcon({ kind }: { kind: string }) {
  const common = {
    width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (kind) {
    case 'strength':
      return <svg {...common}><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>;
    case 'stamina':
      return (
        <svg {...common}>
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
        </svg>
      );
    case 'body':
      return <svg {...common}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    case 'head':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case 'fists':
      return (
        <svg {...common}>
          <path d="M7 11V7.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M10 10V6.5a1.5 1.5 0 0 1 3 0V10" />
          <path d="M13 10V7.5a1.5 1.5 0 0 1 3 0V11" />
          <path d="M16 11V9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6v-2.5A1.5 1.5 0 0 1 6.5 11H11" />
        </svg>
      );
    default:
      return null;
  }
}

function UpgradeCard({ icon, label, color, value, min, max, onChange }: {
  icon: string; label: string; color: string;
  value: number; min: number; max: number;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const isMax = value >= max;

  return (
    <div
      className="flex min-w-0 flex-col rounded-card border border-l-[3px] border-line bg-card p-4 transition-colors hover:border-line-hover focus-within:border-line-hover"
      style={{ ...accent(color), borderLeftColor: color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span style={{ color }}><ShadowIcon kind={icon} /></span>
            <p className="cl-label-xs">{label}</p>
            {isMax && (
              <span className="cl-badge !px-1.5 !py-0 !text-[9px]" style={accent('#d4a017')}>MAX</span>
            )}
          </div>
          <p className="mt-3 truncate text-[22px] font-bold leading-none tabular-nums text-txt-primary">
            {value.toLocaleString()}
            <span className="ml-1.5 font-mono text-[11px] font-medium text-txt-muted">/ {max.toLocaleString()}</span>
          </p>
        </div>
        <button
          onClick={() => onChange(max)}
          className="cl-btn cl-btn-tint h-7 flex-shrink-0 px-2.5 text-[10px] tracking-widest"
        >
          MAX
        </button>
      </div>

      <div className="mt-4 flex items-center gap-1">
        <button onClick={() => onChange(clamp(value - 100))} className="cl-step w-11">−100</button>
        <button onClick={() => onChange(clamp(value - 1))} className="cl-step w-8">−1</button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => { const v = parseInt(e.target.value, 10); if (!isNaN(v)) onChange(clamp(v)); }}
          className="cl-input h-[34px] min-w-0 flex-1 px-2 text-center text-[13px] font-bold"
        />
        <button onClick={() => onChange(clamp(value + 1))} className="cl-step w-8">+1</button>
        <button onClick={() => onChange(clamp(value + 100))} className="cl-step w-11">+100</button>
      </div>
    </div>
  );
}

function EquipCombo({ label, items, value, onChange }: {
  label: string;
  items: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="cl-card cl-card-hover min-w-0 p-3">
      <p className="cl-label-xs mb-2">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cl-input cl-select h-8 w-full pl-2.5 text-xs font-semibold"
        style={accent('#c0392b')}
      >
        {items.map((i) => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>
    </div>
  );
}

export default function ShadowTab({ stats, bodyUpgrade, headUpgrade, fistsUpgrade, onChange }: Props) {
  const maxAll = () => {
    onChange({
      stats: { ...stats, strength: 9999, stamina: 99 },
      bodyUpgrade: 99999,
      headUpgrade: 99999,
      fistsUpgrade: 99999,
    });
  };

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader title="Shadow Character Stats" hint="Core attributes" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <UpgradeCard
            icon="strength" label="STRENGTH" color="#E74C3C"
            value={stats.strength} min={1} max={9999}
            onChange={(v) => onChange({ stats: { ...stats, strength: v } })}
          />
          <UpgradeCard
            icon="stamina" label="STAMINA" color="#E67E22"
            value={stats.stamina} min={1} max={99}
            onChange={(v) => onChange({ stats: { ...stats, stamina: v } })}
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Shadow Upgrades"
          hint="Body = HP/Speed · Head = Crit · Fists = Attack Speed"
        />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <UpgradeCard
            icon="body" label="BODY" color="#27AE60"
            value={bodyUpgrade} min={0} max={99999}
            onChange={(v) => onChange({ bodyUpgrade: v })}
          />
          <UpgradeCard
            icon="head" label="HEAD" color="#9B59B6"
            value={headUpgrade} min={0} max={99999}
            onChange={(v) => onChange({ headUpgrade: v })}
          />
          <UpgradeCard
            icon="fists" label="FISTS" color="#d4a017"
            value={fistsUpgrade} min={0} max={99999}
            onChange={(v) => onChange({ fistsUpgrade: v })}
          />
        </div>
      </section>

      <div className="cl-panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] font-bold text-txt-primary">Max out your Shadow</p>
          <p className="mt-0.5 text-xs text-txt-muted">Strength, Stamina, Body, Head and Fists to their limits.</p>
        </div>
        <button
          onClick={maxAll}
          className="cl-btn cl-btn-primary h-9 px-4 text-xs tracking-wide"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
          MAX ALL SHADOW STATS
        </button>
      </div>

      <section>
        <SectionHeader title="Equipped Items" hint="Active loadout" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <EquipCombo
            label="WEAPON"
            items={WEAPONS}
            value={stats.weapon}
            onChange={(id) => onChange({ stats: { ...stats, weapon: id } })}
          />
          <EquipCombo
            label="ARMOR"
            items={ARMORS}
            value={stats.armor}
            onChange={(id) => onChange({ stats: { ...stats, armor: id } })}
          />
          <EquipCombo
            label="HELM"
            items={HELMS}
            value={stats.helm}
            onChange={(id) => onChange({ stats: { ...stats, helm: id } })}
          />
          <EquipCombo
            label="RANGED"
            items={[{ id: 'NoRanged', name: 'None' }, ...RANGED]}
            value={stats.ranged}
            onChange={(id) => onChange({ stats: { ...stats, ranged: id } })}
          />
          <EquipCombo
            label="MAGIC"
            items={[{ id: 'NoMagic', name: 'None' }, ...MAGIC]}
            value={stats.magic}
            onChange={(id) => onChange({ stats: { ...stats, magic: id } })}
          />
        </div>
      </section>
    </div>
  );
}
