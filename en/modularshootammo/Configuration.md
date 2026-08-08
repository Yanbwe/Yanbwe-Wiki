# Client Configuration

Client config file `modularshootammo-client.toml` (NeoForge config system), located in the standard config directory. Editable in-game via **Options → Mods → ModularShootAmmo**; changes take effect **next frame** after saving — no restart needed.

> This mod has no server-side configuration; everything below is client (HUD) config.

## Options

| Config key | Type | Default | Range | Description |
|------------|------|---------|-------|-------------|
| `hud.offsetX` | Integer | `8` | 0-2000 | HUD offset from the right/left screen edge (GUI-scaled pixels) |
| `hud.offsetY` | Integer | `8` | 0-2000 | HUD offset from the bottom/top screen edge (GUI-scaled pixels) |
| `hud.scale` | Double | `1.0` | 0.25-4.0 | HUD overall scale factor |
| `hud.showReserve` | Boolean | `true` | — | Show the reserve count (second segment of the `mag/reserve` format); when off, only the magazine count is shown |
| `hud.showReloadProgress` | Boolean | `true` | — | Show the reloading message and progress bar while reloading |
| `hud.anchor` | Enum | `BOTTOM_RIGHT` | `BOTTOM_RIGHT` / `BOTTOM_LEFT` / `TOP_RIGHT` / `TOP_LEFT` | HUD corner anchor |

## HUD Display Rules

- While holding a gun with the ammo system enabled (`uses_ammo`), line 1 shows: `mag/reserve`
  - Both numbers are tinted with the bound ammo type's color
  - An empty magazine turns the numbers red (`0xFFFF5555`) as a warning
  - Infinite ammo (`infinite_ammo`) or creative mode show `∞`
- While reloading, line 2 shows the reload message plus a progress bar (controlled by `hud.showReloadProgress`)
