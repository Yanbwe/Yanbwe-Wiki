# KubeJS Integration

**Ver.14.1 update**: The global binding directly exposes the static methods and constants of the Java class `RarityCoreAPI` (no JS wrapper layer), so method names match the Java API exactly. Public API names have been unified to the 1.20.1 naming (`getRarityColor` / `getRarityTexture` / `isLevelTooltipEnabled`, etc.); the old names (`getColor` / `getTexture`, etc.) still work but are marked deprecated.

RarityCore provides KubeJS integration that lets you control rarities from JavaScript.

## Prerequisites

- KubeJS mod installed
- KubeJS is an optional dependency; RarityCore works without it

## Global Binding

In KubeJS scripts, both `raritycore` (recommended) and `RarityCore` global variables are available. They expose all static methods and constants of the Java class `org.yanbwe.raritycore.api.RarityCoreAPI`.

**Parameter notes**:
- For `ItemStack` parameters, use `Item.of("minecraft:diamond")`
- For `Item` parameters, use `Item.of("minecraft:diamond").item`

```js
// Register rarity (Item parameter)
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5)

// Register rarity (optional sync)
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5, true)

// Unregister rarity
RarityCore.unregisterRarity(Item.of("minecraft:stick").item)

// Get rarity (ItemStack parameter)
let rarity = RarityCore.getRarity(Item.of("minecraft:diamond"))

// Get normalized rarity
let r = RarityCore.getNormalizedRarity(Item.of("minecraft:netherite_ingot"))

// Check if configured (Item parameter)
let has = RarityCore.hasConfiguredRarity(Item.of("minecraft:stone").item)

// Get localized tooltip
let tip = RarityCore.getLocalizedTooltip(Item.of("minecraft:diamond"))
```

## Colors & Textures

```js
// Per-level RGB color (0xRRGGBB, with inheritance resolution)
let color = RarityCore.getRarityColor(5)  // returns 0xFFCC00

// Built-in color table RGB
let builtin = RarityCore.getRarityRgbColor(3)

// Per-level texture path
let tex = RarityCore.getRarityTexture(5)
// returns "raritycore:textures/border/rarity_5.png"

// Parse "#RRGGBB" string
let rgb = RarityCore.parseColor("#FFAA00")

// Format RGB int to "#RRGGBB"
let hex = RarityCore.formatColor(0xFFAA00)
```

## Validation

```js
RarityCore.isValidRarity(5)   // true
RarityCore.normalizeRarity(0)  // 1 (values below 1 are normalized to 1)
RarityCore.normalizeRarity(10) // 10 (lower-bound only, no cap)
RarityCore.validateRarity(5)   // same as normalizeRarity
```

## Config Switches

```js
// Global master switches
RarityCore.isBorderEnabled()         // whether item borders are rendered
RarityCore.isTooltipEnabled()        // whether tooltips are inserted
RarityCore.isTooltipColorEnabled()   // whether tooltips are colored
RarityCore.isNameColorEnabled()      // whether item names are colored (checks level 1)

// Per-level switches
RarityCore.isLevelRendererEnabled(5)  // whether the level renders borders
RarityCore.isLevelTooltipEnabled(5)   // whether the level shows tooltips
RarityCore.isLevelNameColorEnabled(5) // whether the level colors names
```

## V14 Visual Style Interface

### Queries

```js
// No-rarity fallback
RarityCore.isNoRaritySkip()          // skip rendering for unconfigured items
RarityCore.getNoRarityDefaultRarity() // fallback rarity for unconfigured items

// Per-level queries
RarityCore.getTooltipContent(5)       // tooltip content for this level
RarityCore.getLevelTranslationKey(5) // level segment translation key
RarityCore.getLevelFallbackKey(5)    // level segment fallback key
RarityCore.isBorderUseTexture(5)      // whether this level uses texture border
RarityCore.getBorderStyle(5)          // border style for this level (1=solid, 0=hollow)
RarityCore.getBorderFallback()        // border fallback texture
```

### Writes (persisted immediately to RarityStyle.json)

