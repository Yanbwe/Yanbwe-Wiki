# Registry Reference

ModularShoot stores all definitions in 6 dynamic registries (DataPackRegistry). All support `/reload` hot-reload and client sync.


## Registry Overview

| Registry ID | Purpose | Value Type |
|-------------|---------|------------|
| `modularshoot:guns` | Gun definitions | `GunDefinition` |
| `modularshoot:plugins` | Plugin definitions | `PluginDefinition` |
| `modularshoot:plugin_types` | Plugin type (category) definitions | `PluginTypeDefinition` |
| `modularshoot:traits` | Boolean trait definitions | `Trait` |
| `modularshoot:attribute_meta` | Attribute metadata | `AttributeMeta` |
| `modularshoot:states` | Persistent state definitions | `StateDefinition` |

> Attribute **bodies** (`Attribute` instances) are not in these dynamic registries — register them using vanilla `DeferredRegister` into `BuiltInRegistries.ATTRIBUTE`. The metadata table stores only defaults, display info, and bindings.

## Gun Definition (GunDefinition)

Registry: `modularshoot:guns`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | Optional text string | No | None (falls back to gun ID path) | Display name. Supports `§` color codes and `lang:` translation key prefix |
| `texture` | Resource path | **Yes** | — | Gun base texture path, rendered using vanilla item pipeline with 3D-ification |
| `shootTexture` | Optional resource path | No | None (always uses base texture) | Texture swapped to while firing |
| `shootTextureMode` | Enum | No | `PER_SHOT` | Texture swap timing. Only effective when `shootTexture` is specified |
| `stats` | Attribute ID → decimal map | No | Empty map | Attribute base values. Keys **must** include full namespace (e.g. `modularshoot:hit_damage`). Unspecified attributes use the metadata table default |
| `traits` | Trait ID → boolean map | No | Empty map | Gun inherent trait overrides. Gun-declared traits always override all plugins |
| `slots` | Plugin type ID → integer map | No | Empty map | Plugin slot configuration. Key is plugin type ID, value is slot count |
| `sounds` | String → resource path map | No | Empty map | Sound bindings. Predefined slot: `shoot` (firing sound). Custom slot names supported |
| `bulletStyle` | Optional bullet style | No | None (pure collision body, no render object) | Bullet visual appearance config |

### BulletStyle

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `model` | String → resource path map | **Yes** | — | Render resources. Conventional keys: `"3d"` → vanilla static JSON model path, `"billboard"` → texture path. Recommend providing both |
| `renderMode` | Enum | **Yes** | — | Render mode: `BILLBOARD` (2D sprite always facing viewer) or `THREE_D` (vanilla static 3D model) |

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
| `modifiers` | List of modifiers | No | Empty list | Attribute modifier array. Applied to gun on installation |
| `traits` | Trait ID → boolean map | No | Empty map | Trait overrides provided after installation |
| `exclusiveGroup` | Optional text string | No | None | Mutual exclusion group ID. Two plugins with the same group ID cannot coexist on the same gun |
| `bulletStyle` | Optional bullet style | No | None | Bullet style override. Replaces gun-defined style on install. **Full replacement**, not field-level merge |
| `textureOverlay` | Optional texture overlay | No | None | Texture overlay info. Layers stacked over the gun's base texture after install |
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

> Runtime behavior (hook callbacks) is not stored in the Trait definition. Register it separately via `registerTraitHook` API.

## Attribute Metadata (AttributeMeta)

Registry: `modularshoot:attribute_meta`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `binds` | Resource path | **Yes** | — | Points to a registered vanilla `Attribute` ID. Framework resolves the `Attribute` holder through this field at runtime. Preset attributes have logical ID = body ID, `binds` points to self |
| `defaultValue` | Decimal number | **Yes** | — | Gun base value when not declared by the gun (participates in ADD_VALUE calculation). Hot-reloadable. **Not the vanilla Attribute's base** (which is always 0) |
| `description` | Text string | No | `""` (empty string) | Description text |
| `color` | Text string | No | `""` (empty string) | Attribute name color (e.g. `#FF4444`) |
| `priority` | Integer | No | `0` | Display priority, higher sorts first |
| `forceShow` | Boolean | No | `false` | Force display. When `true`, shown in tooltip even if value equals default |

> If the `binds` target attribute is not registered: metadata entry is retained but modifier won't mount, tooltip won't show, reads return 0.

## State Definition (StateDefinition)

Registry: `modularshoot:states`

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `domain` | Enum | **Yes** | — | Ownership domain. `GUN` (per-gun, persisted in gun NBT), `PLAYER` (per-player, persisted via AttachmentType), `BULLET` (per-bullet, lifetime only, not persisted) |
| `valueType` | Enum | **Yes** | — | Value type. `INT` / `LONG` / `DOUBLE` / `FLOAT` / `BOOLEAN` / `STRING` / `UUID` |
| `defaultValue` | Object | No | Zero value for the type | Initial value. Type must match `valueType`. Used when per-gun/per-player first accessed |
| `display` | State display | **Yes** | — | Display metadata object |

### State Display (StateDisplay)

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `name` | Text string | **Yes** | — | State name in tooltip. Supports `§` color codes and `lang:` translation key prefix |
| `color` | Text string | **Yes** | — | Name color (e.g. `#FFAA00`) |
| `format` | Text string | No | `"{value}"` | Display template with `{value}` placeholder. E.g. `"{value} kills"` → tooltip shows `Kill Count: 3 kills` |
| `priority` | Integer | No | `0` | Tooltip sort order, higher sorts first |
| `hideDefault` | Boolean | No | `false` | When `true`, the line is hidden if the value equals the default |
