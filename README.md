<div align="center">
  <img src="public/banner.svg" alt="CheatLab Banner" width="100%" />
</div>

<div align="center">

  [![GitHub release](https://img.shields.io/github/v/release/kdo2064/cheatlab?style=flat-square&color=a3d900&label=latest)](https://github.com/kdo2064/cheatlab/releases)
  [![Downloads](https://img.shields.io/github/downloads/kdo2064/cheatlab/total?style=flat-square&color=4d7ff0&label=downloads)](https://github.com/kdo2064/cheatlab/releases)
  [![Stars](https://img.shields.io/github/stars/kdo2064/cheatlab?style=flat-square&color=f0c040&label=stars)](https://github.com/kdo2064/cheatlab/stargazers)
  [![Forks](https://img.shields.io/github/forks/kdo2064/cheatlab?style=flat-square&color=9b59b6&label=forks)](https://github.com/kdo2064/cheatlab/forks)
  [![License](https://img.shields.io/badge/license-MIT-a3d900?style=flat-square)](LICENSE)
  [![Visitors](https://visitor-badge.laobi.icu/badge?page_id=kdo2064.cheatlab&style=flat-square&color=2557d4)](https://github.com/kdo2064/cheatlab)

</div>

---

## What is CheatLab?

**CheatLab Desktop** is a fast, offline-capable save file editor for mobile games — built for Windows. No browser, no internet required. Just open your save, edit values, save — done.

Currently supports **Shadow Fight 2** with a clean, tool-like interface built for power users.

---

## Features

|  | Feature | Description |
|---|---|---|
| 🔍 | **Auto Scan** | Finds SF2 saves from Windows Store, BlueStacks, LDPlayer, Nox, MEmu automatically |
| 💾 | **Auto Save** | 1-second debounce auto-save — changes save as you type |
| 🔧 | **BOM Fix** | Handles Windows Store saves with UTF-8 BOM (fixes the common parse error) |
| 🔄 | **Auto Update** | Pulls new releases from GitHub silently — no reinstall needed |
| 📦 | **Portable** | Single `.exe`, no Node.js or runtime needed on target machine |
| 🖥️ | **Frameless UI** | Custom window chrome, drag regions, professional dark theme |
| 🔌 | **Offline** | Fully offline — no server, no account, no internet required |

---

## Supported Games

| Game | Status | Source |
|---|---|---|
| Shadow Fight 2 | ✅ **Supported** | Windows Store · BlueStacks · LDPlayer · Nox · MEmu |
| Minecraft | 🔜 Coming soon | — |
| Terraria | 🔜 Coming soon | — |
| Stardew Valley | 🔜 Coming soon | — |

---

## Download

<div align="center">

[![Download Latest](https://img.shields.io/github/v/release/kdo2064/cheatlab?style=for-the-badge&color=2557d4&label=Download%20Latest&logo=windows)](https://github.com/kdo2064/cheatlab/releases/latest)

</div>

| File | Type | Info |
|---|---|---|
| `CheatLab Setup x.x.x.exe` | Installer | Recommended — desktop shortcut, auto-update |
| `CheatLab-x.x.x-portable.exe` | Portable | No install — copy anywhere and run |

---

## Build from Source

> Requires [Node.js 18+](https://nodejs.org)

```bash
# Clone
git clone https://github.com/kdo2064/cheatlab.git
cd cheatlab

# Install dependencies
npm install

# Dev mode (hot reload)
npm run dev

# Build Windows installer + portable
npm run build:win
```

Output → `dist-electron/`

---

## Project Structure

```
cheatlab/
├── electron/
│   ├── main.cjs          # Main process — file I/O, IPC, auto-updater
│   └── preload.cjs       # Context bridge (renderer ↔ main)
├── src/
│   ├── components/       # React UI components
│   │   ├── TitleBar.tsx  # Window chrome + save status + update banner
│   │   ├── Sidebar.tsx   # Game selector
│   │   ├── FileDropZone.tsx  # Home screen — scan + open
│   │   └── Editor/       # SF2 editor tabs
│   └── App.tsx
├── public/               # Static assets (logo, wordmark, banner)
├── assets/               # Build assets (app icon for electron-builder)
└── .github/workflows/    # CI/CD
    ├── ci.yml            # Push → typecheck + build verify
    └── release.yml       # Tag → build + GitHub Release
```

---

## CI / CD

| Trigger | Action |
|---|---|
| Push to `main` | TypeScript check + Vite build (verify only, no publish) |
| Push `v*.*.*` tag | Full Windows build → create GitHub Release + upload `.exe` |

**To ship a release:**

```bash
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions builds the `.exe` and creates the release automatically.

---

## Contributing

Contributions are welcome — bug fixes, new game support, UI improvements, anything.

### How to contribute

1. **Fork** this repo (button top-right)
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes
4. Open a Pull Request

### Adding a new game

Each game gets its own component. SF2's implementation is the reference — follow the same pattern and open a PR.

### Credit

If you fork CheatLab and build something new — go ahead. Just keep the original credit somewhere visible:

```
Based on CheatLab by KDO — https://github.com/kdo2064/cheatlab
```

No need to ask permission. That attribution line is the only ask.

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

<div align="center">
  <br/>
  <img src="rec/cheatlab_wrokmark.png" alt="CheatLab" height="32" />
  <br/>
  <sub>Built by <strong>KDO</strong></sub>
</div>
