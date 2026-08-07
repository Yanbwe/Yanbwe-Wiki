# Registry Reference

ModularShoot stores all definitions in 9 dynamic registries (DataPackRegistry). All support `/reload` hot-reload and client sync.


## Registry Overview

| Registry ID | Purpose | Value Type |
|-------------|---------|------------|
| `modularshoot:guns` | Gun definitions | `GunDefinition` |
| `modularshoot:plugins` | Plugin definitions | `PluginDefinition` |
| `modularshoot:plugin_types` | Plugin type (category) definitions | `PluginTypeDefinition` |
| `modularshoot:traits` | Boolean trait definitions | `Trait` |
| `modularshoot:attribute_meta` | Attribute metadata | `AttributeMeta` |
| `modularshoot:states` | Persistent state definitions | `StateDefinition` |
| `modularshoot:variants` | Random variant definitions | `VariantDefinition` |
| `modularshoot:gun_items` | Item → gun bindings | `GunItemBinding` |
| `modularshoot:plugin_items` | Item → plugin bindings | `PluginItemBinding` |

> Attribute **bodies** (`Attribute` instances) are not in these dynamic registries — register them using vanilla `DeferredRegister` into `BuiltInRegistries.ATTRIBUTE`. The metadata table stores only defaults, display info, and bindings.

## Gun Definition (GunDefinition)

Registry: `modularshoot:guns`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | Optional text string | No | None (falls back to gun ID path) | Display name. Supports `§` color codes and `lang:` translation key prefix |
| `texture` | Resource path | **Yes** | — | Gun base texture path, rendered using vanilla item pipeline with 3D-ification |
| `shootTexture` | Optional resource path | No | None (always uses base texture) | Texture swapped to while firing |
| `shootTextureMode` | Enum | No | `PER_SHOT` | Texture swap timing. Only effective when `shootTexture` is specified |
| `textureScale` | Enum | No | `AUTO` | Whether the render geometry scales with the texture resolution. `AUTO` (16 px = 1 grid cell; a 32×32 texture renders 2× larger) / `FIXED` (fixed 16×16 unit grid). Base and shoot textures scale independently by their own size |
| `stats` | Attribute ID → decimal map | No | Empty map | Attribute base values. Keys are the logical ids of attribute_meta-registered entries and **must** include full namespace (e.g. `modularshoot:hit_damage`). Unspecified attributes use the metadata table default. **Any registered entry is supported** (beyond the 10 preset attributes): adding an attribute_meta entry makes `stats` support that key automatically |
| `traits` | Trait ID → boolean map | No | Empty map | Gun inherent trait overrides. Gun-declared traits always override all plugins |
| `variants` | Variant ID → decimal map | No | Empty map | Variant pool base weights: variant ID → base weight. The pool is assembled fresh for every shot, summed with plugins' `addsVariants` per variant, adjusted by contributor weight modifiers, then rolled weighted-random (see "Variant Definition (VariantDefinition)") |
| `slots` | Plugin type ID → integer map | No | Empty map | Plugin slot configuration. Key is plugin type ID, value is slot count |
| `sounds` | String → resource path map | No | Empty map | Sound bindings. Predefined slot: `shoot` (firing sound). Custom slot names supported |
| `bulletStyle` | Optional bullet style | No | None (falls back to framework default appearance `ComposedBulletStyle.FALLBACK_BASE`, billboard + default texture) | Bullet visual appearance config |

### BulletStyle

> **v2 structure (modifier stacking)**: the legacy `model` map + `renderMode` structure is replaced by `base` + `modifiers`. Modifiers from multiple sources (gun / plugins / traits / state conditions) **stack** instead of being fully replaced.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `base` | Optional object | No | None (framework fallback base used at compose time) | Base appearance. `renderMode` is required (`BILLBOARD` / `THREE_D`); `texture` (billboard texture) and `model` (3d model) are optional, exactly one of them used per mode |
| `modifiers` | Optional list of modifiers | No | Empty list | Stacking visual modifiers, dispatched by `"type"`: `scale` / `tint` / `attach_layer`. An unrecognised `"type"` decodes to an `UnsupportedModifier` sentinel (skipped with a WARN) rather than failing the whole list |

