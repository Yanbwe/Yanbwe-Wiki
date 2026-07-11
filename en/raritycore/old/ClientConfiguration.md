# Client Configuration Guide (Legacy · Pre-V14)

> This page documents the pre-V14 configuration (`client.json`). Since V14, these settings are consolidated into a single `RarityStyle.json`. See the [RarityStyle Configuration Guide](/en/raritycore/RarityStyleConfiguration). This page is retained for historical reference only.

Client configuration file is located at:

`config/raritycore/client.json`

## Configuration Options

### enableItemBorderRendering

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable item border feature

### itemBorderStyle

- **Type**: Integer
- **Default**: 1
- **Description**: Controls the item border style (only effective when texture border is disabled)
  - `0`: Hollow border
  - `1`: Solid fill

### useTextureBorder

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to use texture borders. When enabled, custom textures will be used for border rendering

### enableItemNameColor

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable item name coloring. Changes item name color based on item rarity

### enableTooltipInsert

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable tooltip insertion. Displays rarity information in item tooltips
- **Note**: If ColorTooltips mod is detected to be loaded, this feature will be forcibly disabled

### enableTooltipColor

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable tooltip rarity text coloring

### skipUnconfiguredItems

- **Type**: Boolean
- **Default**: false
- **Description**: Whether to skip rendering of items without configured rarity. When enabled, only items with configured rarity will be displayed

### enableCacheSystem

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the cache system. Disable this option if conflicts with other optimization mods occur

### enableSophisticatedCoreAdapter

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the Sophisticated Core adapter for compatibility with the Sophisticated Core mod
- **Note**: This configuration option is only available in versions after 1.21.11.

### starDisplay

- **Type**: Object
- **Description**: Controls how rarity stars are displayed

**starDisplay Sub-options:**

| Option | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | true | Whether to enable star display |
| `mode` | String | "repeat" | Display mode: "repeat" or "custom" |
| `repeat.character` | String | "⭐" | Character used in repeat mode |
| `custom.strings` | Object | - | Custom rarity string mapping for levels 1-7 in custom mode |
| `custom.specialRarityTexts` | Object | - | Special rarity text mapping for levels above 7. Values starting with `$` are treated as translation keys (define them in your resource pack's lang file), otherwise treated as plain text |

#### starDisplay Configuration Example

```json
{
  "starDisplay": {
    "enabled": true,
    "mode": "repeat",
    "repeat": {
      "character": "⭐"
    },
    "custom": {
      "strings": {
        "1": "★",
        "2": "★★",
        "3": "★★★",
        "4": "★★★★",
        "5": "★★★★★",
        "6": "★★★★★★",
        "7": "★★★★★★★",
        "8": "XXXXXXXXXX"
      },
      "specialRarityTexts": {
        "8": "Mythic",
        "9": "$rarity.core.special.9",
        "10": "Endless"
      }
    }
  }
}
```

## How to Apply Configuration

```
/raritycore-client reload
```

## Texture Border Configuration

If texture border is enabled (useTextureBorder=true), corresponding texture files need to be prepared:

- Texture file path: `assets/raritycore/textures/border/`
- Texture file naming: `rarity_1.png` to `rarity_7.png`, corresponding to 7 rarity levels
- Texture size: 16x16 pixels

## Cache System Related Commands

```
/raritycore-client cache stats   # Display cache statistics
/raritycore-client cache clear   # Clear local cache
```

## Notes

1. If the configuration file is corrupted or outdated, you can delete the configuration file and then use the `/raritycore-client reload` command to regenerate the default configuration