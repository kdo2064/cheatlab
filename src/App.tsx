import { useState, useEffect, useRef, useCallback } from 'react';
import TitleBar from './components/TitleBar';
import Sidebar from './components/Sidebar';
import FileDropZone from './components/FileDropZone';
import SF2Editor from './components/sf2/SF2Editor';
import { parseSF2Save, serializeSF2Save, type SerializeOptions } from './lib/sf2/parser';
import type { SF2GameData } from './lib/sf2/types';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';
type GameId = 'sf2';

export default function App() {
  const [currentFile, setCurrentFile] = useState<{ path: string; name: string } | null>(null);
  const [gameData, setGameData] = useState<SF2GameData | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameId>('sf2');
  const [autoSave, setAutoSave] = useState(false);
  const [unlimitedEnergy, setUnlimitedEnergy] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const serializeAndSave = useCallback(async (data: SF2GameData, filePath: string, unlimited: boolean) => {
    setSaveStatus('saving');
    const opts: SerializeOptions = {
      stats: data.stats,
      items: data.items,
      battles: data.battles,
      bodyUpgrade: data.bodyUpgrade,
      headUpgrade: data.headUpgrade,
      fistsUpgrade: data.fistsUpgrade,
      unlimitedEnergy: unlimited,
      unlockAllLevels: false,
    };
    try {
      const content = serializeSF2Save(data.save, opts);
      const result = await window.electron.file.save({ filePath, content });
      setSaveStatus(result.ok ? 'saved' : 'error');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const loadFileResult = useCallback((result: { filePath: string; content: string; name: string }) => {
    const data = parseSF2Save(result.content);
    setCurrentFile({ path: result.filePath, name: result.name });
    setGameData(data);
    setSaveStatus('saved');
    setUnlimitedEnergy(false);
  }, []);

  const handleOpenFile = useCallback(async () => {
    const result = await window.electron.file.open();
    if (!result) return;
    try { loadFileResult(result); }
    catch { alert('Failed to parse save file. Make sure it is a valid SF2 save.'); }
  }, [loadFileResult]);

  const handleOpenByPath = useCallback(async (filePath: string) => {
    const result = await window.electron.file.openByPath(filePath);
    if (!result) return;
    try { loadFileResult(result); }
    catch { alert('Failed to parse save file: ' + result.name); }
  }, [loadFileResult]);

  const handleSave = useCallback(() => {
    if (!gameData || !currentFile) return;
    serializeAndSave(gameData, currentFile.path, unlimitedEnergy);
  }, [gameData, currentFile, unlimitedEnergy, serializeAndSave]);

  const handleRestore = useCallback(async () => {
    if (!currentFile) return;
    const backupPath = currentFile.path + '.backup';
    const result = await window.electron.file.openByPath(backupPath);
    if (!result) {
      alert('No backup found. Save the file first to create a backup.');
      return;
    }
    try {
      const data = parseSF2Save(result.content);
      await serializeAndSave(data, currentFile.path, false);
      setGameData(data);
      setUnlimitedEnergy(false);
      setSaveStatus('saved');
    } catch {
      alert('Failed to restore backup.');
    }
  }, [currentFile, serializeAndSave]);

  const handleUpdateData = useCallback((partial: Partial<SF2GameData>) => {
    setGameData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      setSaveStatus('unsaved');
      if (autoSave && currentFile) {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          serializeAndSave(next, currentFile.path, unlimitedEnergy);
        }, 1000);
      }
      return next;
    });
  }, [autoSave, currentFile, unlimitedEnergy, serializeAndSave]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleSave(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') { e.preventDefault(); handleOpenFile(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSave, handleOpenFile]);

  return (
    <div className="flex h-screen flex-col bg-bg-base overflow-hidden">
      <TitleBar
        fileName={currentFile?.name}
        saveStatus={saveStatus}
        autoSave={autoSave}
        onToggleAutoSave={() => setAutoSave((v) => !v)}
        onSave={handleSave}
        canSave={!!gameData && !!currentFile}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedGame={selectedGame} onSelectGame={(id) => setSelectedGame(id as GameId)} />
        <main className="flex-1 overflow-hidden">
          {!gameData ? (
            <FileDropZone onOpen={handleOpenFile} onOpenByPath={handleOpenByPath} />
          ) : (
            <SF2Editor
              data={gameData}
              unlimitedEnergy={unlimitedEnergy}
              onUnlimitedEnergyChange={setUnlimitedEnergy}
              onChange={handleUpdateData}
              onSave={handleSave}
              onRestore={handleRestore}
            />
          )}
        </main>
      </div>
    </div>
  );
}
