# Comprehensive Guide

## What is SearchCarefully?

SearchCarefully is a Minecraft mod designed to solve an issue in multiplayer environments. When playing on servers, loot from chests is usually generated server-side to prevent item duplication. However, this allows players to quickly scan through all available loot and pick the best items.

SearchCarefully adds a **search time** mechanism to chest loot. Players must wait for the search to complete before they can extract items, making it impossible to quickly scan through all the loot.

## How It Works

When a player opens a loot chest:
1. A search timer begins
2. Items are gradually revealed during the search
3. The player must wait for the search to complete
4. Once complete, the player can take the items

The search time can be configured per chest type, per mod, or globally.

## Key Features

- **Per-mod configuration**: Different mods can have different search times
- **Per-chest-type configuration**: Different chest types can have different search times
- **Global configuration**: Set a default search time for all chests
- **Resource pack support**: Custom chest textures to indicate search progress
- **API support**: Other mods can integrate with SearchCarefully

## Getting Started

1. Install the mod on both client and server
2. Configure the search times in the config file
3. Optionally, create a resource pack for custom textures
4. Enjoy fair loot distribution in multiplayer!

## Configuration

The mod can be configured via:
- `config/searchcarefully-common.toml` - Common configuration
- `config/searchcarefully-client.toml` - Client-side configuration

See the [Config Guide](ConfigGuide) for detailed configuration options.