### ShootTextureMode

| Enum Value | Description |
|-----------|-------------|
| `PER_SHOT` | Swap to shoot texture on every shot, snap back immediately after. High-rate weapons will flicker |
| `WHILE_FIRING` | Hold shoot texture while trigger is pressed, revert on release. Best for full-auto to avoid flicker |

## Plugin Definition (PluginDefinition)

Registry: `modularshoot:plugins`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `tags` | List of resource paths | No | Empty list | Matching tags. Install requires intersection with a type's tags. Empty list prevents installation (logs WARN) |
| `priority` | Integer | No | `0` | Trait conflict priority, higher wins. Does **not** inherit type priority |
| `itemIcon` | Resource path | **Yes** | — | Plugin icon texture shown in inventory/hotbar |
| `textureScale` | Enum | No | `AUTO` | Whether the icon geometry scales with the texture resolution; same semantics as the gun's `textureScale` (`AUTO` / `FIXED`) |
| `modifiers` | List of modifiers | No | Empty list | Attribute modifier array. Applied to gun on installation |
| `traits` | Trait ID → boolean map | No | Empty map | Trait overrides provided after installation |
| `addsVariants` | Variant ID → decimal map | No | Empty map | Base weights appended to the gun's variant pool. Summed with the gun-declared weight of the same variant once installed (see "Variant Definition (VariantDefinition)") |
| `exclusiveGroup` | Optional text string | No | None | Mutual exclusion group ID. Two plugins with the same group ID cannot coexist on the same gun |
| `bulletStyle` | Optional bullet style | No | None | Bullet style contribution. **Stacks**: base candidates are elected by priority (same priority: later-installed wins; when no candidate, the framework fallback appearance is used); all modifiers stack (scale multiplies, tint multiplies channel-wise, attach layers are all kept) |
| `textureOverlay` | Optional texture overlay | No | None | Texture overlay info. Layers stacked over the gun's base texture after install |
| `gunOutline` | Optional outline spec | No | None | Whole-gun outline spec (see "Outline Spec (OutlineSpec)" below). Strokes the silhouette of the final composited gun texture; multiple plugins nest concentrically, widest first |
| `extraValues` | Namespaced-number map | No | Empty map | Extension numeric fields: keys are ResourceLocations, values are numbers. The framework only carries and sums them per key (read via `ModularShootAPI.getExtraValueSums` / `getExtraValue`) without interpreting their meaning — integration mods use them to carry custom values (e.g. rarity) and accumulate them onto the gun in plugin install/uninstall events |
| `name` | Optional text string | No | None | Plugin display name. Supports `§` color codes |
| `brief` | Optional text string | No | None | One-line summary. Shown in default tooltip level |
| `description` | Optional text string | No | None | Multi-line detailed description. Shown in Shift tooltip level |
| `color` | Optional text string | No | None | Plugin name color (e.g. `#FF4444`) |

### Modifier (PluginModifier)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `attribute` | Text string | **Yes** | — | Target attribute name. If no namespace, defaults to `modularshoot` namespace |
| `operation` | Enum | **Yes** | — | Operation type: `ADD` (additive), `MULTIPLY` (base multiplier), `MULTIPLY_TOTAL` (final multiplier) |
| `value` | Decimal number | **Yes** | — | Modifier numeric value |

