# Resource Pack Guide

## Overview

SearchCarefully supports resource packs to provide custom textures for chests during search. This allows server administrators to create unique visual feedback for players.

## Creating a Resource Pack

### Directory Structure

```
assets/
└── searchcarefully/
    └── textures/
        └── chest/
            ├── searching.png      # Animated search texture
            └── search_complete.png  # Search complete texture
```

### Required Textures

#### searching.png

This texture is displayed while the chest is being searched. It should be a standard 16x16 chest texture, but typically shows some visual indicator that search is in progress.

#### search_complete.png

This texture is displayed when the search is complete and the player can take items.

### Creating Animated Textures

You can create animated textures using the `.mcmeta` file format:

```json
{
  "animation": {
    "interpolate": true,
    "frametime": 4,
    "frames": [
      0, 1, 2, 3, 4, 5, 6, 7
    ]
  }
}
```

## Packaging the Resource Pack

1. Create a `pack.mcmeta` file in the root of your resource pack:

```json
{
  "pack": {
    "pack_format": 15,
    "description": "SearchCarefully Custom Textures"
  }
}
```

2. Package all files into a `.zip` file

3. Place the zip file in the `resourcepacks` folder

## Enabling Custom Textures

On the client, enable custom textures in the config:

```toml
useCustomTexture = true
```

## Tips

- The search progress can be indicated by the texture animation frame
- You can use different textures for different chest types
- The texture should be consistent with your server's aesthetic