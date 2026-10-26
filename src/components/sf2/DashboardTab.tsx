import type { CSSProperties, ReactNode } from 'react';
import type { SF2GameData, WarriorStats } from '../../lib/sf2/types';
import { WEAPONS, ARMORS, HELMS, RANGED, MAGIC } from '../../lib/sf2/data';

interface Props {
  data: SF2GameData;
  unlimitedEnergy: boolean;
  onUnlimitedEnergyChange: (v: boolean) => void;
  onChange: (partial: Partial<SF2GameData>) => void;
  onSave: () => void;
  onRestore: () => void;
  onMaxEverything: () => void;
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

function StatIcon({ kind }: { kind: string }) {
  const common = {
    width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };
  switch (kind) {
    case 'coins':
      return (
        <svg {...common}>
          <ellipse cx="9" cy="7" rx="6" ry="3" />
          <path d="M3 7v5c0 1.7 2.7 3 6 3s6-1.3 6-3V7" />
          <path d="M9 15v2c0 1.7 2.7 3 6 3s6-1.3 6-3v-5c0-1.7-2.7-3-6-3" />
        </svg>
      );
    case 'gems':
      return (
        <svg {...common}>
          <path d="M6 3h12l4 6-10 12L2 9z" />
          <path d="M2 9h20M12 21 8 9l4-6 4 6z" />
        </svg>
      );
    case 'level':
      return (
        <svg {...common}>
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      );
    case 'energy':
      return (
        <svg {...common}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7z" />
        </svg>
      );
    default:
      return null;
  }
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="cl-toggle"
    />
  );
}

interface StatCardProps {
  icon: string;
  label: string;
  color: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unlimited?: boolean;
  isUnlimited?: boolean;
  onUnlimitedChange?: (v: boolean) => void;
}

function StatCard({ icon, label, color, value, min, max, onChange, unlimited, isUnlimited, onUnlimitedChange }: StatCardProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  const active = !!(unlimited && isUnlimited);

  return (
    <div
      className="flex min-w-0 flex-col rounded-card border border-l-[3px] border-line bg-card p-4 transition-colors hover:border-line-hover focus-within:border-line-hover"
      style={{ ...accent(color), borderLeftColor: color }}
    >
      <div className="flex h-5 items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span style={{ color }}><StatIcon kind={icon} /></span>
          <p className="cl-label-xs">{label}</p>
        </div>
        {unlimited && onUnlimitedChange && (
          <label className="flex cursor-pointer items-center gap-2">
            <span className="cl-label-xs">Unlimited</span>
            <ToggleSwitch checked={!!isUnlimited} onChange={onUnlimitedChange} />
          </label>
        )}
      </div>

      <p className="mt-3 truncate text-[22px] font-black leading-none tabular-nums text-txt-primary">
        {active ? '∞' : value.toLocaleString()}
      </p>

      <div className="mt-4">
        {!active ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={value}
              min={min}
              max={max}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onChange(clamp(v));
              }}
              className="cl-input h-8 min-w-0 flex-1 px-2.5 text-[13px] font-bold"
            />
            <button
              onClick={() => onChange(max)}
              className="cl-btn cl-btn-tint h-8 flex-shrink-0 px-3 text-[10px] tracking-widest"
            >
              MAX
            </button>
          </div>
        ) : (
          <div
            className="flex h-8 items-center gap-2 rounded-ctl px-2.5 text-[10px] font-bold tracking-widest"
            style={{ background: `${color}26`, color }}
          >
            <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
            UNLIMITED ACTIVE
          </div>
        )}
      </div>

      <p className="mt-2.5 font-mono text-[10px] tabular-nums text-txt-muted">
        {min.toLocaleString()} – {max.toLocaleString()}
      </p>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  owned: number;
  total: number;
  color: string;
}

