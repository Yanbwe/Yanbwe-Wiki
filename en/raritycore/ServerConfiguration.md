# Server Configuration Guide

## Configuration File Location

Server configuration file is located at:
```
config/raritycore/server.json
```

## Configuration Options

### checkVanillaRarity

- **Type**: Boolean
- **Default**: `true`
- **Description**: Controls whether to check vanilla item rarity and map it to RarityCore's rarity system
- **Effect**: When enabled, items with vanilla Rare/Epic quality will automatically be assigned corresponding RarityCore rarity levels

### checkApotheosisRarity

- **Type**: Boolean
- **Default**: `true`
- **Description**: Controls whether to check Apotheosis mod item rarity and map it to RarityCore's rarity system
- **Effect**: When enabled, items with Apotheosis rarity will automatically be assigned corresponding RarityCore rarity levels

### enableGetRarityWarning

- **Type**: Boolean
- **Default**: `true`
- **Description**: Controls whether to enable getRarity() availability warnings
- **Effect**: When enabled, warning logs will be output when item calls to getRarity() method are detected

### enableNbtRarityControl

- **Type**: Boolean
- **Default**: `false`
- **Description**: Controls whether in-game NBT tag rarity control is enabled
- **Effect**: When enabled, items with `raritycore:data` NBT tag override their rarity display (highest priority)

> **Details**: See [In-Game NBT Tag Rarity Control](/en/raritycore/NbtRarityControl)

## Reloading Server Configuration
```
/raritycore reload
```

This command reloads all server configurations, including rarity data.

## Notes

1. Server configuration only affects server-side behavior; clients do not need to synchronize these settings
2. If the configuration file does not exist, reloading the configuration will automatically generate a default configuration file
3. If the configuration file format is incorrect, configuration items that cannot be parsed will be skipped and default values will be used. If you find that modifying the configuration does not take effect, please check whether the format of the file content is correct.