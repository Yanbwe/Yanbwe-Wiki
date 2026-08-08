# Data Pack Registration

Register ammo types and gun→ammo bindings via data pack JSON. Like the framework registries: `/reload` hot-reloads JSON definitions, and already-issued items follow the new definitions immediately.

## General Rules

- JSON files live in `data/<namespace>/modularshootammo/<registry-path>/<id>.json`
- The filename is the entry ID (without namespace); the namespace comes from the folder path
- Omitted optional fields use the defaults noted in code
- Both registries carry a network codec — entries **sync to clients** on connection (the HUD and tooltips query them)

## Ammo Type JSON (`ammo_types`)

**Path**: `data/<namespace>/modularshootammo/ammo_types/<ammoTypeId>.json`

| JSON key | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | String | **Yes** | — | Display name; supports the `lang:` translation-key prefix |
| `color` | String | **Yes** | — | Identifier color, `"#RRGGBB"` format (`#` prefix optional); falls back to white on parse failure, never crashes |
| `item` | Resource location | **Yes** | — | Ammo item id (determines which item counts as reserve ammo in the inventory) |
| `reserve_limit` | Integer | No | Unlimited | Reserve cap: the usable reserve count is truncated to this value |
| `per_shot_cost` | Integer | No | `1` | Ammo consumed per shot (e.g. 2 shells per shotgun blast) |
| `reload_sound` | Resource location | No | None | Reload sound override, takes precedence over the generic reload sounds |

**Example** (bundled data, the pistol round bound to `demo_pistol`):

```json
{
  "name": "lang:modularshootammo.ammo_type.pistol_ammo",
  "color": "#FFAA00",
  "item": "modularshootammo:pistol_ammo",
  "per_shot_cost": 1
}
```

**Full example with a reserve cap and dedicated reload sound**:

```json
{
  "name": "lang:modularshootammo.ammo_type.sniper_ammo",
  "color": "#AA88FF",
  "item": "modularshootammo:sniper_ammo",
  "reserve_limit": 128,
  "per_shot_cost": 1,
  "reload_sound": "modularshootammo:reload_start"
}
```

> With a `lang:` prefix on `name`, register the key in your language files; missing translations fall back to the key itself.

## Gun→Ammo Binding JSON (`gun_ammo_bindings`)

**Path**: `data/<namespace>/modularshootammo/gun_ammo_bindings/<gunId>.json`

| JSON key | Type | Required | Description |
|----------|------|----------|-------------|
| `ammo_type` | Resource location | **Yes** | The bound ammo type id (`ammo_types` registry) |

**Example**:

```json
{
  "ammo_type": "modularshootammo:pistol_ammo"
}
```

## Framework-Side Items

The ammo system builds on framework registries. The bundled data (namespace `modularshootammo`) declares the following framework entries:

| Framework registry | Entries | Description |
|--------------------|---------|-------------|
| `modularshoot:traits` | `uses_ammo` | A gun enables the ammo system by declaring `"uses_ammo": true` |
| `modularshoot:traits` | `infinite_ammo` | Exempts from ammo deduction when declared (HUD shows ∞) |
| `modularshoot:states` | `mag_ammo` (gun/int) | Magazine count, default 0 |
| `modularshoot:states` | `reload_tick` (player/int), `reload_gun` (player/uuid) | Reload countdown and target gun |
| `modularshoot:attribute_meta` | `mag_size`, `reload_time` | Bound to this mod's vanilla attributes (`modularshootammo:mag_size` / `modularshootammo:reload_time`); gun base values go in the `stats` of the `guns` JSON |

**Enabling a gun** (excerpt of `modularshoot:guns/demo_pistol.json`):

```json
{
  "stats": {
    "modularshootammo:mag_size": 12,
    "modularshootammo:reload_time": 15,
    "modularshoot:hit_damage": 6
  },
  "traits": {
    "modularshootammo:uses_ammo": true
  }
}
```

> Full field formats live in the [framework data pack docs](../modularshoot/DataPack.md). The exact reload/deduction behavior is implemented by this mod's `AmmoService` and is not detailed here.
