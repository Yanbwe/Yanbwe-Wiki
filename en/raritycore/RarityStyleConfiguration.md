# RarityStyle Configuration Guide (V14)

Since V14, the old `client.json` and `RarityClientConfig.json` are consolidated into a single file:

```
config/raritycore/RarityStyle.json
```

This file manages all rarity visual appearance — colors, borders, tooltips, stars, item name colors, and the fallback behavior for items without a configured rarity.

## File Structure Overview

```json
{
  "enableBorder": true,
  "enableTooltip": true,
  "tooltipColorEnabled": true,

  "defaults": {
    "color": "inherit",
    "border": {
      "useTexture": true,
      "defaultTexture": "raritycore:textures/border/rarity_{level}.png",
      "style": 1,
      "show": true,
      "fallback": "inherit"
    },
    "tooltip": {
      "show": true,
      "content": "[@{level}]-@{star}]",
      "colored": true,
      "level": {
        "colored": true,
        "translationKey": "$(rarity.core.{level})",
        "fallback": "{level}$(rarity.core.special.rarity.prefix)"
      },
      "star": {
        "colored": true,
        "mode": "repeat",
        "repeatChar": "★",
        "custom": ""
      },
      "specialRarityTexts": {}
    },
    "itemNameColor": true,
    "noRarity": {
      "skip": false,
      "defaultRarity": 1
    }
  },

  "rarities": {
    "1": { "color": "#CCCCCC" },
    "2": { "color": "#55FF55" },
    "3": { "color": "#55FFFF" },
    "4": { "color": "#FF55FF" },
    "5": { "color": "#FFCC00" },
    "6": { "color": "#FF6666" },
    "7": { "color": "#FF3333" }
  }
}
```

## Global Master Switches

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enableBorder` | Boolean | `true` | Enable item border rendering (old `enableItemBorderRendering`) |
| `enableTooltip` | Boolean | `true` | Insert rarity info into tooltips (old `enableTooltipInsert`) |
| `tooltipColorEnabled` | Boolean | `true` | Master switch for tooltip text coloring (old `enableTooltipColor`); combined with the `colored` field via AND |

> Other old `client.json` switches (`itemBorderStyle`, `useTextureBorder`, `enableItemNameColor`, `skipUnconfiguredItems`, `starDisplay`, etc.) are moved under `defaults`. At startup `client.json` retains only `enableCacheSystem`.

## defaults: default values and inheritance root

### color
- Type: string, default `"inherit"`
- `"inherit"`: walk down to lower levels to find the first explicit `#RRGGBB`; if none, fall back to the built-in per-level default color.
- `#RRGGBB`: directly specifies the color for that level.

### border
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `useTexture` | Boolean | `true` | Use texture border (old `useTextureBorder`) |
| `defaultTexture` | String | `raritycore:textures/border/rarity_{level}.png` | Texture path; `{level}` replaced by the level number (old `rarity_1.png` convention) |
| `style` | Integer | `1` | `1`=solid fill, `0`=hollow (old `itemBorderStyle`) |
| `show` | Boolean | `true` | Whether to show the border (old `renderer` master switch) |
| `fallback` | String | `"inherit"` | Border texture fallback strategy for levels above 7 |

`border.fallback` values:
- `"inherit"`: levels above 7 reuse the level 7 texture (default behavior).
- Any other path string: used as a uniform texture for levels above 7; supports `{level}` placeholder, e.g. `"raritycore:textures/border/rarity_special.png"`.

### tooltip
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `show` | Boolean | `true` | Whether to show the tooltip (old `tooltips` master switch) |
| `content` | String | `[@{level}]-@{star}]` | Template; placeholders below |
| `colored` | Boolean | `true` | Whether to color the entire tooltip line (including static separators like `[`, `]`, `-`) |

`colored` behavior:
- Enabled: the whole line uses the rarity color; `level`/`star` segments are not colored individually.
- Disabled: falls back to per-segment coloring via `level.colored` and `star.colored`.

### tooltip.level
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `colored` | Boolean | `true` | Whether the level name is individually colored (only when `tooltip.colored` is off) |
| `translationKey` | String | `$(rarity.core.{level})` | Source of the level name; `$(...)` is a translation key with `{level}` replaced by the number; a non-`$(...)` value is used as a literal |
| `fallback` | String | `{level}$(rarity.core.special.rarity.prefix)` | Used when the translation key is missing; `{level}` replaced by the number |

### tooltip.star
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `colored` | Boolean | `true` | Whether stars are individually colored (only when `tooltip.colored` is off) |
| `mode` | String | `repeat` | `repeat`=repeating character; `custom`=custom string |
| `repeatChar` | String | `★` | Character repeated in repeat mode; repeat count = rarity level |
| `custom` | String | `""` | Custom string for custom mode (not level-dynamic) |

### itemNameColor
- Type: Boolean, default `true`
- Whether to recolor the item name by rarity (old `enableItemNameColor` / `nameColor`).

### noRarity
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `skip` | Boolean | `false` | Skip items without a configured rarity (old `skipUnconfiguredItems`) |
| `defaultRarity` | Integer | `1` | Default rarity level when not skipping; then runs through normal inheritance |

## rarities: per-level overrides

Under `rarities`, keys `"1"`~`"7"` (and higher numeric keys) override any `defaults` field; missing fields inherit from `defaults`.

```json
"rarities": {
  "1": { "color": "#CCCCCC" },
  "8": {
    "color": "#FF00FF",
    "border": { "defaultTexture": "raritycore:textures/border/rarity_8.png" }
  }
}
```

## Placeholders and String Resolution

- `@{level}`: resolved to the rarity level name (from `tooltip.level.translationKey` + `fallback`, not the number).
- `@{star}`: resolved to the rarity star string (from `tooltip.star`).
- `$(key)`: embedded translation key, resolved to the text in the language file.
- `$(key)` as a whole string (`translationKey`/`fallback` etc.): treated as a translation key; on miss, uses `fallback`.

## Inheritance Rules

When a field is missing at a level (or `color` is `"inherit"`), walk down to lower levels to find the first explicit value; if none, use the corresponding `defaults` default. When `color` inheritance reaches the bottom with no explicit value, fall back to the built-in per-level default color. Applies to: `color`, `border.*`, `tooltip.show`, `tooltip.content`, `tooltip.colored`, `tooltip.level.*`, `tooltip.star.*`, `itemNameColor`.

## Translation Keys and Language Files

New numeric keys (both en_us and zh_cn):

```
rarity.core.1 = Common   / 普通
rarity.core.2 = Uncommon / 稀有
rarity.core.3 = Rare     / 罕见
rarity.core.4 = Epic     / 史诗
rarity.core.5 = Legendary/ 传说
rarity.core.6 = Mythical / 神话
rarity.core.7 = Unique   / 唯一
```

`rarity.core.special.rarity.prefix` is retained. The old named keys (`rarity.core.common` etc.) are removed.

## How to Apply

```
/raritycore-client reload
```

This command reloads `RarityStyle.json` and refreshes the cache. If the file is missing, a default config is generated at startup; if corrupted, delete it and reload to regenerate.

## Texture Borders

If texture borders are enabled (`border.useTexture=true`), prepare 16x16 PNGs in a resource pack:

- Path: `assets/raritycore/textures/border/`
- Naming: default `rarity_1.png` ~ `rarity_7.png` (determined by `{level}` in `defaultTexture`); levels above 7 follow the path specified by `border.fallback` (or reuse level 7).
