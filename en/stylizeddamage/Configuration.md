# Configuration (common.json)

The configuration file is located at:

```
config/stylizeddamage/common.json
```

If the file does not exist, the mod will automatically generate a default config on first load.

---

## Selectors

Selectors determine which style is used for each damage event. Three-layer matching:

| Layer | Match Type |
|-------|-----------|
| 1 | Damage value range (optional) |
| 2 | Target entity type/team (optional) |
| 3 | Damage type match array |

### Range Key Format

| Format | Meaning |
|--------|---------|
| `"common"` | Default fallback |
| `"[min,max]"` | Closed interval |
| `"[min,...]"` | Min and above |
| `"[...,max]"` | Max and below |

### Branch Paths

| Branch | Condition |
|--------|-----------|
| `player.yourTeam` | Target is player on your team |
| `player.otherTeam` | Target is player on different team |
| `player.common` | Target is player with no team info |
| `mob.hostile` | Target is hostile mob |
| `mob.passive` | Target is passive mob |
| `mob.common` | Target is mob with unknown hostility |
| `common` | Fallback |

### Match Array

- Conditions are OR-ed together
- Supports damage type IDs: `"minecraft:in_fire"`
- Supports tags: `"#minecraft:bypasses_armor"`, `"#minecraft:is_fire"` (auto-expanded at startup)
- Supports pseudo types: `"heal"`, `"absorption"`, `"kill"`
- Supports critical hits: `"critical"`
- Wildcard: `"*"`

---

## Display Filter

Controls which damage events show numbers.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | string | `"byTarget"` | Judgment mode: `"bySource"` or `"byTarget"` |
| `hideSelfDamage` | boolean | `true` | Hide self-damage |

---

## Display Opacity

Controls damage number opacity based on the **damage source**.

```json
"displayOpacity": {
    "player": 1.0,
    "mobHostile": 0.5,
    "mobPassive": 0.75,
    "other": 1.0
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `player` | float | `1.0` | Opacity for player-caused damage |
| `mobHostile` | float | `0.5` | Opacity for hostile mob damage |
| `mobPassive` | float | `0.75` | Opacity for passive mob damage |
| `other` | float | `1.0` | Opacity for other sources |

> This multiplies on top of the animation opacity. E.g. animation opacity 0.8 × `mobHostile` 0.5 = final alpha 0.4.

---

## Distance Scale

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `distanceScaleSegment` | float | `10.0` | Distance segment (blocks) |
| `distanceScaleFactor` | float | `0.2` | Scale factor per segment |
| `distanceScaleMin` | float | `0.3` | Minimum scale multiplier |
| `maxDisplayDistance` | float | `64.0` | Maximum display distance (blocks) |

---

## Total Damage Panel

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable total damage panel |
| `resetTimeout` | int | `200` | Reset delay in ticks (20 ticks = 1 second) |
| `maxTrailCount` | int | `50` | Max trail entries |
| `baseFontSize` | float | `2.0` | Base font size multiplier |
| `sizeOffsetPerThousand` | float | `0.5` | Font size increment per 100 damage |
| `sizeOffsetMax` | float | `3.0` | Max font size multiplier |
| `positionX` | float | `0.0` | Horizontal offset in pixels (positive = right) |
| `positionY` | float | `0.0` | Vertical offset in pixels (positive = down) |
| `enableEntryAnimation` | boolean | `true` | Play entry animation on total damage number |
| `enableExitAnimation` | boolean | `true` | Play exit animation on total damage number |
| `enableBounceAnimation` | boolean | `true` | Bounce when total damage value changes |
| `enableTrailEntryAnimation` | boolean | `true` | Trail entries slide in from right |
| `enableTrailExitAnimation` | boolean | `true` | Trail entries slide out to left |
| `bounceScalePeak` | float | `1.4` | Peak scale during bounce (1.4 = 140% size) |

---

## Pseudo Damage Types

| ID | Trigger | Notes |
|----|---------|-------|
| `heal` | Entity healed | Requires `showHealing: true` |
| `absorption` | Absorption increased | Requires `showAbsorption: true` |
| `kill` | Fatal damage | Not counted in total damage / trail. Always rendered on top. Uses matched style's `killText` field instead of damage value. |

---

## Reload

```bash
/stylizeddamage reload
```
