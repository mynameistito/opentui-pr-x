# opentui-pr-x

Minimal live repro for [OpenTUI PR #1548](https://github.com/anomalyco/opentui/pull/1548).

This app smoothly cycles its renderer background through RGB using `CliRenderer.setBackgroundColor()` from the PR build. In a supported Windows Terminal session, OpenTUI sends OSC 11 on each color change so the unused pixel gutter follows the TUI; it sends OSC 111 on exit only after setting that override. Ghostty and other terminals are intentionally not modified.

## Run against the PR build

The package is linked to a sibling checkout of the PR branch, not the published npm release. These setup commands use PowerShell and do not require `sh`. Use Bun and Zig 0.16.

```powershell
git clone --branch fix/windows-terminal-bg-sync https://github.com/mynameistito/opentui.git opentui
git clone https://github.com/mynameistito/opentui-pr-x.git opentui-pr-x

cd opentui
bun install
cd packages/native
New-Item -ItemType Directory -Path zig-deps -Force | Out-Null
tar -xzf src/vendor/zig-deps.tar.gz -C zig-deps
zig build -Doptimize=ReleaseFast

cd ../core
bun scripts/build.ts --native --skip-zig --skip-symbols
bun link

cd ../../../opentui-pr-x
bun install
bun link @opentui/core
bun run demo
```

For a short startup/shutdown smoke run, use `bun run demo --smoke`.

If you already have the PR checkout and this repo as sibling directories, skip the clones and run the build/install commands from those directories. The explicit Zig build plus `--skip-zig` copy step avoids the `sh`-based native build wrapper on Windows.

## Remove the local Bun link

From this repro directory, remove the symlink created by `bun link @opentui/core`:

```powershell
Remove-Item .\node_modules\@opentui\core
```

To unregister the source checkout as a globally linkable package, run this from `opentui\packages\core`:

```powershell
bun unlink
```

## Observe it

Run in Windows Terminal (`WT_SESSION` must be set), with a terminal profile background that differs from the demo colors. Maximize or snap the window so the unused right/bottom pixel gutter is visible. The app surface and gutter should cycle through red, green, blue, and intermediate colors together; the gutter returns to the profile background on Ctrl+C.

The code only syncs terminal background when the terminal is identified as Windows Terminal. Other terminal emulators—including Ghostty—are deliberately left unchanged because OSC 11/111 can leave stale background values there after an OS theme change.
