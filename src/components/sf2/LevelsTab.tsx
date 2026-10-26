import type { CSSProperties } from 'react';
import clsx from 'clsx';
import type { Battle } from '../../lib/sf2/types';
import { ALL_ZONES } from '../../lib/sf2/data';

const ZONE_META: Record<string, { label: string; color: string; boss: string }> = {
  ZONE_1: { label: 'Zone 1', color: '#27ae60', boss: 'Sensei'  },
  ZONE_2: { label: 'Zone 2', color: '#3498db', boss: 'Butcher' },
  ZONE_3: { label: 'Zone 3', color: '#9b59b6', boss: 'Wasp'    },
  ZONE_4: { label: 'Zone 4', color: '#e67e22', boss: 'Hermit'  },
  ZONE_5: { label: 'Zone 5', color: '#e74c3c', boss: 'Shogun'  },
  ZONE_6: { label: 'Zone 6', color: '#d4a017', boss: 'Widow'   },
};

const ZONE_LABELS: Record<string, string> = {
  ZONE_1: 'ZONE_1 — Sensei',
  ZONE_2: 'ZONE_2 — Butcher',
  ZONE_3: 'ZONE_3 — Wasp',
  ZONE_4: 'ZONE_4 — Hermit',
  ZONE_5: 'ZONE_5 — Shogun',
  ZONE_6: 'ZONE_6 — Widow',
};

const accent = (color: string) => ({ '--accent': color } as CSSProperties);

function formatBattleName(name: string): string {
  const part = name.split('|').slice(1).join(' ') || name;
  return part
    .replace(/_/g, ' ')
    .replace(/BOSS BUTCHER/i,  '⚔ Boss: Butcher')
    .replace(/BOSS WASP/i,     '⚔ Boss: Wasp')
    .replace(/BOSS HUNTRESS/i, '⚔ Boss: Huntress')
    .replace(/BOSS SAMURAI/i,  '⚔ Boss: Samurai')
    .replace(/FINAL.BOSS/i,    '👑 Final Boss')
    .replace(/Tournament/i,    '🏆 Tournament')
    .replace(/Duel/i,          '⚔ Duel')
    .replace(/Survival/i,      '💀 Survival');
}

function LockIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="10" rx="2" />
      {open ? <path d="M8 11V7a4 4 0 0 1 7.8-1.2" /> : <path d="M8 11V7a4 4 0 0 1 8 0v4" />}
    </svg>
  );
}

interface Props {
  battles: Battle[];
  currentZone: string;
  onCurrentZoneChange: (zone: string) => void;
  onChange: (battles: Battle[]) => void;
}

