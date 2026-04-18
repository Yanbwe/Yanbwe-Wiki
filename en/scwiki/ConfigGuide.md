# Configuration Guide

## Configuration Files

SearchCarefully has two main configuration files:

### Common Configuration (Server-side)

Located at: `config/searchcarefully-common.toml`

This configuration affects the server and syncs to all clients.

```toml
# Global search time multiplier
searchTimeMultiplier = 1.0

# Minimum search time (in ticks)
minSearchTime = 20

# Maximum search time (in ticks)
maxSearchTime = 200

# Enable/disable the mod globally
enabled = true

# Default search time per mod
[modDefaults]
minecraft = 60
some_mod = 100
```

### Client Configuration

Located at: `config/searchcarefully-client.toml`

This configuration is client-side only.

```toml
# Enable visual effects
enableVisualEffects = true

# Show search progress on chest
showProgress = true

# Custom chest texture
useCustomTexture = true
```

## Configuration Options

### searchTimeMultiplier

- **Type**: Float
- **Default**: 1.0
- **Description**: Multiplier for all search times. Higher values = longer search times.

### minSearchTime

- **Type**: Integer (ticks)
- **Default**: 20 (1 second)
- **Description**: Minimum search time for any chest.

### maxSearchTime

- **Type**: Integer (ticks)
- **Default**: 200 (10 seconds)
- **Description**: Maximum search time for any chest.

### modDefaults

- **Type**: Table
- **Description**: Set default search time for specific mods.

## Commands

The mod provides several commands (requires OP on servers):

- `/searchcarefully reload` - Reload configuration
- `/searchcarefully settime <modid> <ticks>` - Set search time for a mod
- `/searchcarefully info` - Show current configuration info