# Datapack Registration

Register content via datapack JSON. Equivalent to and sharing information with Java API registration. `/reload` hot-reloads JSON definitions.

## General Rules

- JSON files go in `data/<namespace>/modularshoot/<registry_path>/<id>.json`
- The filename is the entry ID (without namespace); the namespace is determined by the folder path
- All resource path fields use full namespace format (e.g. `modularshoot:textures/gun/rifle.png`)
- Optional fields omitted use the default values noted in code
- After `/reload`, JSON definitions take effect immediately; already-spawned items follow new definitions in real time

## Gun JSON

**Path**: `data/<namespace>/modularshoot/guns/<gun_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | Text string | No | None (falls back to gun ID path) | Display name. Supports `§` color codes and `lang:` translation key prefix |
| `texture` | Resource path string | **Yes** | — | Base texture path (e.g. `"modularshoot:textures/gun/rifle.png"`) |
| `shoot_texture` | Resource path string | No | None | Shooting texture path. Uses base texture throughout if omitted |
| `shoot_texture_mode` | Text string | No | `"per_shot"` | Texture swap mode. `"per_shot"` (swap per shot) / `"while_firing"` (hold while firing). Only effective when `shoot_texture` is specified |
| `stats` | Attribute ID → decimal object | No | `{}` | Attribute base values. Keys **must** include full namespace (e.g. `"modularshoot:hit_damage": 50.0`). Missing attributes use metadata table defaults |
| `traits` | Trait ID → boolean object | No | `{}` | Gun inherent trait overrides. Empty `{}` if no traits |
| `slots` | Plugin type ID → integer object | No | `{}` | Plugin slot config. Key is plugin type ID, value is slot count |
| `sounds` | String → resource path object | No | `{}` | Sound bindings. E.g. `"shoot": "modularshoot:gun.rifle.shoot"` |
| `bullet_style` | Object | No | None | Bullet visual style (see sub-table below) |

### bullet_style Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `model` | String → resource path object | **Yes** | — | Render resources. `"3d"` → model path, `"billboard"` → texture path. Recommend providing both |
| `render_mode` | Text string | **Yes** | — | `"billboard"` (2D sprite) or `"3d"` (static 3D model) |

**Path**: `data/examplemod/modularshoot/guns/assault_rifle.json`

```json
{
  "name": "§aAssault Rifle",
  "texture": "examplemod:textures/gun/assault_rifle.png",
  "shoot_texture": "examplemod:textures/gun/assault_rifle_shoot.png",
  "shoot_texture_mode": "while_firing",
  "stats": {
    "modularshoot:hit_damage": 8.0,
    "modularshoot:fire_rate": 10.0,
    "modularshoot:range": 60.0,
    "modularshoot:accuracy_yaw": 3.0,
    "modularshoot:accuracy_pitch": 3.5,
    "modularshoot:entity_penetration": 0,
    "modularshoot:bullet_speed": 50.0,
    "modularshoot:bullet_size": 0.2,
    "modularshoot:block_penetration": 0
  },
  "traits": {
    "examplemod:full_auto": true
  },
  "slots": {
    "examplemod:barrel": 1,
    "examplemod:magazine": 1,
    "examplemod:grip": 1
  },
  "sounds": {
    "shoot": "examplemod:gun.assault_rifle.shoot"
  },
  "bullet_style": {
    "model": {
      "3d": "examplemod:models/bullet/rifle_bullet.json",
      "billboard": "examplemod:textures/bullet/rifle_bullet.png"
    },
    "render_mode": "billboard"
  }
}
```

## Plugin JSON

**Path**: `data/<namespace>/modularshoot/plugins/<plugin_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | Text string | No | None | Display name. Supports `§` color codes |
| `tags` | String array | No | `[]` | Matching tag list (e.g. `["c:barrel", "examplemod:barrel"]`). Empty array matches no types |
| `priority` | Integer | No | `0` | Trait conflict priority, higher wins |
| `item_icon` | Resource path string | **Yes** | — | Item icon texture path |
| `modifiers` | Object array | No | `[]` | Attribute modifier list (see sub-table below) |
| `traits` | Trait ID → boolean object | No | `{}` | Trait overrides provided on install |
| `exclusive_group` | Text string | No | None | Mutual exclusion group ID. Same-group on same gun = can't coexist |
| `bullet_style` | Object | No | None | Bullet style override (same format as gun's `bullet_style`). **Full replacement**, not field-level merge |
| `texture_overlay` | Object | No | None | Texture overlay (see sub-table below) |
| `brief` | Text string | No | None | One-line summary |
| `description` | Text string | No | None | Multi-line detailed description |
| `color` | Text string | No | None | Name color (e.g. `"#FF4444"`) |

### modifiers Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `attribute` | Text string | **Yes** | — | Target attribute name. Without namespace defaults to `modularshoot` namespace (e.g. `"fire_rate"` → `modularshoot:fire_rate`) |
| `operation` | Text string | **Yes** | — | `"add"` (additive) / `"multiply"` (base multiplier) / `"multiply_total"` (final multiplier) |
| `value` | Decimal number | **Yes** | — | Modifier numeric value |

### texture_overlay Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `texture` | Resource path string | **Yes** | — | Overlay layer texture path |
| `layer` | Integer | **Yes** | — | Z-order, higher renders on top. Same layer: later-installed covers earlier |

**Path**: `data/examplemod/modularshoot/plugins/rapid_barrel.json`

```json
{
  "name": "§cRapid-Fire Barrel",
  "tags": ["c:barrel", "examplemod:barrel"],
  "priority": 150,
  "item_icon": "examplemod:textures/plugins/rapid_barrel.png",
  "modifiers": [
    { "attribute": "fire_rate", "operation": "multiply", "value": 1.0 },
    { "attribute": "hit_damage", "operation": "multiply", "value": -0.2 },
    { "attribute": "accuracy_yaw", "operation": "multiply_total", "value": 0.3 }
  ],
  "traits": { "examplemod:rapid_fire": true },
  "exclusive_group": "group:barrel_type",
  "bullet_style": {
    "model": { "billboard": "examplemod:textures/bullet/fast_bullet.png" },
    "render_mode": "billboard"
  },
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/rapid_barrel_overlay.png",
    "layer": 10
  },
  "brief": "Greatly increases fire rate, slightly reduces damage and accuracy",
  "description": "Doubles fire rate on install, but reduces single-shot damage by 20% and increases spread by 30%.",
  "color": "#FF4444"
}
```

**Path**: `data/examplemod/modularshoot/plugins/extended_mag.json`

```json
{
  "name": "§bExtended Magazine",
  "tags": ["c:magazine", "examplemod:magazine"],
  "priority": 100,
  "item_icon": "examplemod:textures/plugins/extended_mag.png",
  "modifiers": [
    { "attribute": "fire_rate", "operation": "add", "value": 2.0 }
  ],
  "exclusive_group": "group:mag_type",
  "brief": "Increases magazine capacity",
  "color": "#44AAFF"
}
```

## Plugin Type JSON

**Path**: `data/<namespace>/modularshoot/plugin_types/<type_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | Text string | No | None | Type display name |
| `tags` | String array | No | `[]` | Matching tag list. Empty array matches no plugins |
| `priority` | Integer | No | `0` | Display priority + install auto-select secondary sort key. Does **not** affect plugin trait conflict priority |
| `color` | Text string | No | None | Type name color (e.g. `"#FFAA00"`) |

**Path**: `data/examplemod/modularshoot/plugin_types/barrel.json`

```json
{
  "name": "Barrel",
  "tags": ["c:barrel", "examplemod:barrel"],
  "priority": 10,
  "color": "#FFAA00"
}
```

**Path**: `data/examplemod/modularshoot/plugin_types/grip.json`

```json
{
  "name": "Grip",
  "tags": ["c:grip", "examplemod:grip"],
  "priority": 30,
  "color": "#8888FF"
}
```

## Trait JSON

**Path**: `data/<namespace>/modularshoot/traits/<trait_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `default_value` | Boolean | **Yes** | — | Default value when not declared by the gun |
| `name` | Text string | No | None (falls back to trait ID path) | Display name. Supports `§` and `lang:` |
| `description` | Text string | No | `""` | Description text |
| `color` | Text string | No | None | Name color (e.g. `"#FF8800"`) |
| `brief` | Text string | No | None | One-line summary |
| `force_show` | Boolean | No | `false` | Force display (shown in tooltip regardless of value) |
| `priority` | Integer | No | `0` | Display priority, higher sorts first |

**Path**: `data/examplemod/modularshoot/traits/ignite.json`

```json
{
  "default_value": false,
  "name": "Incendiary Rounds",
  "description": "Ignites target on hit",
  "color": "#FF8800",
  "brief": "Ignites target for 3 seconds on hit",
  "force_show": false,
  "priority": 10
}
```

## Attribute Metadata JSON

**Path**: `data/<namespace>/modularshoot/attribute_meta/<attribute_logical_id>.json`

> This table only registers metadata, **does not create the attribute body**. Attribute bodies must be registered using vanilla `DeferredRegister`.

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `binds` | Resource path string | **Yes** | — | Points to a registered vanilla `Attribute` ID (e.g. `"minecraft:generic.max_health"`). Framework resolves the `Attribute` holder through this field |
| `default_value` | Decimal number | **Yes** | — | Gun base value when not declared by the gun (participates in additive calculations). **Not the vanilla base value** |
| `description` | Text string | No | `""` | Description text |
| `color` | Text string | No | `""` | Name color |
| `priority` | Integer | No | `0` | Display priority |
| `force_show` | Boolean | No | `false` | Force display |

**Path**: `data/examplemod/modularshoot/attribute_meta/custom_recoil.json`

```json
{
  "binds": "examplemod:custom_recoil",
  "default_value": 5.0,
  "description": "Custom recoil attribute",
  "color": "#FF9944",
  "priority": 15,
  "force_show": true
}
```

**Path**: `data/examplemod/modularshoot/attribute_meta/hit_damage.json`

(Override preset attribute metadata — adjust default value and color)

```json
{
  "binds": "modularshoot:hit_damage",
  "default_value": 2.0,
  "color": "#FF2222",
  "priority": 0,
  "force_show": false
}
```

## State JSON

**Path**: `data/<namespace>/modularshoot/states/<state_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `domain` | Text string | **Yes** | — | Ownership domain. `"gun"` / `"player"` / `"bullet"` |
| `value_type` | Text string | **Yes** | — | Value type. `"int"` / `"long"` / `"double"` / `"float"` / `"boolean"` / `"string"` / `"uuid"` |
| `default_value` | Matching type | No | Zero value for the type | Initial value. Type must match `value_type` |
| `display` | Object | **Yes** | — | Display metadata (see sub-table below) |

### display Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | Text string | **Yes** | — | State name in tooltip. Supports `§` and `lang:` |
| `color` | Text string | No | `""` | Name color (e.g. `"#FFAA00"`). Optional; omitting uses the default tooltip color |
| `format` | Text string | No | `"{value}"` | Display template, `{value}` placeholder |
| `priority` | Integer | No | `0` | Display sort order, higher sorts first |
| `hide_default` | Boolean | No | `false` | Hide the line when value equals default |

**Path**: `data/examplemod/modularshoot/states/kill_count.json`

```json
{
  "domain": "gun",
  "value_type": "int",
  "default_value": 0,
  "display": {
    "name": "Kill Count",
    "color": "#FFAA00",
    "format": "{value} kills",
    "priority": 10,
    "hide_default": true
  }
}
```

**Path**: `data/examplemod/modularshoot/states/heat.json`

```json
{
  "domain": "gun",
  "value_type": "double",
  "default_value": 0.0,
  "display": {
    "name": "Heat",
    "color": "#FF4400",
    "format": "{value} °C",
    "priority": 5,
    "hide_default": false
  }
}
```

**Path**: `data/examplemod/modularshoot/states/headshot_streak.json`

```json
{
  "domain": "player",
  "value_type": "int",
  "default_value": 0,
  "display": {
    "name": "Headshot Streak",
    "color": "#FFD700",
    "format": "{value} streak",
    "priority": 20,
    "hide_default": true
  }
}
```

**Path**: `data/examplemod/modularshoot/states/target_entity.json`

```json
{
  "domain": "bullet",
  "value_type": "uuid",
  "display": {
    "name": "Locked Target",
    "color": "#AA44FF",
    "priority": 0,
    "hide_default": true
  }
}
```

## Registration Conflicts & Overrides

| Scenario | Behavior |
|----------|----------|
| Same ID in both Java API and datapack | Java API wins, datapack registration ignored, WARN logged |
| Same ID in multiple datapacks | Later-loaded datapack overrides earlier (follows `pack.mcmeta` priority) |
| Override Java API entry via datapack | Not supported. Modify via API in Java code |

## `/reload` Behavior

- JSON definitions update immediately after reload; already-spawned items follow new definitions in real time (always reads from registry live)
- DataComponent fields on items (`gunId`, `pluginId`, etc.) do not change on `/reload`
- Java API-registered entries unaffected by `/reload` (never lost)
- Creative mode tab auto-refreshes after reload
