# Configuration

ModularShoot provides two config files (under the game directory's `config/`). The client config can be edited in-game via **Options → Mods → ModularShoot**.

> **New in 0.3.0**: a common config `modularshoot-common.toml` (server-side bullet-sync tuning); the network protocol was bumped to 4 at the same time (not interoperable with older versions).

## Client Config (`modularshoot-client.toml`)

Controls local rendering only — it affects your own view, not the server or other players. Changes apply immediately, no restart required.

### Near-Camera Bullet Translucency (`nearTranslucency`)

Bullets that fly close to the camera fade to semi-transparent so they don't block your view.

| Option | Type | Default | Range | Description |
|--------|------|---------|-------|-------------|
| `nearTranslucency.enabled` | boolean | `true` | — | Master switch. When off, bullets are always fully opaque |
| `nearTranslucency.fadeDistance` | number | `4.0` | 0.5–16.0 | Fade distance (blocks): a bullet becomes fully opaque at this distance from the camera. At distance 0 the `minOpacity` applies, ramping smoothly in between |
| `nearTranslucency.minOpacity` | number | `0.2` | 0.05–1.0 | Opacity at distance 0. Set to `1.0` to effectively disable the fade |

Example:

```toml
[nearTranslucency]
enabled = true
fadeDistance = 4.0
minOpacity = 0.2
```

## Common Config (`modularshoot-common.toml`, new in 0.3.0)

Controls server-side bullet sync. Server owners can tune the bandwidth-vs-smoothness trade-off to fit their server's scale. **All values are server-authoritative**: clients do not need matching values to connect.

### Bullet Sync (`bulletSync`)

Incremental bullet sync is tiered by distance to the player: bullets inside the close band may update every tick; the mid band is throttled to once per `midIntervalTicks`; the far band is throttled to once per `farIntervalTicks`. Additionally, every `fullSyncIntervalTicks` a force-full-sync is sent to recover from dropped packets.

| Option | Type | Default | Range | Description |
|--------|------|---------|-------|-------------|
| `bulletSync.closeDistance` | number | `32.0` | 8–128 | Close-band radius (blocks): bullets within this distance may send position updates every tick |
| `bulletSync.midDistance` | number | `64.0` | 16–256 | Mid-band radius (blocks): bullets between the close band and this value are throttled to `midIntervalTicks`. Values below `closeDistance` are treated as `closeDistance` |
| `bulletSync.midIntervalTicks` | integer | `2` | 1–20 | Minimum tick interval between updates for mid-band bullets |
| `bulletSync.farIntervalTicks` | integer | `4` | 1–40 | Minimum tick interval between updates for far-band bullets (beyond the mid band). Values below `midIntervalTicks` are treated as `midIntervalTicks` |
| `bulletSync.fullSyncIntervalTicks` | integer | `100` | 20–1200 | Interval between force-full-syncs (ticks; 100 = 5 seconds). Used for client self-healing after dropped packets; lower is more stable but costs more bandwidth |

Example:

```toml
[bulletSync]
closeDistance = 32.0
midDistance = 64.0
midIntervalTicks = 2
farIntervalTicks = 4
fullSyncIntervalTicks = 100
```

**Tuning tips**:

- **Prefer smoothness** (heavy close-range bullet gameplay): lower `midIntervalTicks` / `farIntervalTicks` (1–2) and widen `closeDistance`
- **Prefer bandwidth** (large multiplayer servers): raise the intervals and shrink the band radii; the cost is slightly delayed position updates for far bullets (visually acceptable — hit detection always stays server-authoritative)