### Texture Overlay (TextureOverlay)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `texture` | Resource path | **Yes** | — | Overlay texture path layered onto the gun texture |
| `layer` | Integer | **Yes** | — | Z-order, higher renders on top. Same layer: later-installed covers earlier |
| `alignment` | Enum | No | `TOP_LEFT` | Nine-grid alignment: `TOP_LEFT` / `TOP_CENTER` / `TOP_RIGHT` / `CENTER_LEFT` / `CENTER` / `CENTER_RIGHT` / `BOTTOM_LEFT` / `BOTTOM_CENTER` / `BOTTOM_RIGHT`. Only effective when `fit` is `NONE` |
| `fit` | Enum | No | `NONE` | Fit mode: `NONE` (no resampling, blended at the aligned position, parts beyond the canvas are clipped with a WARN) / `FILL` (bilinearly stretched to cover the whole canvas; distorted when aspect ratios differ) / `CONTAIN` (uniformly scaled to be fully visible, centred with transparent margins) |

### Outline Spec (OutlineSpec)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `color` | RGB float array | **Yes** | — | Outline colour, three 0-1 floats (e.g. `[1.0, 0.2, 0.1]`) |
| `alpha` | Decimal number | No | `1.0` | Outline opacity |
| `width` | Integer | No | `1` | Outline width (pixels). Multiple plugin outlines nest concentrically, widest first; ties broken by installation order (later install paints over earlier) |

**Dynamic outlines (per-frame colour)**: outline colours are baked statically at composite time by default. An integration mod that needs a per-frame colour shift can register a `GunOutlineTintProvider` (functional interface `(ItemStack, float partialTick) → Vector4f RGBA`) in `DynamicOutlineTintRegistry`, keyed by the plugin id, during **client initialisation**:

```java
// Client initialisation (e.g. @Mod(Dist.CLIENT) constructor)
DynamicOutlineTintRegistry.register(
    ResourceLocation.parse("examplemod:prismatic_core"),
    (stack, partialTick) -> /* per-frame colour, e.g. a rainbow hue rotating over time */);
```

Every gun with that plugin installed then renders its outline with the provider's per-frame colour (white outline mask × per-frame tint; cached textures are never rebuilt). Outlines without a registered provider keep their static baked colour. The framework ships a built-in demo plugin `modularshoot:visual_gun_prism` (rainbow outline).

## Plugin Type Definition (PluginTypeDefinition)

Registry: `modularshoot:plugin_types`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `tags` | List of resource paths | No | Empty list | Matching tags. Install requires intersection with a plugin's tags. Empty list matches nothing (logs WARN) |
| `priority` | Integer | No | `0` | Display priority (tooltip sort order) + install auto-select secondary sort key. Does **not** affect plugin trait conflict priority |
| `name` | Optional text string | No | None | Type display name |
| `color` | Optional text string | No | None | Type name color (e.g. `#FFAA00`) |

## Trait Definition (Trait)

Registry: `modularshoot:traits`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `defaultValue` | Boolean | **Yes** | — | Default trait value when not declared by the gun |
| `description` | Text string | No | `""` (empty string) | Description text |
| `name` | Optional text string | No | None (falls back to trait ID path) | Trait display name. Supports `§` color codes and `lang:` translation key prefix |
| `color` | Optional text string | No | None | Trait name color (e.g. `#FF8800`) |
| `brief` | Optional text string | No | None | One-line summary. Shown in Alt tooltip level |
| `forceShow` | Boolean | No | `false` | Force display. When `true`, shown in tooltip regardless of value |
| `priority` | Integer | No | `0` | Display priority, higher sorts first |
| `visualModifiers` | List of modifiers | No | Empty list | Stacking visual modifiers. Stacked into the composed bullet style when the trait is active |

> Runtime behavior (hook callbacks) is not stored in the Trait definition. Register it separately via `registerTraitHook` API.

## Attribute Metadata (AttributeMeta)

