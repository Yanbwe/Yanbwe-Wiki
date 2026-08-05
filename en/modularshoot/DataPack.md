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
| `texture_scale` | Text string | No | `"auto"` | Whether the render geometry scales with the texture resolution. `"auto"` (16 px = 1 grid cell; a 32×32 texture renders 2× larger; width/height scale independently without distortion; extrusion thickness stays 1/16 cell) / `"fixed"` (fixed 16×16 unit grid; large textures only look sharper) |
| `stats` | Attribute ID → decimal object | No | `{}` | Attribute base values. Keys **must** include full namespace (e.g. `"modularshoot:hit_damage": 50.0`). Missing attributes use metadata table defaults |
| `traits` | Trait ID → boolean object | No | `{}` | Gun inherent trait overrides. Empty `{}` if no traits |
| `slots` | Plugin type ID → integer object | No | `{}` | Plugin slot config. Key is plugin type ID, value is slot count |
| `sounds` | String → resource path object | No | `{}` | Sound bindings. E.g. `"shoot": "modularshoot:gun.rifle.shoot"` |
| `bullet_style` | Object | No | None | Bullet visual style (see sub-table below) |

### bullet_style Sub-fields

> **v2 structure (modifier stacking)**: the legacy `model` object + `render_mode` is deprecated, replaced by `base` + `modifiers`. Modifiers from multiple sources (gun / plugins / traits / state conditions) **stack** instead of being fully replaced.

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `base` | Object | No | None | Base appearance (see below). When missing, the framework fallback texture (`modularshoot:textures/bullet/default.png`) is used |
| `modifiers` | Object array | No | `[]` | Modifier list (see below). Same-source modifiers combine in declaration order; across sources the order is gun → plugins (install order) → active traits → state conditions |

### base Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `render_mode` | Text string | **Yes** | — | `"billboard"` (2D sprite) or `"3d"` (static 3D model) |
| `texture` | Resource path string | No | None | Billboard texture path (omit for 3d mode) |
| `model` | Resource path string | No | None | 3d model path (omit for billboard mode) |

### modifiers Type Table

| `type` | Fields | Merge rule |
|--------|--------|------------|
| `"scale"` | `value` (float, >0) | **Multiplied**: all scale values across sources multiply into the final visual scale. NaN/≤0 values are skipped with a WARN |
| `"tint"` | `color` (array `[r,g,b]` or `[r,g,b,a]`, channels 0~1) | **Per-channel multiplied**: all tint colors multiply channel-wise. Negative/NaN channels skipped with a WARN; values >1 clamp to 1 |
| `"attach_layer"` | `render_mode`/`texture`/`model`/`follow_rotation`/`follow_scale`/`offset`/`scale`/`tint` | **Drawn in parallel**: an independent layer on top of the base; does not participate in scale/tint multiplication; its own scale/tint apply only to the layer |

> An unrecognised modifier `type` is skipped with a WARN and does **not** fail the whole list parse.

### attach_layer Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `render_mode` | Text string | **Yes** | — | `"billboard"` or `"3d"` |
| `texture` | Resource path string | No | None | Billboard layer texture (omit for 3d layers) |
| `model` | Resource path string | No | None | 3d layer model (omit for billboard layers) |
| `follow_rotation` | Boolean | No | `false` | Whether the layer rotates with the bullet's flight direction (billboard layers always face the camera; ignored) |
| `follow_scale` | Boolean | No | `true` | Whether the layer inherits the base visual scale (`baseScale × scale`) |
| `offset` | Number array | No | `[0,0,0]` | Positional offset relative to the base center `[x,y,z]` |
| `scale` | Float | No | `1.0` | Per-layer scale |
| `tint` | Array | No | `[1,1,1,1]` | Per-layer tint |

> **v1 limitation**: `attach_layer` fully supports `billboard` layers only; `"3d"` layers are not drawn in v1 (skipped with a DEBUG log).

**Path**: `data/examplemod/modularshoot/guns/assault_rifle.json`