function SummaryCard({ label, owned, total, color }: SummaryCardProps) {
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const complete = total > 0 && owned === total;
  return (
    <div className="min-w-0 rounded-card border border-line bg-card px-4 py-3.5 transition-colors hover:border-line-hover">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-[1px]" style={{ background: color }} />
          <p className="cl-label-xs">{label}</p>
        </div>
        {complete ? (
          <span className="cl-badge !px-1.5 !py-0 !text-[9px]" style={accent('#d4a017')}>ALL</span>
        ) : (
          <span className="font-mono text-[10px] tabular-nums text-txt-muted">{pct}%</span>
        )}
      </div>
      <p className="mt-2.5 text-xl font-bold leading-none tabular-nums text-txt-primary">
        {owned}
        <span className="ml-0.5 text-[13px] font-medium text-txt-muted">/{total}</span>
      </p>
      <div className="cl-progress mt-3" style={accent(complete ? '#d4a017' : color)}>
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DashboardTab({ data, unlimitedEnergy, onUnlimitedEnergyChange, onChange, onSave, onRestore, onMaxEverything }: Props) {
  const setStats = (patch: Partial<WarriorStats>) =>
    onChange({ stats: { ...data.stats, ...patch } });

  const ownedWeapons = data.items.filter(i => WEAPONS.some(w => w.id === i.id) && i.owned).length;
  const ownedArmors  = data.items.filter(i => ARMORS.some(a => a.id === i.id) && i.owned).length;
  const ownedHelms   = data.items.filter(i => HELMS.some(h => h.id === i.id) && i.owned).length;
  const ownedRanged  = data.items.filter(i => RANGED.some(r => r.id === i.id) && i.owned).length;
  const ownedMagic   = data.items.filter(i => MAGIC.some(m => m.id === i.id) && i.owned).length;

  const totalOwned = ownedWeapons + ownedArmors + ownedHelms + ownedRanged + ownedMagic;
  const totalItems = WEAPONS.length + ARMORS.length + HELMS.length + RANGED.length + MAGIC.length;

  return (
    <div className="space-y-8">
      <section>
        <SectionHeader title="Player Stats" hint="Currency, progression and energy" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="coins" label="COINS" color="#d4a017"
            value={data.stats.money} min={0} max={999999999}
            onChange={(v) => setStats({ money: v })}
          />
          <StatCard
            icon="gems" label="GEMS" color="#9B59B6"
            value={data.stats.gems} min={0} max={999999999}
            onChange={(v) => setStats({ gems: v })}
          />
          <StatCard
            icon="level" label="LEVEL" color="#3498DB"
            value={data.stats.level} min={1} max={52}
            onChange={(v) => setStats({ level: v })}
          />
          <StatCard
            icon="energy" label="ENERGY" color="#E74C3C"
            value={data.stats.power} min={0} max={6}
            onChange={(v) => setStats({ power: v })}
            unlimited
            isUnlimited={unlimitedEnergy}
            onUnlimitedChange={onUnlimitedEnergyChange}
          />
        </div>
      </section>

      <section>
        <SectionHeader
          title="Inventory Summary"
          right={
            <span className="font-mono text-[11px] tabular-nums text-txt-muted">
              <span className="text-txt-secondary">{totalOwned}</span> / {totalItems} owned
            </span>
          }
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard label="WEAPONS" owned={ownedWeapons} total={WEAPONS.length} color="#E74C3C" />
          <SummaryCard label="ARMOR"   owned={ownedArmors}  total={ARMORS.length}  color="#3498DB" />
          <SummaryCard label="HELMS"   owned={ownedHelms}   total={HELMS.length}   color="#9B59B6" />
          <SummaryCard label="RANGED"  owned={ownedRanged}  total={RANGED.length}  color="#1ABC9C" />
          <SummaryCard label="MAGIC"   owned={ownedMagic}   total={MAGIC.length}   color="#E67E22" />
        </div>
      </section>

      <section>
        <SectionHeader title="Actions" />
        <div className="cl-panel flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-txt-secondary">
            Backup is created automatically on first save.
            <span className="cl-kbd">Ctrl+S</span>
            to save quickly.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onMaxEverything}
              className="cl-btn cl-btn-primary h-9 px-4 text-xs tracking-wide"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>
              MAX EVERYTHING
            </button>
            <button
              onClick={onSave}
              className="cl-btn cl-btn-success h-9 px-4 text-xs"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M17 21v-8H7v8M7 3v5h8" />
              </svg>
              Apply &amp; Save
            </button>
            <button
              onClick={onRestore}
              className="cl-btn cl-btn-ghost h-9 px-4 text-xs"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              Restore Backup
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
