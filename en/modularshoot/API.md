# API Reference

Quick reference for all public static methods in ModularShootAPI. Methods grouped by function.


## Item Checks

Recognition is **dual-channel**: the component channel (carrying the `gun_data`/`plugin_data` component) takes precedence, with the binding channel (item ID hitting the `gun_items`/`plugin_items` binding tables) as fallback.

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `isGun(ItemStack stack, RegistryAccess access)` | `stack` — the item stack to check; `access` — runtime registry view (e.g. `player.registryAccess()`) | `boolean` | Checks whether the stack is a gun (native `modularshoot:gun` or a binding-table entry). Use this overload at runtime |
| `isGun(ItemStack stack)` | `stack` — the item stack to check | `boolean` | Degraded overload (when no registry view is available, e.g. the main menu): component channel + Java API binding channel only, **datapack bindings excluded** |
| `isPlugin(ItemStack stack, RegistryAccess access)` | Same as above (plugin version) | `boolean` | Checks whether the stack is a plugin (native `modularshoot:plugin` or a binding-table entry) |
| `isPlugin(ItemStack stack)` | `stack` — the item stack to check | `boolean` | Degraded overload, same semantics as `isGun(stack)` |

## Data Queries

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getGunId(ItemStack gun)` | `gun` — the gun item stack | `ResourceLocation` (nullable) | Gets the gun definition ID. Returns `null` for non-gun items or when no `gun_data` component exists |
| `getGunData(ItemStack gun)` | `gun` — the gun item stack | `Optional<GunData>` | Gets the full GunData component (gun ID, instance UUID, installed plugin list, modifierVersion, per-gun state) |
| `getPluginId(ItemStack stack)` | `stack` — the plugin item stack | `Optional<ResourceLocation>` | Gets the plugin definition ID. Returns empty for non-plugin items or when no `plugin_data` component exists |
| `getPluginData(ItemStack stack)` | `stack` — the plugin item stack | `Optional<PluginData>` | Gets the full PluginData component (contains plugin ID) |
| `resolveGunId(ItemStack stack, RegistryAccess access)` | `stack` — the item stack; `access` — runtime registry view | `Optional<ResourceLocation>` | Dual-channel resolution of the gun definition ID: component first, binding table as fallback. Bound guns resolve through the binding table even before a component is attached |
| `resolvePluginId(ItemStack stack, RegistryAccess access)` | Same as above (plugin version) | `Optional<ResourceLocation>` | Dual-channel resolution of the plugin definition ID. The recommended read path for bound plugins (no component) |
| `getInstalledPlugins(ItemStack gun)` | `gun` — the gun item stack | `List<PluginInstance>` (immutable) | Queries the list of plugins installed on the gun. Returns empty list for non-gun items or when no plugins are installed |
| `getExtraValueSums(ItemStack gun, RegistryAccess registryAccess)` | `gun` — the gun item stack; `registryAccess` — runtime registry view (needs a loaded world) | `Map<ResourceLocation, Double>` (immutable) | Totals a gun's `extra_values`: the gun definition's **base values** plus the `extra_values` of every **valid** plugin (definition still present) installed on it, summed per namespaced key. Degraded plugins and a degraded gun definition are filtered (same contract as the attribute pipeline); keys never declared are absent from the result |
| `getExtraValue(ItemStack gun, ResourceLocation key, RegistryAccess registryAccess)` | `gun` — the gun item stack; `key` — the extension-field key to look up; `registryAccess` — runtime registry view | `double` | Convenience single-key lookup: the total value of `key` on the gun (gun-definition base plus accumulated plugin sums), or `0.0` when undeclared |
| `getEffectiveSlots(ItemStack gun, RegistryAccess access)` | `gun` — the gun item stack; `access` — runtime registry view | `Map<ResourceLocation, Integer>` (immutable) | Queries the gun's current **effective slots** (category → capacity): key set = gun base `slots` ∪ installed plugins' `adds_slots` keys, capacity = base value + Σ installed-plugin contributions (negatives keep their semantics). Empty map for non-gun items or a missing definition. Shares the same aggregation as install matching / uninstall pre-checks — UIs can render install areas without re-implementing it |

## Install API

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `installPlugin(ItemStack gun, ItemStack pluginStack, Player player)` | `gun` — the target gun (not modified); `pluginStack` — the plugin item stack (not modified); `player` — the installing player (must be non-null) | `PluginInstallService.InstallResult` | Programmatically installs a plugin (automation, admin tools, quest rewards...). Runs tag matching, capacity, exclusive-group, custom-validator and pre-install-event checks, then writes to **copies** and consumes one plugin item; returns the modified gun copy and consumed plugin copy for the caller to write back to a container/inventory |
| `installPlugin(ItemStack gun, ItemStack pluginStack, Player player, @Nullable ResourceLocation preferredTypeId)` | Same as above plus `preferredTypeId` — preferred category hint (nullable) | `PluginInstallService.InstallResult` | Installs with a **preferred-category hint** (e.g. a UI dragging a plugin onto a category area). A hit (the hinted category matches by tag and has a free slot) installs directly into that category; a miss or `null` behaves exactly like the three-argument version. The hint is a preference and can never bypass any check; the three-argument version delegates to this one |

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
- **`player`**: Player context for the operation. When `returnItems` is `true`, uninstalled plugins are returned to the player's inventory (dropped if full; degraded plugins excepted); otherwise deleted
- **`force`**: `true` to force-uninstall (ignores `locked` flag and bypasses the overflow pre-check); `false` to skip locked plugins and reject uninstalls that would overflow a slot type
- **`returnItems`**: `true` to return the uninstalled plugin as an item to the player; `false` to destroy it. Exception: plugins whose definition is missing (degraded) are destroyed outright even when `returnItems` is `true`

## Overflow pre-check (`adds_slots`)

A gun with `adds_slots` plugins has an effective slot capacity of gun base + all installed plugins' contributions (see DataPack "Plugin JSON"). Uninstalling a slot-adding plugin removes its contribution, which may leave some slot type over capacity:

- **Non-`force`**: `uninstallPlugin` simulates the capacity after removal and **rejects** the uninstall when any slot type would overflow, returning `reason = WOULD_OVERFLOW` (plugin not removed, not returned, no events fired); `uninstallRandomPlugin` filters candidates that would overflow; batch uninstalls run per-plugin — rejected ones report `WOULD_OVERFLOW`, the rest proceed
- **`force`**: bypasses the pre-check and removes the plugin; the over-capacity plugins **stay in place** (fully functional), but the slot shows as full and can no longer accept new plugins
- `uninstallAllPlugins` removes everything, leaving no plugins — it can never overflow

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
| `registerGunDefinitionProvider(GunDefinitionProvider provider)` | `provider` — dynamic gun definition provider (functional interface: `ResourceLocation → Optional<GunDefinition>`; returning empty means "not handled") | `void` | Registers a dynamic gun definition provider. `getGun` lookup order: Java API registration → providers (in registration order, first non-empty result wins) → datapack registry. Supports per-player / runtime-generated dynamic definitions (e.g. "the player IS the gun" gameplay, IDs can encode context like `player:<uuid>`); every definition lookup point in the framework benefits with zero changes. Behavior is identical when no provider is registered |
| `registerShooter(ResourceLocation shooterId, ShooterDefinition definition)` | `shooterId` — shooter definition ID (e.g. `modularshoot:bone_shooter`); `definition` — shooter definition object | `void` | Registers a shooter definition (an independent-firing config template) via the Java API, in the `modularshoot:shooters` registry. Same semantics as `registerGun`: the ID is automatically marked as API-registered and takes priority over a same-ID datapack entry, and it survives `/reload` |
| `registerGunItem(ItemLike item, ResourceLocation gunId)` | `item` — the item to bind (e.g. `Items.DIAMOND_SWORD`); `gunId` — target gun definition ID | `void` | Binds the given item as a gun (equivalent to a datapack `gun_items` entry, entry key = item ID). Java API bindings take precedence over datapack bindings; runtime recognition requires `RegistryAccess` (when datapack registries are not loaded, only Java API bindings are visible) |
| `registerPluginItem(ItemLike item, ResourceLocation pluginId)` | `item` — the item to bind; `pluginId` — target plugin definition ID | `void` | Binds the given item as a plugin (equivalent to a datapack `plugin_items` entry) |
| `registerPluginValidator(PluginValidator validator)` | `validator` — custom install validator (functional interface: `(Player player, ItemStack gun, ResourceLocation pluginId, RegistryAccess registryAccess) → ValidationResult`; `player` — the player performing the install, `gun` — the target gun, `pluginId` — the candidate plugin definition ID, `registryAccess` — runtime registry view) | `void` | Registers a custom plugin install validator. Runs after framework default checks pass; returning failure aborts installation |
| `registerShootPredicate(ShootPredicate predicate)` | `predicate` — shoot condition checker (functional interface: `(Player, ItemStack) → ShootPredicateResult`) | `void` | Registers a shoot condition predicate. Runs after fire-rate control passes; returning failure prevents shooting and shows the reason. Framework registers 0 by default |
| `registerShootEffect(ShootEffect effect)` | `effect` — per-pellet shoot effect contributor (functional interface: `(Player player, ItemStack gun, BulletSnapshot snapshot, int pelletIndex, int totalPellets) → void`) | `void` | Registers a per-pellet shoot effect contributor. Runs inside the pellet loop, right after each pellet's snapshot `copy()` and right before spread application, in registration order; a later effect sees all mutations made by earlier ones (`pelletIndex` may serve as a per-pellet differentiation seed). **Usage red lines**: recommended mutations are `setTrait` (boolean traits stack naturally) / `multiplyStat` (multiplicative scaling composes) / `setStat` (deliberate, deterministic overwrite); **forbidden** are `setDamageType` and visual `base` overrides — exclusive single-value fields, whose exclusive scenarios must go through the variant pool (technically not blocked, but the result is field-level fragmentation). Framework registers 0 by default |
| `registerVariantContributor(VariantContributor contributor)` | `contributor` — variant weight contributor (functional interface: `(VariantContributionSink sink) → void`; declares "variant id → weight modifier" pairs via `sink.add(ResourceLocation variantId, AttributeModifier modifier)`) | `void` | Registers a variant weight contributor feeding modifiers into the per-shot variant pool (assembled fresh every shot, never persisted). Modifiers reuse the vanilla `AttributeModifier` record and its `Operation` three-stage semantics: `ADD_VALUE` (flat add) → `ADD_MULTIPLIED_BASE` (multiplies only the base weight) → `ADD_MULTIPLIED_TOTAL` (scales the whole weight); a zero base with no ADD_VALUE stays `0` — "a fire trinket is useless on a non-fire gun". A variant id contributed but declared by no gun/plugin enters the pool with its own `base_weight` as base weight (default `0.0`) and competes proportionally against the default normal-bullet fallback (weight `1.0`) — when the gun declares no `variants` (and this is the gun's only contributed variant), its probability = final weight / (final weight + 1.0); ids already declared by gun/plugin keep their declared weight as authoritative. Framework registers 0 by default |
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
| `ON_VISUAL_TICK` | onVisualTick | Snapshot (`ClientBulletSnapshot`) + render object (`BulletRenderObject`), both passed as `Object` — cast required | Client only |

> **onVisualTick contract (modifier-stacking system)**: a bullet's visual composition (base / scale / tint / attach layers) is **frozen at creation time** and cached on `BulletRecord.composedStyle` (server) → sent to the client's `BulletRenderObject` via `BulletS2CPacket`. In-flight `onVisualTick` hooks that want to change appearance should **mutate the `BulletRenderObject` directly** (`setScale` / `setComposedTint` / `setLayers` / swap texture, etc.) — do not mutate `BulletSnapshot` expecting a recomposition; composition is never recomputed in-flight.

## Client Outline Registration (client only)

The following API lives in `org.yanbwe.modularshoot.client.render.DynamicOutlineTintRegistry`. It is client-only and should be called during client initialisation (e.g. the `@Mod(Dist.CLIENT)` constructor).

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `register(ResourceLocation pluginId, GunOutlineTintProvider provider)` | `pluginId` — plugin definition ID; `provider` — per-frame outline colour supplier (functional interface: `(ItemStack, float partialTick) → Vector4f RGBA`) | `void` | Registers a **dynamic outline** for the plugin: every gun with that plugin installed renders its `gun_outline` with the provider's per-frame colour (white outline mask × per-frame tint; cached textures are never rebuilt). Outlines without a registered provider keep their static baked colour. A later registration for the same plugin id replaces the earlier one |

**Integration example (rainbow outline)**:

```java
// Client initialisation
DynamicOutlineTintRegistry.register(
    ResourceLocation.parse("examplemod:prismatic_core"),
    (stack, partialTick) -> {
        long time = Minecraft.getInstance().level.getGameTime() + (long) partialTick;
        float hue = (time * 6.0F) % 360.0F;
        return /* Vector4f from an HSV→RGB conversion */;
    });
