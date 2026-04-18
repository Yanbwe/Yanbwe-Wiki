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

## Configuration File Format

```json
{
  "checkVanillaRarity": true,
  "checkApotheosisRarity": true,
  "enableGetRarityWarning": true
}
```

## Reloading Server Configuration

```
/reload
```

This command reloads all server configurations, including rarity data.

## Viewing Configuration Version

```
/raritycore config version
```

This command displays current configuration version information.

## Force Configuration Upgrade

```
/raritycore config upgrade
```

This command forces all configuration files to upgrade to the latest version.

## Notes

1. Server configuration only affects server-side behavior; clients do not need to synchronize these settings
2. It is recommended to use the `/reload` command after modifying configuration to apply changes
3. If the configuration file is corrupted, deleting it and restarting the server will automatically generate a default configuration