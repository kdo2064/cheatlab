import clsx from 'clsx';

const GAMES = [
  { id: 'sf2', code: 'SF2', name: 'Shadow Fight 2', available: true },
  { id: 'mc',  code: 'MC',  name: 'Minecraft',      available: false },
  { id: 'tv',  code: 'TR',  name: 'Terraria',       available: false },
  { id: 'sv',  code: 'SV',  name: 'Stardew Valley', available: false },
];

interface Props {
  selectedGame: string;
  onSelectGame: (id: string) => void;
}

export default function Sidebar({ selectedGame, onSelectGame }: Props) {
  const availableCount = GAMES.filter((g) => g.available).length;

  return (
    <aside className="flex w-52 flex-shrink-0 flex-col border-r border-line bg-surface">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <p className="cl-label-xs">Games</p>
        <span className="font-mono text-[10px] tabular-nums text-txt-muted">
          {availableCount}/{GAMES.length}
        </span>
      </div>

      <nav className="flex flex-col">
        {GAMES.map((g) => {
          const active = g.available && selectedGame === g.id;
          return (
            <button
              key={g.id}
              onClick={() => g.available && onSelectGame(g.id)}
              disabled={!g.available}
              className={clsx(
                'group flex h-9 items-center gap-2.5 border-l-2 pl-[14px] pr-3 text-left transition-colors',
                active
                  ? 'border-brand bg-brand/[0.08] text-txt-primary'
                  : g.available
                    ? 'border-transparent text-txt-muted hover:bg-white/[0.02] hover:text-txt-secondary'
                    : 'cursor-not-allowed border-transparent text-txt-muted'
              )}
            >
              <span
                className={clsx(
                  'w-7 flex-shrink-0 font-mono text-[10px] font-bold tracking-wide',
                  active ? 'text-brand-text' : 'text-[#3a342e]'
                )}
              >
                {g.code}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{g.name}</span>
              {!g.available && (
                <span className="rounded-[3px] border border-line px-1 text-[9px] font-bold uppercase tracking-wider text-[#3a342e]">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-line px-3 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
          <div>
            <p className="text-[12px] font-black leading-tight tracking-tight">
              <span style={{ color: '#4d7ff0' }}>Cheat</span><span style={{ color: '#a3d900' }}>Lab</span>
            </p>
            <p className="text-[9px] font-medium text-txt-muted">by KDO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