Registry: `modularshoot:attribute_meta`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `binds` | Resource path | **Yes** | — | Points to a registered vanilla `Attribute` ID. Framework resolves the `Attribute` holder through this field at runtime. **Shared by all three paths** (mount / resolve / display all resolve through `binds`); may be rebound to any registered vanilla attribute. Preset attributes have logical ID = body ID, `binds` points to self |
| `defaultValue` | Decimal number | **Yes** | — | Gun base value when not declared by the gun (participates in ADD_VALUE calculation). Hot-reloadable. **Not the vanilla Attribute's base** (which is always 0) |
| `description` | Text string | No | `""` (empty string) | Description text |
| `color` | Text string | No | `""` (empty string) | Attribute name color (e.g. `#FF4444`) |
| `priority` | Integer | No | `0` | Display priority, higher sorts first |
| `forceShow` | Boolean | No | `false` | Force display. When `true`, shown in tooltip even if value equals default |

> If the `binds` target attribute is not registered: metadata entry is retained but modifier won't mount, tooltip won't show, reads return 0.

> Datapacks may rebind `binds` to any registered vanilla attribute (incl. `minecraft:*`), e.g. rebind `modularshoot:hit_damage` to `minecraft:attack_damage`. The three-path (mount / resolve / display) semantics plus the base-offset and syncable conventions are described in the [datapack format doc](DataPack.md#attribute-metadata-json).

## Variant Definition (VariantDefinition)

Registry: `modularshoot:variants`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `weightHint` | Decimal number | No | `0.0` | Base weight fallback. Used only when *no* gun/plugin declares this variant in its pool (typical for variants introduced solely via `registerVariantContributor`); declared gun/plugin weights are authoritative |
| `traits` | Trait ID → boolean map | No | Empty map | **Merged** into the snapshot when selected: declared trait values are written, unlisted keys are kept |
| `stats` | Attribute ID → decimal map | No | Empty map | When selected, **overrides only the declared keys** (does not replace the whole snapshot stat table) |
| `damageType` | Optional resource path | No | None | When present, overrides the `ammo_damage_type` preset (variant takes precedence) |
| `bulletStyleOverride` | Optional bullet style | No | None | Visual override, same format as `bulletStyle` (base + modifiers). Its base participates in the visual composition election with the highest priority (beats gun / plugins / traits / state conditions); modifiers stack as usual. Read by server-side compose only; never serialised to clients |

**Weight semantics (three sources)**: the variant pool is **assembled fresh for every shot** (never persisted). After merging the three sources below, one variant is rolled weighted-random:

1. Base weights declared by the gun definition (`variants`)
2. Installed plugins' `addsVariants` — **summed** with the gun's weight of the same variant
3. Weight modifiers contributed via `registerVariantContributor` — vanilla `AttributeModifier` three-stage semantics: `ADD_VALUE` (flat add) → `ADD_MULTIPLIED_BASE` (multiplies only the base weight) → `ADD_MULTIPLIED_TOTAL` (scales the whole). **A zero base with no ADD_VALUE modifier always resolves to `0`** — "a fire trinket is useless on a non-fire gun"

**Normal-bullet fallback**: when the gun declares **no** `variants`, the pool implicitly contains a "normal bullet" candidate with weight `1.0` (not written into any JSON); **guns that declare `variants` get no fallback**. Probability math: `P(variant X) = X's final weight ÷ pool total weight` (pool total = the sum of the final weights of all positive-weight candidates, including the fallback `1.0`); equal weights in a two-candidate pool give 50% each, and a variant hits 50% ⟺ its weight equals the sum of the other candidates' weights. Example: a normal gun + fireball plugin `adds_variants: 1.0` → pool {fireball 1.0, normal bullet 1.0} → exactly 50%.

**Per-pellet semantics**: the variant is rolled **independently per pellet** (one election affects only that pellet), so a shotgun blast can mix different variants or normal pellets; an all-zero-weight or empty pool silently yields a normal pellet. Mutually-exclusive single-value fields (`damageType` / visual `base`) must go through the variant pool; stackable effects should use `registerShootEffect`.

## State Definition (StateDefinition)

Registry: `modularshoot:states`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `domain` | Enum | **Yes** | — | Ownership domain. `GUN` (per-gun, persisted in gun NBT), `PLAYER` (per-player, persisted via AttachmentType), `BULLET` (per-bullet, lifetime only, not persisted) |
| `valueType` | Enum | **Yes** | — | Value type. `INT` / `LONG` / `DOUBLE` / `FLOAT` / `BOOLEAN` / `STRING` / `UUID` |
| `defaultValue` | Object | No | Zero value for the type | Initial value. Type must match `valueType`. Used when per-gun/per-player first accessed |
| `display` | State display | **Yes** | — | Display metadata object |
| `visualModifiers` | List of state visual modifiers | No | Empty list | Conditional visual modifier batches: each entry pairs a `condition` (`state` / `domain` / `op` / `value`) with a `modifiers` list, stacked into the composed bullet style when the condition holds at bullet creation time |

### State Display (StateDisplay)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | Text string | **Yes** | — | State name in tooltip. Supports `§` color codes and `lang:` translation key prefix |
| `color` | Optional text string | No | None (default tooltip color) | Name color (e.g. `#FFAA00`). When omitted, the default tooltip color is used |
| `format` | Text string | No | `"{value}"` | Display template with `{value}` placeholder. E.g. `"{value} kills"` → tooltip shows `Kill Count: 3 kills` |
| `priority` | Integer | No | `0` | Tooltip sort order, higher sorts first |
| `hideDefault` | Boolean | No | `false` | When `true`, the line is hidden if the value equals the default |

## Item Binding Definition (GunItemBinding / PluginItemBinding)

Registry: `modularshoot:gun_items` / `modularshoot:plugin_items`

Binds **other mods' items** as guns/plugins — once bound, every instance of that item ID is treated as a framework gun/plugin, **without replacing the original item** (model / texture / acquisition paths are all preserved — no "counterfeit" problem). The entry key (JSON filename) is an arbitrary id; the content declares the binding target.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `item` | Resource path | **Yes** | The bound item ID (e.g. `minecraft:diamond_sword`) |
| `gun` | Resource path | **Yes** (gun_items) | Target gun definition ID (an entry in the `modularshoot:guns` registry) |
| `plugin` | Resource path | **Yes** (plugin_items) | Target plugin definition ID (an entry in the `modularshoot:plugins` registry) |

**Behavior semantics**:

- **Converts upon entering the inventory**: within 1 tick of a bound item entering the player's inventory (36 main slots + offhand), the server automatically attaches the `gun_data` component (instance UUID, base attribute modifiers). After that it is **fully runtime-isomorphic** with native guns — plugin installation, locking, state persistence, bullet backtracking and anti-cheat version numbers all behave identically.
- **Plugin bindings attach no component**: bound plugins are consumed on install; the pluginId is resolved directly through the binding table.
- **Full conversion**: on bound guns, left-click melee is replaced by shooting, vanilla enchantments are nullified, and shooting does not consume durability.
- **Visual tier 1**: bound items keep their original item model rendering; the framework's dynamic texture pipeline (recoloring / overlays / outlines / shoot-texture swapping) serves native guns only.
- **Identity hint**: an unconverted (component-less) bound gun shows a grey identifier line `Gun: <id>` in its tooltip plus the base attribute/slot preview registered in the gun definition; visible in JEI, the creative inventory and inventory hover.
- **Post-load validation** (WARN degrade, never rejected): `item` must exist in the item registry; `gun`/`plugin` must exist in the corresponding definition registry; duplicate bindings of the same item ID → the lexicographically smallest entry key wins, the rest WARN.
- **Java API priority**: bindings registered via `registerGunItem`/`registerPluginItem` take precedence over datapack entries; datapack entries conflicting with the Java API WARN at load time.
- **Main menu limitation**: datapack bindings show no hint in the main-menu creative inventory (registry not loaded); Java API bindings are exempt.
