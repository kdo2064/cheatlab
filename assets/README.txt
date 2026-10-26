Place your icon files here:

  icon.ico  — Windows app icon (256x256 recommended, multi-size ICO)
  icon.png  — Source PNG (512x512 or 1024x1024)

electron-builder will use icon.ico for the Windows build.
If you only have a PNG, rename it to icon.png and update package.json:
  "win": { "icon": "assets/icon.png" }
