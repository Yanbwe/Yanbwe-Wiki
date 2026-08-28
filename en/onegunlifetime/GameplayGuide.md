# Gameplay Guide

## Core Concept

The core idea of OneGunLifetime is **soul binding**: **the player is the gun**. After binding, the template, stat overrides, traits, plugins, and runtime state all have the player entity as their single source of truth; the gun item in the inventory is only a projection that can be destroyed and rebuilt at any time.

- **Template gun**: the ModularShoot gun ID chosen at bind time; it provides the initial look and base data.
- **Projection gun**: the gun item generated in your inventory after binding, using a player-specific dynamic gun ID.
- **Soul data**: data stored on the player, containing the template, overrides, traits, plugins, and runtime state.

## Binding

- Use `/onegun bind <gunId>` to bind. Each player can bind only once.
- On success, a projection gun is placed in your inventory and attribute modifiers are mounted on your player entity.
- Re-binding is rejected; admins can use `/onegun unbind <player>` to clear a binding.

## Stats and Traits

After binding, you can customize your gun with commands:

- `/onegun stat set <attributeId> <value>`: override a base attribute value.
- `/onegun stat reset`: clear overrides and return to template values.
- `/onegun trait add|remove <traitId>`: add or remove final traits.

Because modifiers are mounted on the player entity, **the bonuses work no matter what you are holding, even when empty-handed**.

## Inventory Exclusivity and Assimilation

- In your personal inventory (main inventory, hotbar, offhand, armor), there can only be one valid projection gun per player.
- When another ModularShoot gun enters the inventory:
  - If no projection gun exists yet: the slot is replaced with your projection gun.
  - If a projection gun already exists: the foreign gun is voided.
- Attempting to fire a foreign gun immediately aborts the shot, and the gun is assimilated on the next tick — a foreign gun can never be fired.
- Plugins on an assimilated gun are merged into the projection gun when possible; plugins that cannot fit (capacity, exclusivity, etc.) are returned to the inventory or dropped at your feet.
- Creative mode is subject to the same rules.

## Loss and Recovery

- **Dropping**: the drop is cancelled and a new projection gun is restored immediately — you effectively cannot throw it away.
- **Destruction recovery**: if the gun is destroyed by lava, cactus, etc., the next scan will rebuild it when your inventory has no projection gun.
- **Admin clear**: the `/clear` command suppresses the recovery in the next scan once; later natural destruction is still recovered.
- **Death drops**: they follow vanilla rules and are not treated as active drops. If another player picks up the gun, the rules below apply.

## Container Guard

- Projection guns cannot be placed into containers such as chests or ender chests.
- Player-driven insertion paths are blocked and the gun is returned to the inventory; missed paths such as hoppers or third-party pipes are handled by a low-frequency container recovery scan.
- When a container scan finds a projection gun, it returns it to the owner; if it cannot be returned, it is voided to keep only one valid soul gun in the world.

## Other Players and Memorials

- A non-owner cannot fire a picked-up projection gun.
- If the picker is already bound to their own gun: their inventory scan handles it (existing projection means the foreign gun is voided).
- If the picker is unbound: the item is converted into a **memorial** — gun data and plugin data are removed, so it no longer participates in shooting or scanning. The original owner gets a new projection gun.

## Plugin Compatibility

- Plugin install/uninstall on projection guns uses the framework's existing interactions and validation (capacity, exclusive groups, locking).
- Plugin changes are automatically written back into soul data and refresh the player-mounted attribute modifiers.
- Paths that do not fire server-side events, such as creative menu edits, are synced by the inventory-scan backfill.

## Degradation

- If the template gun is removed from the data pack, the binding still works: the synthesized definition degrades to a minimal fallback that keeps only the player's overrides and traits.
- If client sync has not arrived yet, queries follow the framework's degradation path instead of throwing.
- The first version has no configuration file; all behavior is fixed.