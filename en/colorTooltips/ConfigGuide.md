# Config Guide

ColorTooltips uses JSON configuration files located at:

```
config/colortooltips/
├── common.json          ← Global settings + style selector
└── styles/
    ├── Vanilla.json      ← Default style
    ├── RarityCoreStyles.json
    ├── RGB.json
    └── VanillaRarity.json
```

**Hot reload**: After modifying configuration files, use the in-game chat command `/colortooltips reload` to apply changes instantly without restarting.

## common.json — Global Config

### smoothColor

- **Type**: Boolean
- **Default**: `true`
- **Description**: Whether color transitions smoothly (gradient) when switching items.

### tooltipLock

Tooltip locking feature. Hold `Shift + Mouse Scroll` to move the tooltip up/down.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable Shift+Scroll tooltip movement |
| `sensitivity` | Float | `10.0` | Scroll sensitivity, range 1.0~20.0 |

### onlyTextTooltips

Whether text-only tooltips (chat item links, achievement tooltips, etc.) also use ColorTooltips styling.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | When disabled, text-only tooltips use vanilla style |

### styleSelector — Style Selector

Determines which style file is used for different items. Divided into two selector blocks:

- **`common`**: Used when RarityCore is not installed
- **`rarityCore`**: Used when RarityCore is installed

#### Matching Rules

Styles are matched in the following priority order (first match wins):

1. **`onlyText`** — Style name for text-only tooltips
2. **`items`** — Exact item registry name match (e.g. `"minecraft:diamond_sword": "RGB"`)
3. **Rarity number** — RarityCore rarity number match (e.g. `"3": "VanillaRarity"`, rarityCore block only)
4. **Vanilla rarity name** — `"Common"`, `"Uncommon"`, `"Rare"`, `"Epic"`
5. **`"*"` wildcard** — Default when none of the above match
6. **Final fallback** — Always `"Vanilla"`

#### Example

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {
        "minecraft:diamond_sword": "RGB"
      }
    }
  }
}
```

This config means:
- Text-only tooltips → use `Vanilla` style
- Common (white) items → use `Vanilla`
- Uncommon/Rare/Epic items → use `VanillaRarity`
- With RarityCore → all use `RarityCoreStyles`, except diamond swords use `RGB` rainbow style

## styles/*.json — Style Files

Each style file controls all visual aspects of the tooltip. See the [Style Guide](/en/colorTooltips/StyleGuide) for details.

## Default Config

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {}
    }
  },
  "tooltipLock": {
    "enabled": true,
    "sensitivity": 10.0
  },
  "onlyTextTooltips": {
    "enabled": true
  },
  "smoothColor": true
}
```

## Notes

1. After modifying any JSON file, run `/colortooltips reload` in-game for hot-reload. No restart needed.
2. In the `items` field of the style selector, the item registry name format is `"namespace:item_id"` (e.g. `"minecraft:diamond"`).
3. You can add your own `.json` files to the `styles/` folder. The filename (without `.json`) becomes the style name, which you can then reference in `styleSelector`.
4. If a JSON file is corrupted, the mod will safely fall back to default values without crashing. Loading warnings are logged.