export default function LevelsTab({ battles, currentZone, onCurrentZoneChange, onChange }: Props) {
  const unlockAll = () => {
    onCurrentZoneChange('ZONE_6');
    onChange(battles.map((b) => ({ ...b, locked: false })));
  };

  const toggleBattle = (name: string) =>
    onChange(battles.map((b) => (b.name === name ? { ...b, locked: !b.locked } : b)));

  const setZoneLock = (zone: string, locked: boolean) =>
    onChange(battles.map((b) => (b.zone === zone ? { ...b, locked } : b)));

  const totalUnlocked = battles.filter((b) => !b.locked).length;
  const totalPct = battles.length > 0 ? (totalUnlocked / battles.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Control panel */}
      <section>
        <p className="cl-label mb-3">Zones &amp; Battles</p>
        <div className="cl-panel p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="cl-label-xs mb-2 block">Current Zone</label>
              <select
                value={currentZone}
                onChange={(e) => onCurrentZoneChange(e.target.value)}
                className="cl-input cl-select h-9 w-full !bg-card pl-3 text-xs font-bold"
                style={{ ...accent('#c0392b'), color: '#c0392b' }}
              >
                {ALL_ZONES.map((z) => (
                  <option key={z} value={z}>{ZONE_LABELS[z] ?? z}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <span className="cl-label-xs">Battles Unlocked</span>
                <span className="font-mono text-[11px] tabular-nums text-txt-muted">
                  <span className="text-[13px] font-bold text-txt-primary">{totalUnlocked}</span> / {battles.length}
                </span>
              </div>
              <div className="flex h-9 items-center">
                <div className="cl-progress w-full">
                  <span style={{ width: `${totalPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={unlockAll}
            className="cl-btn cl-btn-primary mt-4 h-10 w-full text-[13px]"
          >
            <LockIcon open />
            Unlock ALL Zones &amp; Battles (1 to 6)
          </button>

          <p className="mt-3 text-[11.5px] leading-relaxed text-txt-muted">
            Unlocks all bosses, tournaments, duels, survival, and sensei memories.
            Sets Current Zone to ZONE_6 so the full map is visible.
          </p>
        </div>
      </section>

      <section>
        <p className="cl-label mb-3">Battle Lock States</p>
        <div className="space-y-3">
          {ALL_ZONES.map((zone, zi) => {
            const meta = ZONE_META[zone];
            const zoneBattles = battles.filter((b) => b.zone === zone);
            const unlockedCount = zoneBattles.filter((b) => !b.locked).length;
            const isCurrent = zone === currentZone;

            return (
              <div
                key={zone}
                className="cl-panel overflow-hidden border-l-[3px]"
                style={{ ...accent(meta.color), borderLeftColor: meta.color }}
              >
                <div
                  className={clsx(
                    'flex flex-wrap items-center gap-3 px-4 py-2.5',
                    zoneBattles.length > 0 && 'border-b border-line'
                  )}
                >
                  <span className="font-mono text-[11px] font-bold tabular-nums" style={{ color: meta.color }}>
                    {String(zi + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-bold text-txt-primary">{meta.label}</p>
                      <span className="text-[11px] text-txt-muted">{meta.boss}</span>
                      {isCurrent && (
                        <span className="cl-badge !px-1.5 !py-0 !text-[9px]" style={accent('#ff8a80')}>CURRENT</span>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-[11px] tabular-nums text-txt-muted">
                    <span className="text-txt-secondary">{unlockedCount}</span>/{zoneBattles.length}
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setZoneLock(zone, false)}
                      className="cl-btn cl-btn-tint h-7 px-2.5 text-[11px]"
                    >
                      <LockIcon open />
                      Unlock All
                    </button>
                    <button
                      onClick={() => setZoneLock(zone, true)}
                      className="cl-btn cl-btn-ghost cl-btn-ghost-danger h-7 px-2.5 text-[11px]"
                    >
                      <LockIcon open={false} />
                      Lock All
                    </button>
                  </div>
                </div>

                {zoneBattles.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {zoneBattles.map((battle, i) => {
                      const alt = i % 2 === 1;
                      const altLg = Math.floor(i / 2) % 2 === 1;
                      return (
                        <div
                          key={battle.name}
                          className={clsx(
                            'flex h-9 items-center gap-3 px-4 transition-colors duration-100 hover:!bg-elevated',
                            alt ? 'bg-row-alt' : 'bg-card',
                            altLg ? 'lg:bg-row-alt' : 'lg:bg-card'
                          )}
                        >
                          <span style={{ color: battle.locked ? '#5a524c' : meta.color }}>
                            <LockIcon open={!battle.locked} />
                          </span>
                          <span
                            className={clsx(
                              'min-w-0 flex-1 truncate text-[12.5px]',
                              battle.locked ? 'text-txt-muted' : 'font-medium text-txt-primary'
                            )}
                          >
                            {formatBattleName(battle.name)}
                          </span>
                          <button
                            role="switch"
                            aria-checked={!battle.locked}
                            onClick={() => toggleBattle(battle.name)}
                            className="cl-toggle"
                            title={battle.locked ? 'Click to unlock' : 'Click to lock'}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 px-4 py-3 text-xs text-txt-muted">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    No battles loaded. Click "Unlock ALL Zones" to add all battles.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
