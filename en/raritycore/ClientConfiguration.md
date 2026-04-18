# Client Configuration Guide

Client configuration file is located at:

`config/raritycore/client.json`

## Configuration Options

### 1. enableItemBorderRendering

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable item border feature

### 2. itemBorderStyle

- **Type**: Integer
- **Default**: 0
- **Description**: Controls the item border style (only effective when texture border is disabled)
  - `0`: Hollow border
  - `1`: Solid fill

### 3. useTextureBorder

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to use texture borders. When enabled, custom textures will be used for border rendering

### 4. enableItemNameColor

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable item name coloring. Changes item name color based on item rarity

### 5. enableTooltipInsert

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable tooltip insertion. Displays rarity information in item tooltips

### 6. skipUnconfiguredItems

- **Type**: Boolean
- **Default**: false
- **Description**: Whether to skip rendering of items without configured rarity. When enabled, only items with configured rarity will be displayed

### 7. enableCacheSystem

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the cache system. Disable this option if conflicts with other optimization mods occur

### 8. starDisplay (Star Display Configuration)

- **Type**: Object
- **Description**: Controls how rarity stars are displayed

  Sub-options:
  - `enabled`: Whether to enable star display (Boolean, default: true)
  - `mode`: Display mode, either "repeat" or "custom"
  - `repeat.character`: Character used in repeat mode (default: "★")
  - `custom.strings`: Custom rarity string mapping for custom mode (levels 1-7)
  - `custom.specialRarityTexts`: Special rarity text mapping (above level 7, user-defined)

#### starDisplay Configuration Example

```json
{
  "starDisplay": {
    "enabled": true,
    "mode": "repeat",
    "repeat": {
      "character": "★"
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
        "9": "Genesis",
        "10": "Endless"
      }
    }
  }
}
```

## How to Apply Configuration

### Method 1: Restart Game

Restart the game after modifying the configuration file.

### Method 2: Use Command

```
/raritycore-client reload
```

## Texture Border Configuration

If texture border is enabled (useTextureBorder=true), corresponding texture files need to be prepared:

- Texture file path: `assets/raritycore/textures/border/`
- Texture file naming: `rarity_1.png` to `rarity_7.png`, corresponding to 7 rarity levels
- Texture size: 16x16 pixels

## Cache System Related Commands

Cache system status can be viewed using the following commands:

```
/raritycore-client cache stats     # Display cache statistics
/raritycore-client cache clear     # Clear cache
/raritycore-client cache health    # Display cache health status
/raritycore-client cache smart-optimize  # Trigger smart cache optimization
```

## Notes

If the configuration file is corrupted or outdated, you can delete it and reload the configuration to regenerate a default one