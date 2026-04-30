# Search Progress Sound Guide

Since version `1201.9.0`, SearchCarefully provides a **search progress sound** feature, giving you immersive audio feedback while looting.

## Quick Start

1. Open the config file `.minecraft/config/searchcarefully-common.toml`
2. Find the `enableSearchProgressSound` option
3. Change its value to `true`
4. Save the file

After that, when you open a container and search items, you will hear a continuous search progress sound.

## How Looping Sound Works

The search progress sound uses **looping playback** mode.

| Feature | Description |
|---------|-------------|
| Playback | Sound loops continuously, never retriggers repeatedly |
| Start condition | Automatically starts when a player opens a container with searchable items |
| Stop condition | Stops immediately when all items are searched or the container is closed |
| Multiplayer | Each player has their own independent sound instance |
| Position tracking | Sound follows the player's position with distance attenuation |

## Configuration Details

### Basic Configuration

```toml
[SearchProgressSound]
    # Enable search progress sound, disabled by default
    enableSearchProgressSound = true
```

### Custom Sounds

You can customize the search progress sound by replacing the `search_progress.ogg` file:

1. Locate the sound file in the mod JAR or resource pack:
   `assets/searchcarefully/sounds/search_progress.ogg`
2. Prepare your own `.ogg` audio file
3. Place it in the corresponding resource pack path

**Note**: Looping sounds require seamless audio files — the end of the file should transition smoothly back to the beginning to avoid audible clicking/popping.

## FAQ

### Q: I enabled the sound but hear nothing?

Check the following:
- Make sure `enableSearchProgressSound` is set to `true`
- Check that your game's master volume and "Blocks" (SoundSource.BLOCKS) volume are not muted
- Confirm that items in the container actually have search time (they should display a search animation overlay)
- Check if another mod is overriding the sound file

### Q: The sound is too loud/quiet?

The sound volume is controlled by the in-game "Blocks" volume slider. For finer control:
- Replace the sound file with one that has a more suitable volume level in a resource pack
- Adjust the loudness of the original `.ogg` file using audio editing software

### Q: I only want to hear the completion sound, not the progress sound?

You can disable `enableSearchProgressSound` (set to `false`). This will stop the looping progress sound, but **search completion sounds** (based on item rarity) will still play normally. The two sound systems are independent of each other.
