# Client Rarity Configuration

**New in Ver.13**

`RarityClientConfig.json` allows you to customize per-rarity-level visual appearance — color, texture, and feature toggles.

## File Location

```
config/raritycore/RarityClientConfig.json
```

## Format

```json
{
  "rarities": {
    "1": {
      "color": "#CCCCCC",
      "texture": "raritycore:textures/border/rarity_1.png",
      "tooltips": true,
      "renderer": true,
      "nameColor": true
    },
    "2": {
      "color": "#55FF55",
      "texture": "raritycore:textures/border/rarity_2.png",
      "tooltips": true,
      "renderer": true,
      "nameColor": true
    }
  }
}
```

(Levels 3-7 follow the same pattern.)

## Fields

| Field | Type | Description |
|-------|------|-------------|
| `color` | string | RGB color, format `#RRGGBB` |
| `texture` | string | Texture border resource path |
| `tooltips` | bool | Whether to show tooltip for this level |
| `renderer` | bool | Whether to render slot border for this level |
| `nameColor` | bool | Whether to recolor item name for this level |

## Default Colors

| Level | Color | Name |
|-------|-------|------|
| 1 | `#CCCCCC` | Common (light gray) |
| 2 | `#55FF55` | Uncommon (bright green) |
| 3 | `#55FFFF` | Rare (bright cyan) |
| 4 | `#FF55FF` | Epic (bright purple) |
| 5 | `#FFCC00` | Legendary (bright gold) |
| 6 | `#FF6666` | Mythical (bright red) |
| 7 | `#FF3333` | Unique (bright deep red) |

## Rules

- JSON key is the rarity level ("1"-"7"), no internal `level` field
- Colors are **RGB** format only
- Level >7 falls back to level 7 values
- **`client.json` is the master switch**: if a switch is off in `client.json`, the per-level toggle is ignored

## How to Apply

```
/raritycore-client reload
```