```

Effective in first person, third person and the inventory GUI alike. No datapack JSON changes are needed (`gun_outline` is declared as usual; its colour only acts as the static fallback). The framework ships no built-in dynamic-outline demo plugin — the built-in plugins carrying a static `gun_outline` (e.g. `modularshoot:fragment_guard`, `modularshoot:fragment_shining`) keep the static baked colour; for a dynamic outline, register a per-frame colour provider via `DynamicOutlineTintRegistry.register` for any plugin declaring `gun_outline`.

## Registry Queries

Require a `RegistryAccess` parameter (obtained from a loaded world; registries are empty on the main menu).

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getGunDefinition(RegistryAccess registryAccess, ResourceLocation gunId)` | `registryAccess` — runtime registry view; `gunId` — gun definition ID | `Optional<GunDefinition>` | Looks up a gun definition |
| `getPluginDefinition(RegistryAccess registryAccess, ResourceLocation pluginId)` | `registryAccess` — runtime registry view; `pluginId` — plugin definition ID | `Optional<PluginDefinition>` | Looks up a plugin definition |
| `getPluginTypeDefinition(RegistryAccess registryAccess, ResourceLocation pluginTypeId)` | `registryAccess` — runtime registry view; `pluginTypeId` — plugin type ID | `Optional<PluginTypeDefinition>` | Looks up a plugin type definition |
| `getShooterDefinition(RegistryAccess registryAccess, ResourceLocation shooterId)` | `registryAccess` — runtime registry view; `shooterId` — shooter definition ID | `Optional<ShooterDefinition>` | Looks up a shooter definition (an independent-firing config template). Java-API-registered entries take priority over same-ID datapack entries |

