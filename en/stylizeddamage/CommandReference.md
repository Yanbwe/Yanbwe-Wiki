# Command Reference

All commands use `/stylizeddamage` as the root.

> **Platform differences:**
> - **Forge 1.20.1**: the root command requires permission level 2, so `reload` / `test` / `list` / `toggle` all require permission 2.
> - **NeoForge 1.21.1**: `reload` / `list` / `toggle` are server-side commands and require permission 2; `test` is a client-side command and requires permission 1.

## `/stylizeddamage reload`

Hot-reloads `common.json` and all style files under `styles/`.

- **Permission**: 2 (admin only)

Example:

```
/stylizeddamage reload
```

## `/stylizeddamage test <type> <amount>`

Spawns a test damage number at the crosshair.

- **Permission**: Forge 1.20.1: 2; NeoForge 1.21.1: 1 (cheats only)
- **Arguments**:
  - `<type>`: damage type ID, e.g. `minecraft:in_fire`, `heal`
  - `<amount>`: damage value, e.g. `12.5`

Examples:

```
/stylizeddamage test minecraft:in_fire 15
/stylizeddamage test heal 10
```

> **Known limitation**: In the current NeoForge 1.21.1 build, the `test` command only reports success and does not actually send a packet or enqueue the renderer, so it may not display a number on the HUD yet.

## `/stylizeddamage list`

Lists all loaded styles and selector bindings.

- **Permission**: Forge 1.20.1 and NeoForge 1.21.1: 2 (admin only)

Example:

```
/stylizeddamage list
```

## `/stylizeddamage toggle`

Toggles damage number display on/off. When disabled, neither floating damage numbers nor the total-damage panel are rendered.

- **Permission**: Forge 1.20.1 and NeoForge 1.21.1: 2 (admin only)

Example:

```
/stylizeddamage toggle
```