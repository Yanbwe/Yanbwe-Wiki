# API Reference

`OneGunLifetimeAPI` exposes static methods for other mods to use the soul-binding capability programmatically, without relying on commands. Methods are grouped by function.

**Common conventions**: mutating methods require a `ServerPlayer` (server-authoritative) and return result objects instead of throwing business exceptions; query methods accept a `Player`. Plugin changes go through the ModularShoot install/uninstall pipeline — soul data write-back, server-wide broadcast and attribute refresh happen automatically.

## Queries

| Signature | Parameters | Returns | Description |
|---------|---------|--------|------|
| `getSoulData(Player player)` | `player` — target player | `Optional<SoulData>` | The player's soul data (template gun, stat overrides, traits, plugins, gun state, ...); empty when unbound |
| `isBound(Player player)` | `player` — target player | `boolean` | Whether the player has a soul binding |
| `getOwnerOf(ItemStack gunStack)` | `gunStack` — any item stack | `Optional<UUID>` | If the stack is a player's projection gun, returns its owner UUID; empty otherwise |
| `getPlugins(Player player)` | `player` — target player | `List<PluginInstance>` | The current ordered plugin list; empty when unbound |
| `getGunState(Player player)` | `player` — target player | `Optional<CompoundTag>` | Runtime gun state NBT; empty when unbound |
| `getEffectiveValues(ServerPlayer player)` | `player` — target player | `Map<ResourceLocation, Double>` | **Final values** of every player-applicable logical attribute (base + overrides + traits + plugin bonuses); empty when unbound. Pure computation with no entity access — cache the result for frequent calls |

## Lifecycle

| Signature | Parameters | Returns | Description |
|---------|---------|--------|------|
| `bindAndGive(ServerPlayer player, ResourceLocation templateGunId)` | `player` — target player; `templateGunId` — registered template gun id | `BindResult` | One-step bind: validate the template registration → bind the soul → give a fresh projection gun (dropped at the player's feet when the inventory is full) → refresh attributes |
| `unbindAll(ServerPlayer player)` | `player` — target player | `boolean` | Full unbind: unbind + clear every attribute modifier mounted by this mod + remove the owner's projection guns from main inventory, armor and offhand. Returns `false` when unbound (idempotent) |
| `rescan(ServerPlayer player)` | `player` — target player | `void` | Forces one full inventory scan now (dedup, foreign-gun assimilation, projection recovery, plugin backfill); no effect for unbound players |

## Stats & Traits

Validation included: attribute ids must exist in the `modularshoot:attribute_meta` registry, trait ids in `modularshoot:traits`, and values must be finite doubles.

| Signature | Parameters | Returns | Description |
|---------|---------|--------|------|
| `setStatOverride(ServerPlayer player, ResourceLocation key, double value)` | `key` — logical attribute id; `value` — new value | `MutationResult` | Writes one stat override and refreshes |
| `removeStatOverride(ServerPlayer player, ResourceLocation key)` | `key` — logical attribute id | `MutationResult` | Removes one stat override and refreshes |
| `clearStatOverrides(ServerPlayer player)` | — | `MutationResult` | Clears all stat overrides and refreshes |
| `addTrait(ServerPlayer player, ResourceLocation traitId)` | `traitId` — trait id | `MutationResult` | Adds a trait and refreshes |
| `removeTrait(ServerPlayer player, ResourceLocation traitId)` | `traitId` — trait id | `MutationResult` | Removes a trait and refreshes |

## Plugins & Gun State

| Signature | Parameters | Returns | Description |
|---------|---------|--------|------|
| `addPlugin(ServerPlayer player, ResourceLocation pluginId)` | `pluginId` — plugin definition id | `PluginChangeResult` | Installs a plugin by id onto the player's projection gun, reusing the full ModularShoot install validation (slot type, capacity, lock). The installed copy is written back to its slot; rejection details in `rejectionReason()`. **Returns `NO_PROJECTION` instead of silently creating a gun when the player has no projection gun** |
| `removePlugin(ServerPlayer player, UUID pluginInstanceUuid)` | `pluginInstanceUuid` — plugin instance UUID | `PluginChangeResult` | Removes one installed plugin by instance UUID (no force, no item return); rejection details (locked / UUID not found / ...) in `rejectionReason()` |
| `setGunState(ServerPlayer player, CompoundTag state)` | `state` — new gun state NBT | `void` | Replaces the runtime gun state. Throws `IllegalStateException` when unbound |

## Result Types

### BindResult (enum)

| Value | Meaning |
|----|------|
| `SUCCESS` | Bound; the player has received a projection gun |
| `ALREADY_BOUND` | The player already has a soul binding |
| `NOT_REGISTERED` | The template gun id is not registered in ModularShoot |

### MutationResult (enum)

| Value | Meaning |
|----|------|
| `SUCCESS` | Operation succeeded |
| `NOT_BOUND` | The player is not bound |
| `INVALID_ATTRIBUTE` | The attribute id is not registered |
| `INVALID_VALUE` | The value is not a finite double |
| `INVALID_TRAIT` | The trait id is not registered |

### PluginChangeResult (record)

| Member | Description |
|------|------|
| `status()` | `SUCCESS` / `NOT_BOUND` / `NO_PROJECTION` (no projection gun in inventory) / `UNKNOWN_PLUGIN` (plugin id not registered) / `NOT_INSTALLED` (rejected by the framework) |
| `rejectionReason()` | Localizable rejection reason (framework install error or uninstall reason); non-null only for `NOT_INSTALLED` |
| `success()` | Convenience check: `status == SUCCESS` |

## Usage Example

```java
// One-step bind: bind + give gun + refresh attributes
BindResult result = OneGunLifetimeAPI.bindAndGive(
        player, ResourceLocation.fromNamespaceAndPath("modularshoot", "demo_pistol"));
if (result != BindResult.SUCCESS) {
    player.sendSystemMessage(Component.literal("bind failed: " + result));
}

// Read the player's effective value panel
Map<ResourceLocation, Double> values = OneGunLifetimeAPI.getEffectiveValues(player);
double damage = values.getOrDefault(
        ResourceLocation.fromNamespaceAndPath("modularshoot", "bullet_damage"), 0.0);

// Programmatic plugin install/remove
PluginChangeResult added = OneGunLifetimeAPI.addPlugin(
        player, ResourceLocation.fromNamespaceAndPath("modularshoot", "scope_basic"));
if (!added.success()) {
    player.sendSystemMessage(added.rejectionReason());
}
```