## State Access

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `getState(ItemStack gun, Player player)` | `gun` — gun item stack; `player` — player context (for resolving runtime registries) | `GunState` (nullable) | Gets a per-gun state read/write view for the gun instance. Returns `null` for non-gun items. Typed accessors: `getInt`/`setInt`/`getLong`/`setLong`/`getDouble`/`setDouble`/`getFloat`/`setFloat`/`getBoolean`/`setBoolean`/`getString`/`setString`/`getUuid`/`setUuid`/`hasState`/`clearState` |
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

## Independent Firing

**Independent firing** is the non-player-source path (turret, trap, boss attack, scripted scenario, ...) for launching bullets: the snapshot is built by hand (or generated from a shooter definition in the `modularshoot:shooters` registry), bypassing the player shooting engine — **no fire-rate control, no ShootPredicate check, no PreShootEvent/PostShootEvent, no sound playback**. Once registered, the bullet enters the normal tick loop (flight, collision, damage, trait hooks).

**Snapshot field conventions**: an independent-firing snapshot always carries `null` for the three engine-owned fields `gunId` / `gunInstanceUuid` / `shooter` (no firing gun exists; the shooter uuid is passed separately as `fireBullet`'s last argument, `null` for ownerless sources).

| Method Signature | Parameters | Returns | Description |
|-----------------|------------|---------|-------------|
| `createBulletSnapshot()` | None | `BulletSnapshotBuilder` | Creates a chainable builder for independent-firing snapshots (see the quick-reference table below). The result always satisfies the snapshot field conventions (gunId/gunInstanceUuid/shooter all `null`) |
| `fireBullet(Level level, Vec3 position, Vec3 direction, BulletSnapshot snapshot, UUID shooter)` | `level` — the dimension to fire into; `position` — launch position; `direction` — initial flight direction (should be normalized; consumed as-is by the flight simulation); `snapshot` — the bullet snapshot (builder- or hand-constructed); `shooter` — shooter uuid, nullable (`null` = ownerless source; pass a player uuid to attribute the bullet) | `BulletRecord` | Fires a bullet from a non-player source. **No fire-rate control, no ShootPredicate check, no shoot events, no sound playback**. When the snapshot carries a `null` damage type, the framework default is resolved from `level.registryAccess()` and written into the snapshot before firing (throws `IllegalStateException` if the framework damage type is missing) — callers may omit the damage type entirely |

**BulletSnapshotBuilder chainable-method quick reference** (`org.yanbwe.modularshoot.bullet.BulletSnapshotBuilder`):

| Method | Description |
|--------|-------------|
| `stat(ResourceLocation id, double value)` | Sets (or overwrites) a frozen stat value. Repeating the same ID overwrites (last-write-wins) |
| `trait(ResourceLocation id, boolean value)` | Sets (or overwrites) an activated trait flag |
| `state(ResourceLocation id, Object value)` | Seeds a per-bullet working-memory value (carried initially by the `BulletS2CPacket`; UUID-typed states allow `null`) |
| `style(BulletStyle style)` | Sets the independent-firing visual style, carried via the snapshot's variant style override channel — server-side compose uses it as the visual base/modifier source when no firing gun exists (falls back to the framework default appearance) |
| `damageType(Holder<DamageType> holder)` | Explicitly sets the damage type holder. Optional: the snapshot can be built without one |
| `build()` | Builds the snapshot; the builder stays reusable (snapshots are defensively copied; later builder mutations never leak into built snapshots). **The damage type may be `null`** (valid — the `fireBullet` facade patches in the framework default) |
| `build(RegistryAccess registryAccess)` | Same as `build()`, but fills in the framework default damage type (`ModularShootDamageTypes.holderOrThrow`) when none was set explicitly. The resolved holder is cached on the builder and reused by later `build()` calls. Throws `IllegalStateException` when `registryAccess` lacks the `DAMAGE_TYPE` registry (e.g. `RegistryAccess.EMPTY` on the main menu) |

> **`build()` vs `build(RegistryAccess)`**: the produced snapshots are identical in stats/traits/visuals — the only difference is the damage type. `build()` may leave it `null` (the `fireBullet` facade fills in the default at firing time); `build(RegistryAccess)` fills it in immediately. When a runtime registry view is on hand (e.g. `level.registryAccess()`), prefer the latter for an earlier fully-wired snapshot; in script-only contexts `build()` suffices.

> **Independent firing plays no sound**: `fireBullet` never plays any sound. For a shoot sound, call `ShooterDefinition.playShootSound(Level, Vec3)` at the firing position (see the Datapack docs, "Shooter JSON").
