# API Reference

Quick reference for all public static methods in ModularShootAPI. Methods grouped by function.


## Item Checks

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `isGun(ItemStack stack)` | `stack` — the item stack to check | `boolean` | Checks whether the stack is a framework gun (`modularshoot:gun`). Tests item type only |
| `isPlugin(ItemStack stack)` | `stack` — the item stack to check | `boolean` | Checks whether the stack is a framework plugin (`modularshoot:plugin`). Tests item type only |

## Data Queries

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getGunId(ItemStack gun)` | `gun` — the gun item stack | `ResourceLocation` (nullable) | Gets the gun definition ID. Returns `null` for non-gun items or when no `gun_data` component exists |
| `getGunData(ItemStack gun)` | `gun` — the gun item stack | `Optional<GunData>` | Gets the full GunData component (gun ID, instance UUID, installed plugin list, modifierVersion, per-gun state) |
| `getPluginId(ItemStack stack)` | `stack` — the plugin item stack | `Optional<ResourceLocation>` | Gets the plugin definition ID. Returns empty for non-plugin items or when no `plugin_data` component exists |
| `getPluginData(ItemStack stack)` | `stack` — the plugin item stack | `Optional<PluginData>` | Gets the full PluginData component (contains plugin ID) |
| `getInstalledPlugins(ItemStack gun)` | `gun` — the gun item stack | `List<PluginInstance>` (immutable) | Queries the list of plugins installed on the gun. Returns empty list for non-gun items or when no plugins are installed |

## Uninstall API

All uninstall methods automatically refresh the `ATTRIBUTE_MODIFIERS` component on success. `RegistryAccess` is obtained internally via `player.level().registryAccess()` — callers no longer need to pass it manually.

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `uninstallPlugin(ItemStack gun, UUID instanceUuid, Player player, boolean force, boolean returnItems)` | `gun` — target gun (mutated); `instanceUuid` — plugin instance UUID to remove; `player` — player context; `force` — ignore lock flag; `returnItems` — return uninstalled plugin as item | `UninstallResult` | Uninstalls a specific plugin by its instance UUID |
| `uninstallRandomPlugin(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — target gun; `player` — player context; `force` — ignore lock; `returnItems` — return item | `UninstallResult` | Randomly uninstalls one uninstallable plugin |
| `uninstallPluginsByType(ItemStack gun, Player player, ResourceLocation pluginTypeId, boolean force, boolean returnItems)` | `gun` — target gun; `player` — player context; `pluginTypeId` — plugin type ID to match; `force` — ignore lock; `returnItems` — return items | `List<UninstallResult>` | Uninstalls all plugins of the specified type. Returns empty list when no match |
| `uninstallAllPlugins(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — target gun; `player` — player context; `force` — ignore lock; `returnItems` — return items | `List<UninstallResult>` | Uninstalls all installed plugins. Returns empty list when none installed |

> **Backward compatibility**: The old signatures with an extra `RegistryAccess` parameter are retained as `@Deprecated` overloads. They still work but the new signatures are recommended — they lower the call barrier by obtaining `RegistryAccess` from `player.level().registryAccess()` automatically.

Parameter details:
- **`player`**: Player context for the operation. When `returnItems` is `true`, uninstalled plugins are returned to the player's inventory (dropped if full); otherwise deleted
- **`force`**: `true` to force-uninstall (ignores `locked` flag); `false` to skip locked plugins
- **`returnItems`**: `true` to return the uninstalled plugin as an item to the player; `false` to destroy it

## Lock API

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `setPluginLocked(ItemStack gun, UUID instanceUuid, boolean locked, RegistryAccess registryAccess)` | `gun` — gun item; `instanceUuid` — plugin instance UUID; `locked` — `true` to lock / `false` to unlock; `registryAccess` — runtime registry view | `void` | **Preferred**. Locks or unlocks a specific installed plugin and refreshes the `ATTRIBUTE_MODIFIERS` component. Locked plugins are skipped by normal uninstall (`force=false`) |
| `isPluginLocked(ItemStack gun, UUID instanceUuid)` | `gun` — gun item; `instanceUuid` — plugin instance UUID | `boolean` | Queries whether the specified plugin is locked. Returns `false` when plugin doesn't exist or is unlocked |

> **Backward compatibility**: The old 3-parameter overload `setPluginLocked(ItemStack gun, UUID instanceUuid, boolean locked)` is `@Deprecated` and does **not** refresh the `ATTRIBUTE_MODIFIERS` component. Prefer the 4-parameter overload above whenever a `RegistryAccess` is available.

## Registration API

Call these methods during mod initialization (constructor or `FMLCommonSetupEvent`).

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `registerGun(ResourceLocation gunId, GunDefinition definition)` | `gunId` — gun definition ID (e.g. `modularshoot:sniper_rifle`); `definition` — gun definition object | `void` | Registers a gun via the Java API. Automatically marks the ID as API-registered; later datapack JSON with the same ID is rejected |
| `registerPluginValidator(PluginValidator validator)` | `validator` — custom install validator (functional interface: `(ItemStack, ResourceLocation) → ValidationResult`) | `void` | Registers a custom plugin install validator. Runs after framework default checks pass; returning failure aborts installation |
| `registerShootPredicate(ShootPredicate predicate)` | `predicate` — shoot condition checker (functional interface: `(Player, ItemStack) → ShootPredicateResult`) | `void` | Registers a shoot condition predicate. Runs after fire-rate control passes; returning failure prevents shooting and shows the reason. Framework registers 0 by default |
| `registerTraitHook(ResourceLocation traitId, TraitHookType type, T callback)` | `traitId` — trait definition ID; `type` — hook type enum (`ON_TICK`/`ON_HIT`/`ON_BLOCK_HIT`/`ON_EXPIRE`/`ON_REMOVE`/`ON_VISUAL_TICK`); `callback` — callback implementation, type must match `type` | `void` | Registers a runtime hook callback for a trait. Multiple callbacks per trait+type are supported, fired in registration order |
| `registerDamageHandler(DamageHandler handler)` | `handler` — damage post-processor (functional interface: `(BulletRecord, Entity, double) → double`) | `void` | Registers a global damage handler, executed after bullet hit and before damage application. Chain-called in registration order; each return value feeds the next input |
| `markJavaApiRegistered(ResourceKey<Registry<T>> registryKey, ResourceLocation id)` | `registryKey` — registry key (e.g. `ModularShootRegistries.GUNS_KEY`); `id` — entry identifier | `void` | Marks an ID as registered by the Java API (prevents datapack JSON conflicts). Usually called automatically inside `registerGun` etc. |

### TraitHookType Enum Values

| Enum Value | Hook | Callback Parameters | Side |
|-----------|------|-------------------|------|
| `ON_TICK` | onTick | `(BulletRecord, BulletSnapshot)` | Server |
| `ON_HIT` | onHit | `(BulletRecord, BulletSnapshot, Entity)` | Server |
| `ON_BLOCK_HIT` | onBlockHit | `(BulletRecord, BulletSnapshot, BlockPos, Direction)` | Server |
| `ON_EXPIRE` | onExpire | `(BulletRecord, BulletSnapshot)` | Server |
| `ON_REMOVE` | onRemove | `(BulletRecord, BulletSnapshot, RemoveReason)` | Server |
| `ON_VISUAL_TICK` | onVisualTick | Client render object (`BulletRenderObject`) | Client only |

> **onVisualTick contract (modifier-stacking system)**: a bullet's visual composition (base / scale / tint / attach layers) is **frozen at creation time** and cached on `BulletRecord.composedStyle` (server) → sent to the client's `BulletRenderObject` via `BulletS2CPacket`. In-flight `onVisualTick` hooks that want to change appearance should **mutate the `BulletRenderObject` directly** (`setScale` / `setComposedTint` / `setLayers` / swap texture, etc.) — do not mutate `BulletSnapshot` expecting a recomposition; composition is never recomputed in-flight.

## Registry Queries

Require a `RegistryAccess` parameter (obtained from a loaded world; registries are empty on the main menu).

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getGunDefinition(RegistryAccess registryAccess, ResourceLocation gunId)` | `registryAccess` — runtime registry view; `gunId` — gun definition ID | `Optional<GunDefinition>` | Looks up a gun definition |
| `getPluginDefinition(RegistryAccess registryAccess, ResourceLocation pluginId)` | `registryAccess` — runtime registry view; `pluginId` — plugin definition ID | `Optional<PluginDefinition>` | Looks up a plugin definition |
| `getPluginTypeDefinition(RegistryAccess registryAccess, ResourceLocation pluginTypeId)` | `registryAccess` — runtime registry view; `pluginTypeId` — plugin type ID | `Optional<PluginTypeDefinition>` | Looks up a plugin type definition |

## State Access

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getState(ItemStack gun, Player player)` | `gun` — gun item stack; `player` — player context (for resolving runtime registries) | `GunState` (nullable) | Gets a per-gun state read/write view for the gun instance. Returns `null` for non-gun items. Typed accessors: `getInt`/`setInt`/`getDouble`/`setDouble`/`getBoolean`/`setBoolean`/`getString`/`setString`/`getUuid`/`setUuid`/`hasState`/`clearState` |
| `getPlayerState(Player player)` | `player` — the player | `PlayerState` | Gets a per-player state read/write view. Same API as `GunState`, different ownership scope |
| `resolveGunFromSnapshot(BulletSnapshot snapshot, Level level)` | `snapshot` — bullet snapshot; `level` — world instance (nullable) | `ItemStack` (nullable) | Backtracks from a bullet snapshot to the gun ItemStack that fired it. Uses gunInstanceUuid + shooter UUID to search player inventories. Returns `null` for independent firing (turrets), offline players, or dropped guns |

### State Read/Write Methods (`GunState` / `PlayerState` common)

| Method | Description |
|--------|-------------|
| `getInt(stateId)` / `setInt(stateId, value)` | Read/write integer |
| `getLong(stateId)` / `setLong(stateId, value)` | Read/write long |
| `getDouble(stateId)` / `setDouble(stateId, value)` | Read/write double |
| `getFloat(stateId)` / `setFloat(stateId, value)` | Read/write float |
| `getBoolean(stateId)` / `setBoolean(stateId, value)` | Read/write boolean |
| `getString(stateId)` / `setString(stateId, value)` | Read/write string |
| `getUuid(stateId)` / `setUuid(stateId, value)` | Read/write UUID |
| `hasState(stateId)` | Check if state has been written (non-default) |
| `clearState(stateId)` | Clear state (restore default value) |

> Accessing an unregistered state ID returns zero values (int→0, string→"", etc.) and logs a WARN. Same for type mismatch.
