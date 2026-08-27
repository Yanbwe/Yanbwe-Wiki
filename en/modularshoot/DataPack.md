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
| `attribute_mount` | Text string | No | `"item"` | Attribute mount declaration: `"item"` (default; item-side, the framework writes the main-hand attribute modifier component as usual) / `"player"` (player-side; the framework does not write an item attribute modifier component for this gun, transferring mounting responsibility to the declaring side, e.g. mounting modifiers directly on a player entity). Omitting the key is equivalent to `"item"` |
| `stats` | Attribute ID → decimal object | No | `{}` | Attribute base values. Keys are attribute IDs: bare keys (no colon) are auto-completed to the `modularshoot` namespace (e.g. `"hit_damage"` ≡ `"modularshoot:hit_damage"`), an explicit `minecraft:` prefix is normalised to `modularshoot` as well, and other explicit namespaces pass through verbatim. Missing attributes use metadata table defaults |
| `traits` | Trait ID → boolean object | No | `{}` | Gun inherent trait overrides. Empty `{}` if no traits |
| `variants` | Variant ID → decimal object | No | `{}` | Variant pool base weights: variant ID → weight. E.g. `"variants": { "modularshoot:example_fireball": 0.5, "modularshoot:example_heavy_blade": 1.5 }`. The pool is assembled fresh per shot, summed with plugins' `adds_variants`, adjusted by contributor weight modifiers, then rolled weighted-random (see "Variant JSON") |
| `extra_values` | Namespaced-number object | No | `{}` | Extension numeric fields: keys are ResourceLocations (must be namespaced), values are numbers. The framework only carries and sums them per key without interpreting their meaning; `ModularShootAPI.getExtraValueSums` / `getExtraValue` return them summed with installed plugins' accumulated values (the gun definition provides the base) |
| `slots` | Plugin type ID → integer object | No | `{}` | Plugin slot config. Key is plugin type ID, value is slot count |
| `sounds` | String → resource path object | No | `{}` | Sound bindings. E.g. `"shoot": "modularshoot:gun.rifle.shoot"` |
| `sound_range` | Decimal number | No | None (the sound event's own range, default 16 blocks) | Audible-radius override in blocks. When absent, the sound event's own range (default 16 blocks) is used. E.g. `"sound_range": 24` |
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
| `name` | Text string | No | None | Display name. Supports `§` color codes and `lang:` translation key prefix |
| `tags` | String array | No | `[]` | Matching tag list (e.g. `["c:barrel", "examplemod:barrel"]`). Empty array matches no types |
| `priority` | Integer | No | `0` | Trait conflict priority, higher wins |
| `item_icon` | Resource path string | **Yes** | — | Item icon texture path |
| `texture_scale` | Text string | No | `"auto"` | Whether the icon geometry scales with the texture resolution; same semantics as the gun's `texture_scale` (`"auto"` / `"fixed"`) |
| `modifiers` | Object array | No | `[]` | Attribute modifier list (see sub-table below) |
| `traits` | Trait ID → boolean object | No | `{}` | Trait overrides provided on install. Keys must be fully namespaced — bare keys silently resolve to the `minecraft` namespace (asymmetric with the gun side, which auto-completes `modularshoot`) |
| `adds_variants` | Variant ID → decimal object | No | `{}` | Base weights appended to the gun's variant pool. Summed with the gun-declared weight of the same variant. E.g. `"adds_variants": { "modularshoot:example_fireball": 0.5 }`. Keys must be fully namespaced — bare keys silently resolve to the `minecraft` namespace (see "Variant JSON") |
| `adds_slots` | Slot type ID → integer object | No | `{}` | Slot extension: increases the count of specified slot types on install, or **creates** slot types the gun never declared. Effective key set = gun `slots` ∪ installed plugins' `adds_slots` keys; effective capacity = gun base + sum of installed plugins' contributions. Values are arbitrary integers (negative values occupy slots; a capacity ≤ installed count can no longer accept new plugins). E.g. `"adds_slots": { "combat": 1, "modularshoot:accessory": 1 }` (bare keys auto-complete to the `modularshoot` namespace, same rule as the gun's `slots`). Keys must reference the `plugin_types` registry. Install matching and the tooltip plugin bar both use the effective slot configuration; uninstall rules see the "Overflow pre-check" section of the API doc |
| `exclusive_group` | Text string | No | None | Mutual exclusion group ID. Same-group on same gun = can't coexist |
| `bullet_style` | Object | No | None | Bullet style (same format as gun's `bullet_style`). **Stacks**: plugin vs gun base picks a winner by `visual_priority` (falling back to `priority` when undeclared; ties broken by install order, later wins); all modifiers stack |
| `visual_priority` | Integer | No | None (falls back to `priority`) | Dedicated election priority for this plugin's `bullet_style` base in the visual base election; falls back to `priority` when undeclared. Ties broken by install order (later wins) |
| `texture_overlay` | Object | No | None | Texture overlay (see sub-table below) |
| `gun_outline` | Object | No | None | Whole-gun outline: strokes the silhouette of the composited result (base texture + all overlay layers). Format: `{ "color": [r,g,b], "alpha": 0.9, "width": 3 }`. **Multiple plugins stack**: drawn widest-first, forming concentrically nested rings; ties broken by installation order (later install paints over earlier). The static colour is baked into the composite texture; for a **per-frame colour-shifting outline** (e.g. rainbow), an integration mod can register a provider for this plugin id in `DynamicOutlineTintRegistry` on the client (no datapack changes needed, see the API docs) |
| `extra_values` | Namespaced-number object | No | `{}` | Extension numeric fields: keys are ResourceLocations (must be namespaced), values are numbers. The framework only carries and sums them per key without interpreting their meaning. Integration mods can read a gun's `extra_values` totals (gun-definition base plus installed plugins' accumulated values) via `ModularShootAPI.getExtraValueSums` in plugin install/uninstall events and translate them into their own systems (e.g. writing a rarity component) |
| `brief` | Text string | No | None | One-line summary. Supports the `lang:` translation key prefix |
| `description` | Text string | No | None | Multi-line detailed description. Supports the `lang:` translation key prefix |
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
| `binds` | Resource path string | **Yes** | — | Points to a registered vanilla `Attribute` ID (e.g. `"minecraft:generic.max_health"`). Framework resolves the `Attribute` holder through this field. **Shared by all three paths**: mounting (gun base-value modifiers resolve their mount target), resolution (shot resolution, fire-rate gating, client prediction, `/modularshoot stats` and debug command reads) and display (tooltip values) all resolve through `binds`; may point to any registered attribute (incl. `minecraft:*`) |
| `default_value` | Decimal number | **Yes** | — | Gun base value when not declared by the gun (participates in additive calculations). **Not the vanilla base value** |
| `entity_types` | Entity type ID array | No | `["minecraft:player"]` | **Read-effect whitelist**: only entity types in this list have their attribute values read by the framework; entity types outside the list degrade to `0.0` on read. Defaults to player-only (preserving the pre-whitelist behavior). The mounting side pre-mounts the framework's 10 preset attributes onto **every** entity type (lazily instantiated; the cost is negligible), so this field controls only "whose value takes effect", not "who can mount" — a datapack-only change switches the effect scope without touching code. The `attribute_binds` of shooters are subject to the same whitelist (see "Shooter JSON") |
| `description` | Text string | No | `""` | Description text |
| `color` | Text string | No | `""` | Name color |
| `priority` | Integer | No | `0` | Display priority |
| `force_show` | Boolean | No | `false` | Force display |
| `unit` | Text string | No | None | Translation key for the unit displayed after the numeric value (e.g. `"modularshoot.unit.per_second"`); absent → no unit shown |

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

**Path**: `data/examplemod/modularshoot/attribute_meta/hit_damage.json`

(**Rebinding example** — rebind the logical attribute `hit_damage` to the vanilla attack damage attribute. Same path as the example above; deploy only one of them)

```json
{
  "binds": "minecraft:attack_damage",
  "default_value": 10.0
}
```

> **Effect**: while holding the gun, the player's attack damage = vanilla base (1.0) + gun damage (10.0) = **11**, and shot resolution reads the same value; when the gun is no longer held the modifier is removed and attack damage returns to the vanilla base; melee damage while holding the gun also scales up (a feature, not a defect).

> **Notes**:
> - **Base offset convention**: when bound to an attribute with a non-zero base, the resolved value is "attribute base + modifier net". E.g. rebound to `minecraft:attack_damage` (player base = 1.0) → resolved = 1.0 + gun damage. The framework does **not** auto-calibrate; datapack authors compensate via `default_value` or gun `stats`
> - **Melee side effect**: with the modifier mounted on `minecraft:attack_damage`, melee damage while holding the gun scales up too (a feature, not a defect)
> - **syncable convention**: binding targets should preferably be syncable attributes — client prediction and tooltip need the synced value; on non-syncable attributes the client reads 0.0 and client-side fire-rate prediction is **silently disabled** (server unaffected)
> - **Add = plug-and-play, delete = disabled**: adding an attribute_meta entry for any logical id makes gun `stats` support that key automatically (beyond the 10 preset attributes); deleting an entry disables that logical attribute's mounting and resolution (reads 0.0)
> - **Avoid multiple entries binding the same attribute**: base modifiers share the fixed ID `modularshoot:gun_base`; multiple entries on the same attribute overwrite each other with no guaranteed winner
> - **Degradation contract unchanged**: `binds` target not registered → metadata entry is kept, modifier not mounted, tooltip not shown, reads return 0
> - **Effect scope is datapack-controlled**: the mounting side pre-mounts the framework's 10 preset attributes onto **every** entity type (lazily instantiated), so `entity_types` decides "whose value is read" — entities outside the whitelist read `0.0`, and a datapack-only change switches the effect scope. The player is always mounted first, explicitly. Third-party attributes are mounted on players only (the framework pre-mounts only its own attributes); when `entity_types` hits a non-player entity whose attribute body was never mounted, the read degrades to `0.0` as well

## Shooter JSON (shooters)

**Path**: `data/<namespace>/modularshoot/shooters/<shooter_id>.json`

A **shooter definition** (`ShooterDefinition`) is the **config template** for independent firing (non-player sources: turrets, traps, boss attacks, scripted scenarios, ...): it provides a numeric template, and at firing time the content mod overlays live attribute values read from a source entity on top of it, producing a bullet snapshot handed to `ModularShootAPI.fireBullet`. The registry key (the shooter id) is supplied by the registry itself; it is not a JSON field.

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `stats` | Attribute ID → decimal object | **Yes** | — (**non-empty**: an empty template/empty object fails the whole entry load with `stats must not be empty`) | The snapshot's numeric template: logical attribute ID → base value. **Keys must be fully namespaced** (e.g. `"modularshoot:hit_damage"`) — unlike gun `stats`, the `modularshoot` namespace is NOT auto-completed here; bare keys fail parsing |
| `traits` | Trait ID → boolean object | No | `{}` | Inherent trait flags on the snapshot (e.g. `"examplemod:ignite": true`). Keys must also be fully namespaced |
| `bullet_style` | Object | No | None | Independent-firing visual style, same structure as a gun's `bullet_style` (`base` + `modifiers`). When absent, the framework default bullet appearance applies at compose time |
| `shoot_sound` | Object | No | None | Shoot sound (see sub-table below). Absent → silent |
| `attribute_binds` | Resource path string array | No | `[]` | Attribute bind list: at snapshot time each id is read live from the **source entity** and **overrides** the template entry (introducing new keys is allowed, matching the `extra_values` convention); an empty read keeps the **template value**. Read conditions below under "createSnapshot semantics" |

**shoot_sound sub-fields** (`ShootSound` record):

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `id` | Resource path string | **Yes** | — | A registered sound event id (e.g. `"minecraft:entity.skeleton.shoot"`). Unregistered → playback skipped with a WARN |
| `volume` | Decimal number | No | `1.0` | Playback volume |
| `pitch` | Decimal number | No | `1.0` | Playback pitch |

**createSnapshot semantics** (`ShooterDefinition.createSnapshot(LivingEntity source, RegistryAccess registryAccess)`):

- Starts from the `stats` template and processes each `attribute_binds` id in declared order: **a value read overrides** the template entry (or introduces a new key); **an empty read keeps the template value**
- Three read-failure cases (all keep the template value): `source` is `null` (no source entity); no `attribute_meta` entry for the logical attribute id (logged with a WARN); the source entity's type is outside the entry's `entity_types` whitelist
- The resulting snapshot follows the independent-firing convention (`gunId`/`gunInstanceUuid`/`shooter` all `null`) and leaves the damage type `null` — the `ModularShootAPI.fireBullet` facade patches in the framework default at firing time
- The sound is **not played automatically on firing** (`fireBullet` plays no sound): content mods call `playShootSound(Level, Vec3)` at the firing position when needed (silently skipped when no `shoot_sound` is declared)

**Conflicts & degradation**:

- Same ID via `registerShooter` (Java API) → Java API wins, the datapack entry is ignored with a WARN (the same registration-conflict mechanism as `registerGun`)
- An `attribute_binds` id without an `attribute_meta` entry → WARN, **template value kept**
- `shoot_sound.id` not in the `SOUND_EVENT` registry → WARN, playback skipped
- Empty `stats` → the whole entry fails to load (author error, not degradation)

**Path**: `data/modularshoot/modularshoot/shooters/example_bone_shooter.json` (bundled example: bone shooter — numeric template + independent visuals)

```json
{
  "stats": {
    "modularshoot:hit_damage": 6.0,
    "modularshoot:bullet_speed": 2.5,
    "modularshoot:range": 48.0,
    "modularshoot:bullet_size": 0.25
  },
  "bullet_style": {
    "base": {
      "render_mode": "billboard",
      "texture": "modularshoot:textures/bullet/default.png"
    }
  }
}
```

**Full-field example** (`data/examplemod/modularshoot/shooters/boss_turret.json`):

```json
{
  "stats": {
    "modularshoot:hit_damage": 12.0,
    "modularshoot:bullet_speed": 40.0,
    "modularshoot:range": 96.0,
    "modularshoot:bullet_size": 0.4
  },
  "traits": {
    "examplemod:ignite": true
  },
  "bullet_style": {
    "base": {
      "render_mode": "billboard",
      "texture": "examplemod:textures/bullet/boss_fireball.png"
    },
    "modifiers": [
      { "type": "scale", "value": 1.5 },
      { "type": "tint", "color": [1.0, 0.4, 0.1] }
    ]
  },
  "shoot_sound": {
    "id": "minecraft:entity.blaze.shoot",
    "volume": 0.8,
    "pitch": 1.2
  },
  "attribute_binds": [
    "examplemod:boss_power"
  ]
}
```

> In the example above, `examplemod:boss_power` must first be registered in `attribute_meta` (including its `entity_types` whitelist). When a boss fires and its entity type is whitelisted, the snapshot's `modularshoot:hit_damage` is overridden by the boss's live `boss_power` value; otherwise the template value `12.0` is kept.

## Variant JSON

**Path**: `data/<namespace>/modularshoot/variants/<variant_id>.json`

| JSON Key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `base_weight` | Decimal number | No | `0.0` | Base weight fallback. Used only when *no* gun/plugin declares this variant in its pool (typical for variants introduced solely via `registerVariantContributor`); declared gun/plugin weights are authoritative |
| `traits` | Trait ID → boolean object | No | `{}` | **Merged** into the snapshot when selected: declared trait values are written, unlisted keys are kept |
| `stats` | Attribute ID → decimal object | No | `{}` | When selected, **overrides only the declared keys** (does not replace the whole snapshot stat table) |
| `damage_type` | Resource path string | No | None | When present, overrides the `ammo_damage_type` preset (variant takes precedence) |
| `bullet_style_override` | Object | No | None | Visual override, same format as `bullet_style` (base + modifiers). Its base participates in the visual composition election with the highest priority (beats gun / plugins / traits / state conditions); modifiers stack as usual. Read by server-side compose only; never serialised to clients |

**Weight sources (assembled fresh every shot, never persisted)**:

| Source | Location | Merge rule |
|--------|----------|------------|
| Gun declaration | Gun JSON `variants` | Base weight |
| Plugin declaration | Plugin JSON `adds_variants` | **Summed** with the gun's weight of the same variant |
| Contributor modifiers | `AttributeModifier`s declared via `registerVariantContributor` / `sink.add` | Vanilla three stages: `ADD_VALUE` (flat add) → `ADD_MULTIPLIED_BASE` (multiplies base + ADD_VALUE) → `ADD_MULTIPLIED_TOTAL` (scales the whole) |
| Default normal-bullet fallback | Implicit (not written into any JSON) | When the gun declares **no** `variants`, the pool implicitly contains a "normal bullet" candidate with weight `1.0`, participating in the probability calculation |

> A zero base with no ADD_VALUE modifier always resolves to `0` — "a fire trinket is useless on a non-fire gun". Variants with a final weight ≤ 0 never participate in the roll.

> **Fallback rationale**: without this fallback, "a normal gun + a 50% fireball plugin" (`adds_variants: 1.0`) would trigger 100% of the time because the fireball would be the pool's only candidate — the plugin's probability semantics would be distorted. With the fallback the pool becomes {fireball 1.0, normal bullet 1.0} → exactly 50%. **Guns that do declare `variants` get no fallback** — probabilities are computed strictly from the declared weights.

**Probability math (developer quick reference)**: weights are **relative proportions** — there is no fixed "weight X = 50%"; the actual probability depends on the whole pool's total weight:

- `P(variant X) = X's final weight ÷ pool total weight`. The pool total = the sum of the final weights of all positive-weight candidates (including the normal-bullet fallback `1.0` when the gun declares no `variants`)
- A single-candidate pool always rolls 100% (no matter the weight); a two-candidate pool with equal weights (e.g. `1 : 1`) gives 50% each
- A variant hits 50% ⟺ its weight equals the sum of all the other candidates' weights

Examples: a normal gun (no `variants` declared) + a fireball plugin `adds_variants: 1.0` → pool {fireball 1.0, normal bullet 1.0} → exactly 50%; if a gun declares `"variants": { "modularshoot:example_fireball": 0.5, "modularshoot:example_heavy_blade": 1.5 }` → pool total 2.0 → fireball 25%. The final weight = the base weight computed through the three stages (`ADD_VALUE` add → `ADD_MULTIPLIED_BASE` multiplies base + ADD_VALUE → `ADD_MULTIPLIED_TOTAL` scales the whole), influenced by `registerVariantContributor` modifiers.

> **Plugin description guideline**: a plugin JSON's `description` (visible in the player tooltip) should not state raw weight numbers — write the computed probability or a qualitative statement instead (e.g. "the fireball chance rises sharply"). The bundled plugin `modularshoot:fragment_fire` demonstrates this (its `description` resolves via `lang:` to "Bullets catch fire and the fireball chance rises sharply").

**Per-pellet semantics**: the variant is rolled **independently per pellet** (one election affects only that pellet), so a shotgun blast can mix different variants or normal pellets; an all-zero-weight or empty pool silently yields a normal pellet. Mutually-exclusive single-value fields (`damage_type` / visual `base`) must go through the variant pool; stackable effects should use `registerShootEffect`.

> **Bundled multi-pellet demo**: the gun `modularshoot:blood_sword` declares `"modularshoot:pellet_count": 5.0` in its `stats` (5 pellets per shot, each rolled independently); the fireball plugin `modularshoot:fragment_fire` appends `"modularshoot:example_fireball": 0.5` to the pool via `adds_variants` — on `blood_sword`, which declares no `variants`, the pool becomes {fireball 0.5, normal bullet 1.0} → ≈33% fireball; `modularshoot:composite_cane` instead declares `"variants": { "modularshoot:example_fireball": 0.5 }` (declared weights are authoritative, no normal-bullet fallback → single-candidate pool rolls 100%).

**Path**: `data/modularshoot/modularshoot/variants/example_fireball.json` (bundled demo: high damage + fire damage type + fireball visuals)

```json
{
  "base_weight": 0.0,
  "stats": { "modularshoot:hit_damage": 15.0 },
  "damage_type": "minecraft:in_fire",
  "bullet_style_override": {
    "base": { "render_mode": "billboard", "texture": "modularshoot:textures/bullet/default.png" },
    "modifiers": [
      { "type": "tint", "color": [1.0, 0.4, 0.1, 1.0] },
      { "type": "scale", "value": 1.3 }
    ]
  }
}
```

**Path**: `data/modularshoot/modularshoot/variants/example_heavy_blade.json` (bundled demo: heavy blade — overrides damage and bullet size, dark-red visuals)

```json
{
  "base_weight": 0.0,
  "stats": { "modularshoot:hit_damage": 18.0, "modularshoot:bullet_size": 0.75 },
  "bullet_style_override": {
    "base": { "render_mode": "billboard", "texture": "modularshoot:textures/bullet/default.png" },
    "modifiers": [
      { "type": "tint", "color": [0.75, 0.1, 0.1, 1.0] },
      { "type": "scale", "value": 1.5 }
    ]
  }
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

## Item Binding JSON (gun_items / plugin_items)

**Path**: `data/<namespace>/modularshoot/gun_items/<any_entry_id>.json` / `modularshoot/plugin_items/<any_entry_id>.json`

Binds **other mods' items** as framework guns/plugins — once bound, every instance of that item ID is recognised by the framework as a gun/plugin, and the **original item is preserved** (model / texture / acquisition paths unchanged). The entry key is an arbitrary file id; the content declares the binding target; both fields are required.

| JSON Key | Type | Required | Description |
|----------|------|----------|-------------|
| `item` | Resource path | **Yes** | The bound item ID (e.g. `minecraft:diamond_sword`) |
| `gun` | Resource path | **Yes** (gun_items) | Target gun definition ID (an entry in the `modularshoot:guns` registry) |
| `plugin` | Resource path | **Yes** (plugin_items) | Target plugin definition ID (an entry in the `modularshoot:plugins` registry) |

**Path**: `data/examplemod/modularshoot/gun_items/diamond_sword_rifle.json`

```json
{
  "item": "minecraft:diamond_sword",
  "gun": "examplemod:sword_rifle"
}
```

**Path**: `data/examplemod/modularshoot/plugin_items/life_amulet.json`

```json
{
  "item": "examplemod:life_amulet",
  "plugin": "examplemod:life_amulet_plugin"
}
```

**Post-load validation** (WARN degrade, entry retained):

- `item` must exist in the item registry; missing → WARN
- `gun`/`plugin` must exist in the corresponding definition registry; missing → WARN (a missing gun definition manifests as "cannot shoot" + a degrade hint)
- Multiple bindings for the same item ID → the lexicographically smallest entry key wins, the rest WARN
- Conflict with a Java API binding (`registerGunItem`/`registerPluginItem`) → Java API wins, the datapack entry WARNs

**Behavior notes**:

- **Converts upon entering the inventory**: within 1 tick of a bound gun entering the player's inventory, the server automatically attaches the `gun_data` component (instance UUID and base attribute modifiers). After that it is fully runtime-isomorphic with native guns — plugin installation, locking, state persistence and bullet backtracking all behave identically; no need to hold it
- **Plugins attach no component**: bound plugins are consumed on install; the pluginId is resolved directly through the binding table
- **Full conversion**: on bound guns, left-click melee is replaced by shooting, enchantments are nullified, and shooting does not consume durability; offhand restrictions, reload key, debug commands and tooltip all apply automatically
- **Identity hint**: an unconverted bound gun shows the grey `Gun: <id>` identifier line in its tooltip plus the base attribute/slot preview registered in the definition; converted ones show the full runtime tooltip
- **Main menu limitation**: datapack bindings show no hint in the main-menu creative inventory (registry not loaded); Java API bindings are exempt
- **Visuals**: the original item model is kept for rendering; the dynamic texture pipeline (recoloring / overlays / outlines / shoot-texture swapping) serves native guns only

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
