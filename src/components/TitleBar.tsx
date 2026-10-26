import { useEffect, useState } from 'react';
import clsx from 'clsx';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

interface Props {
  fileName?: string;
  saveStatus: SaveStatus;
  autoSave: boolean;
  onToggleAutoSave: () => void;
  onSave: () => void;
  canSave: boolean;
}

export default function TitleBar({ fileName, saveStatus, autoSave, onToggleAutoSave, onSave, canSave }: Props) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [updateVersion, setUpdateVersion] = useState<string | null>(null);
  const [updateReady, setUpdateReady] = useState(false);

  useEffect(() => {
    window.electron.window.isMaximized().then(setIsMaximized);
    window.electron.window.onMaximizeChange(setIsMaximized);
    window.electron.updater.onUpdateAvailable((v) => setUpdateVersion(v));
    window.electron.updater.onUpdateDownloaded(() => setUpdateReady(true));
  }, []);

  const statusColor = { saved: '#27ae60', saving: '#f39c12', unsaved: '#e67e22', error: '#e74c3c' }[saveStatus];
  const statusText  = { saved: 'Saved', saving: 'Saving…', unsaved: 'Unsaved', error: 'Error' }[saveStatus];

  return (
    <div className="flex-shrink-0">
      {/* Update banner */}
      {(updateVersion || updateReady) && (
        <div
          className="flex h-7 items-center justify-between gap-3 px-3 text-[11px] font-medium"
          style={{ background: updateReady ? '#27ae60' : '#1a1612', borderBottom: '1px solid #3a342e' }}
        >
          <span style={{ color: updateReady ? '#fff' : '#f0c040' }}>
            {updateReady
              ? `v${updateVersion} downloaded — restart to update`
              : `New version v${updateVersion} downloading…`}
          </span>
          {updateReady && (
            <button
              onClick={() => window.electron.updater.install()}
              className="rounded-[4px] bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-white/30 transition-colors"
              style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            >
              Restart Now
            </button>
          )}
        </div>
      )}
    <header
      className="flex h-10 flex-shrink-0 select-none items-center justify-between border-b border-line bg-surface pl-3"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <img src="/logo.png" alt="CheatLab" className="h-6 w-6 object-contain" />
        <span className="text-[13px] font-black tracking-tight">
          <span style={{ color: '#4d7ff0' }}>Cheat</span><span style={{ color: '#a3d900' }}>Lab</span>
        </span>
        <span className="hidden h-3 w-px bg-line sm:block" />
        <span className="hidden text-[11px] font-medium text-txt-muted sm:block">Save Editor</span>
      </div>

      {/* Center: file + status */}
      <div
        className="flex min-w-0 items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {fileName && (
          <div className="flex h-6 min-w-0 items-center gap-2 rounded-ctl border border-line bg-canvas pl-2 pr-2.5">
            <svg className="flex-shrink-0 text-txt-muted" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
            </svg>
            <span className="max-w-[260px] truncate font-mono text-[11px] text-txt-secondary">{fileName}</span>
            <span className="h-3 w-px bg-line" />
            <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: statusColor }}>
              <span
                className={clsx('h-1.5 w-1.5 rounded-[1px]', saveStatus === 'saving' && 'cl-pulse')}
                style={{ backgroundColor: statusColor }}
              />
              {statusText}
            </span>
          </div>
        )}
      </div>

      {/* Right: controls */}
      <div
        className="flex h-full items-center gap-1.5"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {canSave && (
          <>
            <button
              onClick={onToggleAutoSave}
              className={clsx(
                'flex h-7 items-center gap-2 rounded-ctl border px-2.5 text-[11px] font-bold transition-colors',
                autoSave
                  ? 'border-brand/50 bg-brand/10 text-brand-text'
                  : 'border-line text-txt-muted hover:border-line-hover hover:text-txt-secondary'
              )}
              title={`Auto-save: ${autoSave ? 'ON' : 'OFF'}`}
            >
              <span
                className="relative h-3 w-5 rounded-[3px] transition-colors"
                style={{ background: autoSave ? '#c0392b' : '#2a2420' }}
              >
                <span
                  className="absolute top-0.5 h-2 w-2 rounded-[1px] transition-transform"
                  style={{
                    background: autoSave ? '#fff' : '#5a524c',
                    transform: autoSave ? 'translateX(10px)' : 'translateX(2px)',
                  }}
                />
              </span>
              Auto
            </button>
            <button
              onClick={onSave}
              disabled={saveStatus === 'saved' || saveStatus === 'saving'}
              className="cl-btn cl-btn-primary h-7 px-3 text-[11px]"
              title="Save (Ctrl+S)"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M17 21v-8H7v8M7 3v5h8" />
              </svg>
              Save
            </button>
          </>
        )}

        {/* Window controls */}
        <div className="ml-1.5 flex h-full border-l border-line">
          <button
            onClick={() => window.electron.window.minimize()}
            className="flex h-full w-11 items-center justify-center text-txt-muted transition-colors hover:bg-white/[0.05] hover:text-txt-primary"
            aria-label="Minimize"
          >
            <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor"><rect width="10" height="1" /></svg>
          </button>
          <button
            onClick={() => window.electron.window.maximize()}
            className="flex h-full w-11 items-center justify-center text-txt-muted transition-colors hover:bg-white/[0.05] hover:text-txt-primary"
            aria-label={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M2.5 2.5V0.5h7v7h-2" />
                <rect x="0.5" y="2.5" width="7" height="7" />
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
                <rect x="0.5" y="0.5" width="9" height="9" />
              </svg>
            )}
          </button>
          <button
            onClick={() => window.electron.window.close()}
            className="flex h-full w-11 items-center justify-center text-txt-muted transition-colors hover:bg-[#e81123] hover:text-white"
            aria-label="Close"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
              <line x1="0" y1="0" x2="10" y2="10" />
              <line x1="10" y1="0" x2="0" y2="10" />
            </svg>
          </button>
        </div>
      </div>
    </header>
    </div>
  );
}
