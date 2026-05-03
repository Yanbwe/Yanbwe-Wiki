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
