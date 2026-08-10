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
| `/raritycore reload` | Reloads all configurations and rarity data |

### Data Export

| Command | Description |
|---------|-------------|
| `/raritycore export all` | Exports all rarity data to a single file |
| `/raritycore export all-mod` | Exports rarity data separately by mod |
| `/raritycore export mod <modid>` | Exports rarity data for a specified mod |
| `/raritycore export rarity <level>` | Exports all items of a specific rarity level |

**Export File Description:**
- Filename: `export_<type>_<MC version>_<timestamp>.json`; for `export rarity`: `export_rarity_<level>_<timestamp>.json`
- Save location: mod config directory

### Details

| Command | Description |
|---------|-------------|
| `/raritycore details` | Displays current rarity configuration statistics |
| `/raritycore details nbt` | Displays NBT matching configuration details |

### Edit Mode

> **Ver.13 Refactored**: Edit mode is now mode-driven + parameter-driven. See [Rarity Configuration Guide](/en/raritycore/how-to-config-rarity).

**Edit Mode Control:**

| Command | Description |
|---------|-------------|
| `/raritycore edit toggle <true\|false>` | Enable/disable edit mode |
| `/raritycore edit mode <normal\|fullmatch>` | Switch edit mode |

**Parameter Settings (all parameters can be changed anytime; effectiveness depends on current mode):**

| Command | Description | Mode |
|---------|-------------|------|
| `/raritycore edit parameter rarity <value>` | Set rarity level (≥0) | All |
| `/raritycore edit parameter autoReload <true\|false>` | Auto-reload after config generation | FullMatch |
| `/raritycore edit parameter stringContains <true\|false>` | Use contains matching for string NBT | FullMatch |
| `/raritycore edit parameter ignore "<aa\|bb\|cc>"` | Exclude NBT tags, separated by `\|` | FullMatch |

**GUI Operations:**
- When edit mode is active, a floating panel appears in the top-left corner; drag the empty area of the panel to reposition it (position is session-only and resets to the top-left on restart)
- Click the mode name to toggle Normal/FullMatch
- `[-]` `[+]` buttons adjust rarity level
- `Ctrl+1`~`Ctrl+7` select level, `Ctrl+0` clear rarity
- `Ctrl+H` collapse/expand panel

## Client Commands

`/raritycore-client` commands do not require OP permission and are available to all players.

| Command | Description |
|---------|-------------|
| `/raritycore-client reload` | Reloads client config (`client.json` and `RarityClientConfig.json`) |
| `/raritycore-client cache stats` | Shows cache statistics |
| `/raritycore-client cache clear` | Clears local cache |

## Permission Requirements

| Permission Level | Description |
|-----------------|-------------|
| 0 | Regular player (can only use `/raritycore-client` commands) |
| 2 | OP player (can use all `/raritycore` commands) |
| 4 | Server administrator |
