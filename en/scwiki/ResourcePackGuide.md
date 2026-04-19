# SearchCarefully Resource Pack Creation Guide

## Overview

The SearchCarefully mod supports customizing search masks, rotation animations, and sound effects through resource packs. This document will guide you on how to create and configure these resources.

## Resource Pack Structure

The resource pack should adhere to the standard Minecraft resource pack structure:

```
resource_pack/
├── assets/
│   └── searchcarefully/
│       ├── textures/
│       │   └── gui/
│       │       ├── search_mask.png
│       │       └── rotation_animation.png
│       └── sounds.json
└── pack.mcmeta
```

## Custom Textures

### Search Mask Texture

- **File Path**: `assets/searchcarefully/textures/gui/search_mask.png`
- **Recommended Size**: 16x16 pixels
- **Purpose**: A mask that covers the item being searched
- **Recommendation**: Use opaque textures to fully obscure items

### Rotation Animation Texture

- **File Path**: `assets/searchcarefully/textures/gui/rotation_animation.png`
- **Recommended Size**: 16x16 pixels
- **Purpose**: Animated texture that rotates above the mask
- **Recommendation**: Use textures with transparent backgrounds to reveal content beneath

## Custom Sound Effects

### Sound Effect Files

- **File Path**: `assets/searchcarefully/sounds/`
- **File Format**: OGG format
- **File List**:
  - `search_progress.ogg` - Progress sound during search
  - `search_completion_rarity_1.ogg` to `search_completion_rarity_7.ogg` - Completion sounds by rarity
- **Audio Format**: **Must be mono (single-channel) format**, stereo format cannot apply 3D spatial positioning and distance attenuation effects

### Sound Effect Configuration

Configure sound effects in `assets/searchcarefully/sounds.json`:

```json
{
  "search_progress": {
    "sounds": [
      {
        "name": "searchcarefully:search_progress",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_progress"
  },
  "search_completion_rarity_1": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_1",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_1"
  },
  "search_completion_rarity_2": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_2",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_2"
  },
  "search_completion_rarity_3": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_3",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_3"
  },
  "search_completion_rarity_4": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_4",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_4"
  },
  "search_completion_rarity_5": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_5",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_5"
  },
  "search_completion_rarity_6": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_6",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_6"
  },
  "search_completion_rarity_7": {
    "sounds": [
      {
        "name": "searchcarefully:search_completion_rarity_7",
        "stream": false,
        "attenuation_distance": 16
      }
    ],
    "subtitle": "sound.searchcarefully.search_completion_rarity_7"
  }
}
```

## Sound Effect Attribute Description

- **name**: The resource location of the sound effect, in the format `namespace:sound_name`
- **stream**: Whether to play in streaming mode, set to false for short sound effects
- **attenuation_distance**: The sound attenuation distance for 3D spatial positioning effect, the value represents the effective range (in blocks)
- **subtitle**: The localization key for subtitle text, used to display sound effect descriptions in game subtitles
- **Important Note**: Audio files must be in mono (single-channel) format to enable 3D spatial positioning and distance attenuation effects