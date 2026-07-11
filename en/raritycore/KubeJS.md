# KubeJS Integration

**New in Ver.13**

RarityCore provides KubeJS integration for controlling rarity via JavaScript scripts.

## Prerequisites

- KubeJS mod installed
- KubeJS is an optional dependency — the mod works fine without it

## Global Binding

In KubeJS scripts, the global `RarityCore` variable is available:

```js
// Register rarity
RarityCore.register("minecraft:diamond_sword", 5)

// Query rarity
let rarity = RarityCore.getRarity("minecraft:diamond")

// Get normalized rarity
let r = RarityCore.getNormalizedRarity("minecraft:netherite_ingot")

// Check if configured
let has = RarityCore.hasRarity("minecraft:stone")

// Remove
RarityCore.unregister("minecraft:stick")
```

## Colors

```js
let color = RarityCore.getColor(5)        // 0xFFCC00
let defColor = RarityCore.getDefaultColor(3)
let rgb = RarityCore.parseColor("#FFAA00")
```

## Textures

```js
let tex = RarityCore.getTexture(5)
```

## Validation

```js
RarityCore.isValidRarity(5)   // true
RarityCore.normalizeRarity(10) // 7
```

## Config Switches

```js
RarityCore.isRendererEnabled(5)
RarityCore.isTooltipEnabled(5)
```

## V14 Visual Style Interface

### Queries

```js
// Master switches
RarityCore.isTooltipColorEnabled()  // whether tooltips are colored
RarityCore.isBorderEnabled()        // whether item borders are rendered
RarityCore.isTooltipInsertEnabled() // whether tooltips are inserted

// No-rarity fallback
RarityCore.isNoRaritySkip()          // skip rendering for unconfigured items
RarityCore.getNoRarityDefaultRarity() // fallback rarity for unconfigured items

// Per-level queries
RarityCore.getTooltipContent(5)       // tooltip content for this level
RarityCore.getLevelTranslationKey(5) // level segment translation key
RarityCore.getLevelFallbackKey(5)    // level segment fallback key
RarityCore.getSpecialRarityText(8)    // special text for rarity > MAX_RARITY
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

// Per-level border / tooltip / star / special text
RarityCore.setBorderUseTexture(5, true)
RarityCore.setBorderStyle(5, 1)
RarityCore.setTooltipContent(5, "[@{level}] @{star}")
RarityCore.setStarMode(5, "repeat")
RarityCore.setStarRepeatChar(5, "★")
RarityCore.setSpecialRarityText(8, "Above Mythic")
```

## Config & Query

```js
// Trigger a full config reload
RarityCore.reloadConfigs()

// All item IDs resolved to the given level
let ids = RarityCore.getItemsByRarity(5)
// Distinct rarity levels currently present
let rarities = RarityCore.getConfiguredRarities()
// All item IDs resolved to any of the given levels
let ids2 = RarityCore.getItemsByRarities([5, 6])
// Count of items resolved to the given level
let count = RarityCore.getRarityCount(5)
// Snapshot of all resolved rarity levels
let all = RarityCore.getAllRarityEntries()
// Version & availability
let apiVer = RarityCore.getApiVersion()
let ver = RarityCore.getModVersion()
let cfgVer = RarityCore.getConfigVersion()
let ok = RarityCore.isAvailable()
```

## Constants

```js
RarityCore.COMMON()    // 1
RarityCore.UNCOMMON()  // 2
RarityCore.RARE()      // 3
RarityCore.EPIC()      // 4
RarityCore.LEGENDARY() // 5
RarityCore.MYTHICAL()  // 6
RarityCore.UNIQUE()    // 7
```

## Events

### RarityCoreEvents.rarityChanged

```js
RarityCoreEvents.rarityChanged(event => {
    console.log(`Changed: ${event.itemId} → ${event.newRarity}`)
})
```

### RarityCoreEvents.rarityQuery

```js
RarityCoreEvents.rarityQuery(event => {
    if (event.itemId === "minecraft:diamond") {
        event.rarity = 6
    }
})
```

### RarityCoreEvents.rarityTooltip (client only)

```js
RarityCoreEvents.rarityTooltip(event => {
    event.addText("§6Custom tooltip text")
})
```

## Full Example

```js
// startup_scripts/rarity_setup.js
RarityCore.register("minecraft:diamond_sword", 5)
RarityCore.register("minecraft:nether_star", 7)

RarityCoreEvents.rarityQuery(event => {
    if (event.itemId === "minecraft:enchanted_golden_apple") {
        event.rarity = Math.min(event.rarity + 1, 7)
    }
})
```
