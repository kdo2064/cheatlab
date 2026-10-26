import { useState, useCallback, useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  onOpen: () => void;
  onOpenByPath: (filePath: string) => void;
}

interface ScanResult {
  filePath: string;
  name: string;
  size: number;
  mtime: number;
}

type ScanState = 'idle' | 'scanning' | 'done' | 'empty';

const accent = (color: string) => ({ '--accent': color } as CSSProperties);

function relativeTime(ms: number): string {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60000);
  const hr  = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1)  return 'abhi';
  if (min < 60) return `${min}m pehle`;
  if (hr  < 24) return `${hr}h pehle`;
  return `${day}d pehle`;
}

function formatBytes(b: number): string {
  if (b < 1024)        return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

function detectSource(filePath: string): { label: string; color: string } {
  const p = filePath.toLowerCase().replace(/\\/g, '/');
  if (p.includes('/packages/') && p.includes('famobi'))
                                 return { label: 'Windows Store', color: '#3498db' };
  if (p.includes('/packages/'))  return { label: 'Windows Store', color: '#3498db' };
  if (p.includes('bluestacks'))  return { label: 'BlueStacks',    color: '#5dade2' };
  if (p.includes('ldplayer'))    return { label: 'LDPlayer',      color: '#27ae60' };
  if (p.includes('nox'))         return { label: 'Nox Player',    color: '#e67e22' };
  if (p.includes('memu'))        return { label: 'MEmu',          color: '#9b59b6' };
  if (p.includes('mumu'))        return { label: 'MuMu',          color: '#d4a017' };
  if (p.includes('/desktop/') || p.includes('\\desktop\\'))
                                 return { label: 'Desktop',       color: '#a09890' };
  if (p.includes('downloads'))   return { label: 'Downloads',     color: '#a09890' };
  if (p.includes('documents'))   return { label: 'Documents',     color: '#a09890' };
  return { label: 'Local',       color: '#a09890' };
}

function FlaskIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M10 3v6.5L4.6 18.2A1.8 1.8 0 0 0 6.1 21h11.8a1.8 1.8 0 0 0 1.5-2.8L14 9.5V3" />
      <path d="M7.5 15h9" />
    </svg>
  );
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function TipCard({ color, title, icon, children }: { color: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="cl-card border-l-2" style={{ borderLeftColor: color }}>
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
        <span style={{ color }}>{icon}</span>
        <p className="text-xs font-bold text-txt-primary">{title}</p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

export default function FileDropZone({ onOpen, onOpenByPath }: Props) {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [results, setResults] = useState<ScanResult[]>([]);

  const handleScan = useCallback(async () => {
    setScanState('scanning');
    setResults([]);
    const found = await window.electron.file.scan();
    setResults(found);
    setScanState(found.length > 0 ? 'done' : 'empty');
  }, []);

  useEffect(() => { handleScan(); }, [handleScan]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="cl-fade mx-auto w-full max-w-[600px] space-y-4 px-6 pb-12 pt-12">
        {/* Header */}
        <div className="pb-3 text-center">
          <img
            src="/logo.png"
            alt="CheatLab"
            className="mx-auto mb-4 h-20 w-20 object-contain"
            draggable={false}
          />
          <img
            src="/wordmark.png"
            alt="CheatLab"
            className="mx-auto mb-3 h-10 object-contain"
            draggable={false}
          />
          <p className="text-[13px] font-medium text-txt-secondary">Shadow Fight 2 Save Editor</p>
        </div>

        {/* Scan panel */}
        <div className="cl-panel p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="cl-label">Auto Scan</p>
                {scanState === 'scanning' && (
                  <span className="cl-badge" style={accent('#f39c12')}>
                    <span className="cl-pulse h-1.5 w-1.5 rounded-[1px] bg-current" />
                    Live
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs leading-relaxed text-txt-secondary">
                Desktop, Downloads, Documents aur emulator folders (BlueStacks, LDPlayer, Nox, MEmu) scan karta hai — SF2 saves automatically dhundta hai
              </p>
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={scanState === 'scanning'}
            className={clsx(
              'cl-btn h-10 w-full text-[13px]',
              scanState === 'scanning'
                ? '!cursor-wait border-line bg-card text-txt-secondary !opacity-100'
                : 'cl-btn-primary',
            )}
          >
            {scanState === 'scanning' ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                Scanning...
              </>
            ) : (
              <>
                <SearchIcon size={14} />
                {scanState === 'done' || scanState === 'empty' ? 'Dobara Scan Karo' : 'Scan for SF2 Saves'}
              </>
            )}
          </button>

          {scanState === 'scanning' && (
            <div className="cl-progress cl-progress-indeterminate mt-3">
              <span />
            </div>
          )}

          {/* Empty */}
          {scanState === 'empty' && (
            <div className="cl-fade mt-4 rounded-ctl border border-dashed border-line-hover bg-canvas px-4 py-3.5">
              <p className="text-[13px] font-semibold text-txt-primary">Koi SF2 save file nahi mili.</p>
              <p className="mt-1 text-xs leading-relaxed text-txt-muted">
                Phone se file copy karke Desktop ya Downloads mein rakh do, phir dobara scan karo.
              </p>
            </div>
          )}

          {/* Results */}
          {scanState === 'done' && results.length > 0 && (
            <div className="cl-fade mt-5 space-y-1.5">
              <div className="flex items-center justify-between pb-1">
                <p className="cl-label">
                  {results.length} save file{results.length > 1 ? 's' : ''} mili
                </p>
                <span className="cl-badge" style={accent('#27ae60')}>
                  <span className="h-1.5 w-1.5 rounded-[1px] bg-current" />
                  Ready
                </span>
              </div>
              {results.map((r) => {
                const src = detectSource(r.filePath);
                return (
                  <div
                    key={r.filePath}
                    className="cl-row flex items-center gap-3 py-2.5 pl-3 pr-2.5"
                    style={accent(src.color)}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-[13px] font-semibold text-txt-primary">{r.name}</p>
                        <span className="cl-badge !py-0 !text-[9px]">{src.label}</span>
                      </div>
                      <div className="mt-1 flex min-w-0 items-center gap-2 text-[10.5px] text-txt-muted">
                        <span className="flex-shrink-0 tabular-nums">
                          {formatBytes(r.size)} · {relativeTime(r.mtime)}
                        </span>
                        <span className="truncate font-mono text-[10px]" title={r.filePath}>
                          {r.filePath}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenByPath(r.filePath)}
                      className="cl-btn cl-btn-primary h-8 flex-shrink-0 px-3.5 text-xs"
                    >
                      Open →
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-line" />
          <span className="text-[11px] font-medium text-txt-muted">ya manually browse karo</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {/* Manual open */}
        <button
          onClick={onOpen}
          className="cl-btn cl-btn-ghost h-10 w-full text-[13px]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          Browse File
          <span className="cl-kbd ml-1">Ctrl+O</span>
        </button>

        {/* Tips */}
        <div className="space-y-3 pt-3">
          <TipCard
            color="#3498db"
            title="Windows Store (Microsoft Store) SF2"
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5.5 10.5 4.4v7.1H3zM11.5 4.3 21 3v8.5h-9.5zM3 12.5h7.5v7.1L3 18.5zM11.5 12.5H21V21l-9.5-1.3z" />
              </svg>
            }
          >
            <p className="text-xs text-txt-secondary">Scan automatically is path mein dhundta hai:</p>
            <code className="cl-code mt-2.5 block break-all px-3 py-2 text-[10.5px] leading-relaxed">
              AppData\Local\Packages\Famobi.ShadowFight2_*\LocalState\GameStorage\shadow-fight-2\
            </code>
            <div className="mt-3 flex items-start gap-2.5 border-l-2 border-gold bg-gold/[0.06] px-3 py-2.5">
              <svg className="mt-px flex-shrink-0 text-gold" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
                <path d="M12 9v4M12 17h.01" />
              </svg>
              <p className="text-xs leading-relaxed text-gold-lt/90">
                Game band karo pehle, phir edit karo — warna game changes overwrite kar deta hai.
              </p>
            </div>
          </TipCard>

          <TipCard
            color="#27ae60"
            title="Android / Emulator users"
            icon={
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="6" y="2" width="12" height="20" rx="2.5" />
                <path d="M11 18h2" />
              </svg>
            }
          >
            <ol className="space-y-2.5 text-xs text-txt-secondary">
              {[
                <>Phone se copy karo: <code className="cl-code px-1.5 py-0.5 text-[10px]">/Android/data/com.nekki.shadowfight/files/</code></>,
                <>Desktop ya Downloads mein paste karo</>,
                <>Scan karo — file mil jaayegi</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-4 flex-shrink-0 pt-px font-mono text-[11px] font-bold tabular-nums text-txt-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </TipCard>
        </div>

        <p className="pt-4 text-center text-[10px] font-medium tracking-wide text-txt-muted">
          CheatLab · by KDO
        </p>
      </div>
    </div>
  );
}
