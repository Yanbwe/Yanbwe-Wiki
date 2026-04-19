# RarityCore Command Reference

RarityCore provides two sets of commands: `/raritycore` (server commands, requires OP permission) and `/raritycore-client` (client commands, available to regular players).

## Server Commands

All `/raritycore` subcommands require OP permission (permission level 2).

### Rarity Management

| Command | Description |
|---------|-------------|
| `/raritycore sethand <rarity>` | Sets the rarity of the item in main hand |
| `/raritycore removehand` | Removes the rarity of the item in main hand |
| `/raritycore setrarity <item> <rarity>` | Sets the rarity of a specified item |
| `/raritycore removerarity <item>` | Removes the rarity of a specified item |
| `/raritycore recalculate-auto` | Recalculates all auto rarity configurations |

**Examples:**
```
/raritycore sethand 3
/raritycore setrarity minecraft:diamond_sword 5
/raritycore removerarity minecraft:iron_sword
```

### Configuration Management

| Command | Description |
|---------|-------------|
| `/raritycore reload` | Reloads all rarity configurations |
| `/raritycore config version` | Displays configuration file version information |
| `/raritycore config upgrade` | Forces verification and upgrade of configuration files |

### Data Export

| Command | Description |
|---------|-------------|
| `/raritycore export all` | Exports all rarity data to a single file |
| `/raritycore export all-mod` | Exports rarity data separately by mod |
| `/raritycore export mod <modid>` | Exports rarity data for a specified mod |

**Export File Description:**
- Filename format: `export_<type>_<Minecraft version>_<timestamp>.json`
- Save location: Mod configuration directory

### Details

| Command | Description |
|---------|-------------|
| `/raritycore details` | Displays current rarity configuration statistics |
| `/raritycore details nbt` | Displays NBT matching configuration details |

### Edit Mode

Edit mode allows real-time preview of rarity changes in-game.

| Command | Description |
|---------|-------------|
| `/raritycore edit enable` | Enables edit mode |
| `/raritycore edit disable` | Disables edit mode |
| `/raritycore edit toggle` | Toggles edit mode |
| `/raritycore edit status` | Displays current edit mode status |

### Performance Monitoring

| Command | Description |
|---------|-------------|
| `/raritycore perf stats` | Displays performance statistics |
| `/raritycore perf optimize` | Manually triggers performance optimization |

## Client Commands

`/raritycore-client` commands do not require OP permission and are available to all players.

| Command | Description |
|---------|-------------|
| `/raritycore-client reload` | Reloads client configuration |
| `/raritycore-client texture toggle` | Toggles texture border display |
| `/raritycore-client cache stats` | Displays cache statistics |
| `/raritycore-client cache clear` | Clears local cache |

## Permission Requirements

| Permission Level | Description |
|-----------------|-------------|
| 0 | Regular player (can only use `/raritycore-client` commands) |
| 2 | OP player (can use all `/raritycore` commands) |
| 4 | Server administrator |