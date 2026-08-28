# OneGunLifetime

OneGunLifetime is an addon mod for [ModularShoot](../modularshoot/) running on NeoForge 1.21.1. It adds a "soul-bound gun" playstyle: **the player binds to one gun, and that gun is the player themselves**. After binding, the player's stats and traits always live on the player; the gun item in the inventory is only a projection. Lost guns are automatically restored, and other guns entering the inventory are assimilated.

> **Dependency**: This is an addon for ModularShoot and **requires** [ModularShoot](../modularshoot/) 0.3.1 or newer on both the server and the client.

## Features

| Feature | Description |
|---------|-------------|
| **Soul binding** | Bind once per player via command; creates a personal projection gun while the player entity is the single source of truth |
| **The player is the gun** | Stat and plugin modifiers are mounted directly on the player, so they work even when empty-handed |
| **Inventory exclusivity & assimilation** | Other ModularShoot guns entering the inventory are replaced/voided; their plugins are merged when possible, otherwise returned as plugin items |
| **Loss recovery** | Dropping is blocked and immediately restored; destruction (lava etc.) rebuilds the gun; admin `/clear` intentionally does not restore |
| **Container guard** | Projection guns cannot be placed into containers; missed paths are cleaned up by a low-frequency container scan |
| **Plugin compatibility** | Install/uninstall follow framework rules, and the plugin list is written back into soul data automatically |
| **Non-owner shooting block** | Other players cannot fire a picked-up projection gun; unbound players receive a memorial instead of a working gun |

## Quick Start

1. Install this mod plus ModularShoot 0.3.1+ (NeoForge 21.1.233+, MC 1.21.1)
2. Run `/onegun bind <gunId>` to bind a registered gun, e.g. `/onegun bind modularshoot:demo_pistol`
3. After binding, your projection gun appears in your inventory; use `/onegun stat set` and `/onegun trait add` to customize it
4. Other guns entering your inventory are assimilated; dropped/destroyed guns are restored automatically

## Documentation

| Page | Audience | Contents |
|------|----------|----------|
| [Gameplay Guide](./GameplayGuide.md) | Players who want the full mechanics | Binding, projection guns, player-mounted stats, assimilation, recovery, container guard, memorials |
| [Command Reference](./CommandReference.md) | Players and admins | All `/onegun` subcommands and examples |
| [API Reference](./API.md) | Mod developers | `OneGunLifetimeAPI` — programmatic bind/unbind, stats, traits, plugins, effective values |