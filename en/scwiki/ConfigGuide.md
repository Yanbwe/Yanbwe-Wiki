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

### Rarity Base Search Time Configuration

#### `rarity1BaseTime` (Integer, range: 1-1000, default: 10)
- Function: Base search time for rarity 1 items (game ticks)
- Corresponds to approximately 0.5 seconds

#### `rarity2BaseTime` (Integer, range: 1-1000, default: 30)
- Function: Base search time for rarity 2 items (game ticks)
- Corresponds to approximately 1.5 seconds

#### `rarity3BaseTime` (Integer, range: 1-1000, default: 55)
- Function: Base search time for rarity 3 items (game ticks)
- Corresponds to approximately 2.75 seconds

#### `rarity4BaseTime` (Integer, range: 1-1000, default: 85)
- Function: Base search time for rarity 4 items (game ticks)
- Corresponds to approximately 4.25 seconds

#### `rarity5BaseTime` (Integer, range: 1-1000, default: 110)
- Function: Base search time for rarity 5 items (game ticks)
- Corresponds to approximately 5.5 seconds

#### `rarity6BaseTime` (Integer, range: 1-1000, default: 130)
- Function: Base search time for rarity 6 items (game ticks)
- Corresponds to approximately 6.5 seconds

#### `rarity7BaseTime` (Integer, range: 1-1000, default: 140)
- Function: Base search time for rarity 7 items (game ticks)
- Corresponds to approximately 7 seconds

### Rarity Random Time Configuration

#### `rarity1RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 1 items (game ticks)
- 0: No random addition
- Greater than 0: Search time increases by random amount up to this value

#### `rarity2RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 2 items (game ticks)

#### `rarity3RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 3 items (game ticks)

#### `rarity4RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 4 items (game ticks)

#### `rarity5RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 5 items (game ticks)

#### `rarity6RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 6 items (game ticks)

#### `rarity7RandomTime` (Integer, range: 0-1000, default: 10)
- Function: Random time addition for rarity 7 items (game ticks)

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
- Default: `["chest", "chests", "block"]`
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
- Function: Enable sound during search progress
- true: Enables search progress sound, plays at intervals during search
- false: Disables search progress sound

#### `searchProgressSoundInterval` (Float, range: 0.1-10.0, default: 0.5)
- Function: Interval between search progress sounds (seconds)
- Default: 0.5 seconds