# ModularShootAmmo

**https://github.com/Yanbwe/ModularShootAmmo**

ModularShootAmmo is an **ammo addon mod** for the [ModularShoot](./) framework, running on NeoForge 1.21.1. It brings magazine-based ammunition, reloading, and an ammo HUD to framework guns.

> **Dependency**: This is a companion mod for the framework — the [ModularShoot](./) framework is **required**. It implements the "loading half" beside the framework's shooting engine: ammo, reloading, reserves, and the HUD.

## Features

| Feature | Description |
|---------|-------------|
| **Magazine-based ammo** | A gun opts in by declaring the `uses_ammo` trait in its data pack JSON; magazine count lives in framework GunState, capacity/reload time ride the attribute pipeline (modifiable by plugins, e.g. +15 extended mag) |
| **Per-shot consumption** | Server-side deduction by `per_shot_cost` (multiple shells per shot supported); creative mode and the `infinite_ammo` trait exempt; firing blocked when empty or reloading |
| **Full reload loop** | Manual reload with R + auto-reload by dry-firing; switching/holstering, death and logout interrupt the countdown; reserve ammo drawn across inventory stacks with `reserve_limit` support |
| **Ammo type system** | `ammo_types` registry: tint color, per-shot cost, reserve cap, and dedicated reload sounds are all configurable |
| **Gun→ammo bindings** | `gun_ammo_bindings` registry (data pack / Java, dual path), synced to clients over the network |
| **Ammo HUD** | `mag/reserve` (type-tinted, red when empty, ∞ for infinite) + reload progress bar; offset/scale/anchor/toggles all configurable |
| **Tooltips** | Ammo items show their ammo type; guns show ammo type and per-shot cost after the attribute section |
| **Debug command** | `/modularammo info\|ammo\|fill\|bind` (op 2) |
| **Java API** | `ModularAmmoAPI` for bindings and queries, surviving `/reload` |

## Quick Start

1. Install this mod plus the [ModularShoot](./) framework (NeoForge 21.1.233+, MC 1.21.1)
2. Grab the demo pistol/shotgun and four ammo types from the "ModularShoot: Ammo" creative tab
3. Hold right-click to fire; press **R** once the magazine runs dry (or just dry-fire to auto-reload)

## Documentation

| Page | Audience | Contents |
|------|----------|----------|
| [Data Packs](./DataPack.md) | Devs wiring ammo into their guns via JSON | `ammo_types` / `gun_ammo_bindings` formats and framework-side items |
| [API Reference](./API.md) | Devs calling ammo features from code | `ModularAmmoAPI` method reference and registry keys |
| [Command Reference](./CommandReference.md) | Devs using the debug command | `/modularammo` subcommands |
| [Client Configuration](./Configuration.md) | Players tweaking the HUD | All HUD options |

## Demo Content

| Item | Description |
|------|-------------|
| Demo pistol | 12-round magazine, `hit_damage 6`, bound to pistol ammo (#FFAA00) |
| Demo shotgun | 6 shells × 2 per shot, four pellets, bound to shotgun ammo (#AAFF00) |
| 4 ammo types | Pistol/rifle/shotgun/sniper (yellow/orange/green/purple textures) |
| Extended-mag plugin | `demo_extended_mag`, +15 magazine capacity |