```js
// Master switches
RarityCore.setBorderEnabled(true)
RarityCore.setTooltipEnabled(true)
RarityCore.setTooltipColorEnabled(true)

// No-rarity fallback
RarityCore.setNoRaritySkip(false)
RarityCore.setNoRarityDefaultRarity(1)

// Per-level border / tooltip / star
RarityCore.setBorderUseTexture(5, true)
RarityCore.setBorderStyle(5, 1)
RarityCore.setTooltipContent(5, "[@{level}] @{star}")
RarityCore.setStarMode(5, "repeat")
RarityCore.setStarRepeatChar(5, "★")

// Batch writes (no per-call save; endStyleBatch saves once)
RarityCore.beginStyleBatch()
RarityCore.setStarMode(5, "custom")
RarityCore.setStarRepeatChar(5, "♥")
RarityCore.endStyleBatch()
```

## Config & Query

```js
// Trigger a full config reload
RarityCore.reloadConfigs()

// All items resolved to the given level (full registry traversal)
let items = RarityCore.getItemsByRarity(5)

// All item IDs resolved to the given level
let ids = RarityCore.getItemIdsByRarity(5)

// Distinct rarity levels currently present
let rarities = RarityCore.getConfiguredRarities()

// Count of items resolved to the given level
let count = RarityCore.getRarityCount(5)

// Snapshot of all resolved rarity levels
let all = RarityCore.getAllRarityEntries()

// Version & availability
RarityCore.API_VERSION        // API version constant (1400)
let ver = RarityCore.getModVersion()     // mod version string
let cfgVer = RarityCore.getConfigVersion() // config version (increments on every reload)
let ok = RarityCore.isAvailable()        // whether the mod is available
```

> `registerRarities` / `getItemsByRarities` require `java.util.Map` / `java.util.Set` parameters, which are awkward to construct in JS. Use per-entry `registerRarity` and `getItemsByRarity` instead.

## Constants

The following constants are directly accessible:

```js
RarityCore.MIN_RARITY  // 1
RarityCore.MAX_RARITY  // 7 (built-in preset tier count, not a rarity cap)
RarityCore.API_VERSION // 1400 (feature detection)
```

Rarity levels are plain integers; the lowest tier is `1` and the number of built-in preset tiers is `7` (not a rarity cap).

## Events

RarityCore exposes the following KubeJS events:

### RarityCoreEvents.rarityChanged

Fired when item rarity is registered/updated/removed.

```js
RarityCoreEvents.rarityChanged(event => {
    console.log(`Changed: ${event.itemId} → ${event.newRarity}`)
    console.log(`Type: ${event.changeType}`) // "register"/"update"/"remove"
})
```

### RarityCoreEvents.rarityQuery

Fired during rarity lookup; the return value can be modified.

```js
RarityCoreEvents.rarityQuery(event => {
    let source = event.source  // "component"/"itemdata"/"apotheosis"/"ironspells"/"itemmap"/"tag"/"autorarity"/"vanilla"/"default"
    if (event.itemId === "minecraft:diamond") {
        event.rarity = 6  // force mythic (the bridge writes it back automatically)
    }
})
```

### RarityCoreEvents.rarityTooltip (client only)

Fired during tooltip construction; custom text can be appended.

```js
RarityCoreEvents.rarityTooltip(event => {
    event.addText("§6Custom tooltip text")
    event.addText(`Current rarity: ${event.rarity}`)
})
```

## Full Example

```js
// startup_scripts/rarity_setup.js

// Register rarities
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5)
RarityCore.registerRarity(Item.of("minecraft:netherite_ingot").item, 5)
RarityCore.registerRarity(Item.of("minecraft:elytra").item, 6)
RarityCore.registerRarity(Item.of("minecraft:nether_star").item, 7)

// Listen to rarity queries
RarityCoreEvents.rarityQuery(event => {
    // Boost enchanted golden apples by one level
    if (event.itemId === "minecraft:enchanted_golden_apple") {
        event.rarity = Math.min(event.rarity + 1, 7)
    }
})
```
