# SearchCarefully Configuration Guide

## Configuration File Location

The configuration file is located at `.minecraft/config/searchcarefully-common.toml`

## Configuration Options

### Search System Configuration

#### `enableSearchSystem` (Boolean, default: true)
- Function: Enable or disable the entire search system
- true: Enables the search function
- false: Disables the search function

#### `maxSearchTimeTicks` (Integer, range: 1-1000, default: 200)
- Function: Sets the maximum search time (in game ticks)
- Note: 20 game ticks = 1 second

#### `searchSpeedMultiplier` (Float, range: 0.1-10.0, default: 1.0)
- Function: Search speed multiplier
- 1.0: Normal speed
- Greater than 1.0: Increases search speed
- Less than 1.0: Reduces search speed

### Rarity Search Time Configuration

#### `raritySearchTimes` (String list, supports any rarity level)
- Function: Configure search time and completion sound for each rarity level, not limited to 1–7
- Format: Each entry is `"rarity:baseTime:randomTime[:soundId]"` (colon-separated)
  - **rarity**: Integer ≥ 1 (e.g. 1, 5, 8, 12, any number)
  - **baseTime**: Base search time in game ticks, integer ≥ 1
  - **randomTime**: Random fluctuation range in game ticks, integer ≥ 0. Actual time = baseTime ± random(0, randomTime)
  - **soundId**: (Optional) Sound to play on completion, format `namespace:path`. Can use vanilla sounds, mod sounds, or any registered sound. If omitted, auto-maps to built-in completion sounds (1–7)
- Lookup rules:
  - Exact match: Rarity has a matching entry → use that entry
  - Closest lower: Rarity not configured → use the largest configured rarity ≤ the requested one (e.g. if only 1, 4, 7 are configured, rarity 5 uses rarity 4's settings)
  - No match: Requested rarity is smaller than all configured entries → returns 0 (no search)
- Default values:
  ```toml
  raritySearchTimes = [
      "1:10:10:searchcarefully:search_completion_rarity_1",
      "2:30:10:searchcarefully:search_completion_rarity_2",
      "3:55:10:searchcarefully:search_completion_rarity_3",
      "4:85:10:searchcarefully:search_completion_rarity_4",
      "5:110:10:searchcarefully:search_completion_rarity_5",
      "6:130:10:searchcarefully:search_completion_rarity_6",
      "7:140:10:searchcarefully:search_completion_rarity_7"
  ]
  ```
  Approximate times: Rarity 1 ≈ 0.5s, Rarity 2 ≈ 1.5s, Rarity 3 ≈ 2.8s, Rarity 4 ≈ 4.3s, Rarity 5 ≈ 5.5s, Rarity 6 ≈ 6.5s, Rarity 7 ≈ 7s (excluding random fluctuation)
- Custom example:
  ```toml
  raritySearchTimes = [
      "1:20:5:searchcarefully:search_completion_rarity_1",   # Faster rarity 1
      # ... other rarities kept at defaults ...
      "7:140:10:searchcarefully:search_completion_rarity_7",
      "8:200:20:minecraft:entity.player.levelup",             # Rarity 8 with vanilla level-up sound
      "10:400:50"                                              # Rarity 10, sound auto-clamped
  ]
  ```

### Custom Loot Table Paths Configuration

#### `customLootTablePaths`
- Function: Add additional loot table paths to apply search time mechanism
- Format: List of complete resource location identifiers
- Example:
  ```toml
  customLootTablePaths = [
      "modid:special_chest",
      "anothermod:treasure_box",
      "custommod:magic_container"
  ]
  ```
- Description:
  - These paths must be complete resource locations (namespace:path format)
  - Suitable for mod loot tables with non-standard paths

#### `chestPathSegments`
- Function: Define path segments for middle-path matching
- Format: List of path segment strings
- Default: `["chest", "chests"]`
- Example:
  ```toml
  chestPathSegments = ["chest", "chests", "treasure", "loot"]
  ```
- Description:
  - Used to match loot tables containing these segments anywhere in the path
  - Example matches: `structures/village/chest`, `modid/special/chests`, `dungeons/treasure_room`

### Hotbar Search Configuration

#### `enableHotbarSearch` (Boolean, default: false)
- Function: Enable or disable search for hotbar items
- true: Enables hotbar search, items in player inventory hotbar will be searched automatically
- false: Disables hotbar search, only container interfaces can search
- Note: This feature is independent of container search

### Single Slot Search Configuration

#### `enableSingleSlotSearch` (Boolean, default: false)
- Function: Enable single slot search mode, items are searched one by one in order
- true: Enables single slot search mode, items are searched starting from the first slot
- false: Disables single slot search mode

#### `singleSlotSearchTimeMultiplier` (Boolean, default: true)
- Function: Apply 3x time multiplier when single slot search mode is enabled
- true: Apply 3x time multiplier
- false: No additional time multiplier

### Mouse Target Search Configuration

#### `enableMouseTargetSearch` (Boolean, default: true)
- Function: Enable mouse-targeted search mode
- true: Mouse cursor will target specific items for search, if mouse is not pointing at any item, automatic search continues
- false: Disables mouse target search, only uses automatic search

#### `mouseTargetSwitchDelay` (Float, range: 0.0-20.0, default: 3.0)
- Function: Delay before switching to mouse target (game ticks)
- Higher values prevent rapid switching when moving mouse quickly
- Default corresponds to 0.15 seconds

### Search Progress Sound Configuration

#### `enableSearchProgressSound` (Boolean, default: true)
- Function: Enable looping sound during search progress
- true: Enables search progress looping sound, plays continuously while items are being searched, stops automatically when all items are found
- false: Disables search progress sound