```json
{
  "name": "§aAssault Rifle",
  "texture": "examplemod:textures/gun/assault_rifle.png",
  "shoot_texture": "examplemod:textures/gun/assault_rifle_shoot.png",
  "shoot_texture_mode": "while_firing",
  "texture_scale": "auto",
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
    "base": {
      "render_mode": "billboard",
      "texture": "examplemod:textures/bullet/rifle_bullet.png"
    },
    "modifiers": [
      { "type": "scale", "value": 1.2 },
      { "type": "tint", "color": [1.0, 0.9, 0.8] },
      { "type": "attach_layer", "render_mode": "billboard",
        "texture": "examplemod:textures/bullet/flame.png",
        "follow_scale": true, "offset": [0.0, 0.1, -0.3], "scale": 0.8 }
    ]
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
| `texture_scale` | Text string | No | `"auto"` | Whether the icon geometry scales with the texture resolution; same semantics as the gun's `texture_scale` (`"auto"` / `"fixed"`) |
| `modifiers` | Object array | No | `[]` | Attribute modifier list (see sub-table below) |
| `traits` | Trait ID → boolean object | No | `{}` | Trait overrides provided on install |
| `exclusive_group` | Text string | No | None | Mutual exclusion group ID. Same-group on same gun = can't coexist |
| `bullet_style` | Object | No | None | Bullet style (same format as gun's `bullet_style`). **Stacks**: plugin vs gun base picks a winner by priority (later-installed wins ties); all modifiers stack |
| `texture_overlay` | Object | No | None | Texture overlay (see sub-table below) |
| `gun_outline` | Object | No | None | Whole-gun outline: strokes the silhouette of the composited result (base texture + all overlay layers). Format: `{ "color": [r,g,b], "alpha": 0.9, "width": 3 }`. **Multiple plugins stack**: drawn widest-first, forming concentrically nested rings; ties broken by installation order (later install paints over earlier). The static colour is baked into the composite texture; for a **per-frame colour-shifting outline** (e.g. rainbow), an integration mod can register a provider for this plugin id in `DynamicOutlineTintRegistry` on the client (no datapack changes needed, see the API docs) |
| `extra_values` | Namespaced-number object | No | `{}` | Extension numeric fields: keys are ResourceLocations (must be namespaced), values are numbers. The framework only carries and sums them per key without interpreting their meaning. Integration mods can read the accumulated totals of a gun via `ModularShootAPI.getExtraValueSums` in plugin install/uninstall events and translate them into their own systems (e.g. writing a rarity component) |
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
| `alignment` | Text string | No | `"top_left"` | Nine-grid alignment: `"top_left"` / `"top_center"` / `"top_right"` / `"center_left"` / `"center"` / `"center_right"` / `"bottom_left"` / `"bottom_center"` / `"bottom_right"`. Only effective when `fit` is `"none"` |
| `fit` | Text string | No | `"none"` | Fit mode: `"none"` (no resampling, blended at the aligned position; parts beyond the canvas are clipped with a WARN) / `"fill"` (stretched to cover the whole canvas; distorted when aspect ratios differ) / `"contain"` (uniformly scaled to be fully visible, centred with transparent margins) |
| `tint` | Float array | No | `[1,1,1,1]` | RGBA multiplier: multiplies the layer pixels channel-by-channel (including alpha) before blending; white is the identity. E.g. `[1.0, 0.4, 0.3, 1.0]` tints the layer red |
| `blend` | Text string | No | `"normal"` | Colour mixing mode: `"normal"` (ordinary alpha-over) / `"multiply"` (darkens) / `"screen"` (brightens) / `"add"` (additive brightening, clamped to 1). Affects colour channels only; alpha always uses ordinary over compositing |
| `outline` | Object | No | None | Layer outline: strokes the layer's own alpha silhouette. Format: `{ "color": [r,g,b], "alpha": 1.0, "width": 1 }`, `width` in pixels (default 1). The stroke scales with the layer (`fill`/`contain` rescale it proportionally); the stroke colour never participates in `tint` |

**Visual enhancement example**: `data/examplemod/modularshoot/plugins/ember_overlay.json`

```json
{
  "name": "§cGun Ember",
  "tags": ["c:accessory"],
  "priority": 90,
  "item_icon": "examplemod:textures/plugins/ember.png",
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/ember_overlay.png",
    "layer": 5,
    "fit": "contain",
    "tint": [1.0, 0.4, 0.3, 1.0],
    "blend": "add",
    "outline": { "color": [1.0, 0.9, 0.4], "alpha": 1.0, "width": 1 }
  },
  "gun_outline": { "color": [1.0, 0.2, 0.1], "alpha": 0.9, "width": 3 }
}
```

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
    "base": { "render_mode": "billboard", "texture": "examplemod:textures/bullet/fast_bullet.png" },
    "modifiers": [ { "type": "scale", "value": 1.5 } ]
  },
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/rapid_barrel_overlay.png",
    "layer": 10,
    "alignment": "center",
    "fit": "fill"
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
| `visual_modifiers` | Object array | No | `[]` | Visual modifier list (same format as `bullet_style.modifiers`). Applied to the bullet's visual composition **when the trait is active**; no effect when inactive |

**Path**: `data/examplemod/modularshoot/traits/ignite.json`

```json
{
  "default_value": false,
  "name": "Incendiary Rounds",
  "description": "Ignites target on hit",
  "color": "#FF8800",
  "brief": "Ignites target for 3 seconds on hit",
  "force_show": false,
  "priority": 10,
  "visual_modifiers": [
    { "type": "tint", "color": [1.0, 0.4, 0.2] }
  ]
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
| `visual_modifiers` | Object array | No | `[]` | Conditional visual modifiers (see below). When a condition holds, its modifiers stack into the bullet's visual composition at bullet creation time |

### visual_modifiers Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `condition` | Object | **Yes** | — | Enable condition (see below) |
| `modifiers` | Object array | **Yes** | — | Modifiers applied when the condition holds (same format as `bullet_style.modifiers`) |

### condition Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `state` | Resource path string | **Yes** | — | State ID to check (must be namespaced, e.g. `"modularshoot:killstreak"`) |
| `domain` | Text string | No | Auto-resolve | Explicit value source: `"bullet"` (bullet state) or `"gun"` (gun state). When omitted, bullet state is checked first, then gun state. `"player"` is unsupported |
| `op` | Text string | **Yes** | — | Comparison operator: `">="` / `"<="` / `"=="` / `">"` / `"<"`. Boolean/string states support `"=="` only |
| `value` | Matching type | **Yes** | — | Threshold (number/boolean/string). UUID states do not support conditions |

### display Sub-fields

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | Text string | **Yes** | — | State name in the tooltip. Supports `§` and `lang:` |
| `color` | Text string | No | `""` | Name color (e.g. `"#FFAA00"`). Optional — the default tooltip color is used when omitted |
| `format` | Text string | No | `"{value}"` | Display template with the `{value}` placeholder |
| `priority` | Integer | No | `0` | Tooltip sort order, higher sorts first |
| `hide_default` | Boolean | No | `false` | Hide the line when the value equals the default |

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
  },
  "visual_modifiers": [
    {
      "condition": {
        "state": "modularshoot:killstreak",
        "domain": "bullet",
        "op": ">=",
        "value": 3
      },
      "modifiers": [
        { "type": "tint", "color": [1.0, 0.2, 0.2] },
        { "type": "scale", "value": 1.2 }
      ]
    }
  ]
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
