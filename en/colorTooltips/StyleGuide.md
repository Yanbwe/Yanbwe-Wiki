# Style Guide

Style files define the complete appearance of tooltips. Each `.json` file contains 7 config blocks, each controlling a different aspect of the tooltip.

> Tip: After modifying a style, use `/colortooltips reload` to preview changes in-game immediately.

## Style Structure Overview

A complete style file structure:

```json
{
  "border":      { /* Border color, opacity, flow effect */ },
  "backGround":  { /* Background color, opacity, flow effect */ },
  "titleBar":    { /* Title bar color, height, flow effect */ },
  "itemName":    { /* Item name color change */ },
  "extraToolTip":{ /* Extra tooltip text */ },
  "itemModel":   { /* Item model size */ },
  "animation":   { /* Fade, switch effects, scaling params */ }
}
```

## 1. border — Border

Controls the outer border color and dynamic effects.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `opacity` | Float | `1.0` | Overall border opacity (0~1) |
| `colorFlowSpeed` | Float | `1.0` | Color flow speed, `0` = static |
| `colorFlowDirection` | String | `"Clockwise"` | `"Clockwise"` or `"CounterClockwise"` |
| `fillColor` | Array | See below | Fill color list, distributed along the border |

**fillColor** entry structure:

```json
{
  "color": "@rarityCore",
  "colorModifier": {
    "brightness": 0.0,
    "saturation": 0.0
  }
}
```

- `color` — Color source (see [Color Token System](#color-token-system) below)
- `colorModifier` — Color adjustment (optional)
  - `brightness` — Brightness offset, `-1.0` (pure black) to `1.0` (pure white)
  - `saturation` — Saturation offset, `-1.0` (grayscale) to `1.0` (vivid)

> When `colorFlowSpeed` is `0`, only the first color in `fillColor` is used as a static single-color border.

## 2. backGround — Background

Controls the inner background color and effects.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `opacity` | Float | `0.8` | Background opacity (0~1) |
| `colorFlowSpeed` | Float | `0.0` | Color flow speed, `0` = static |
| `colorFlowDirection` | String | `"TopToDown"` | `"TopToDown"` / `"DownToTop"` / `"LeftToRight"` / `"RightToLeft"` |
| `fillColor` | Array | See above | Fill color list, distributed along the direction |

## 3. titleBar — Title Bar

The colored bar at the top of the tooltip, displaying the item icon and name.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Show the title bar |
| `twoHeight` | Boolean | `true` | `true` = two-line height (24px), `false` = single-line (11px) |
| `opacity` | Float | `1.0` | Title bar opacity |
| `colorFlowSpeed` | Float | `1.0` | Color flow speed |
| `colorFlowDirection` | String | `"LeftToRight"` | `"LeftToRight"` or `"RightToLeft"` |
| `extraOpacityOnRight` | Boolean | `true` | Whether the right side fades out (gradient transparency) |
| `fillColor` | Array | See above | Title bar color list |

> If either `twoHeight` or `itemModel.bigSize` is enabled, the title bar uses 24px double-line height.

## 4. itemName — Item Name Color

Controls whether the item name follows rarity colors.

```json
{
  "changeColor": {
    "enabled": false,
    "color": "@rarityCore"
  }
}
```

- `enabled` — When `true`, the item name uses the specified color
- `color` — Color source (supports all color tokens, see below)

## 5. extraToolTip — Extra Tooltip Text

Displays an additional line of text in the tooltip, useful for showing rarity, mod source, etc.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `false` | Show extra tooltip text |
| `content` | String | `"@rarityCore"` | Text content, supports dynamic tokens |
| `contentColor` | String | `"@rarityCore"` | Text color, supports color tokens |

**Dynamic tokens for `content`:**

| Token | Result |
|-------|--------|
| `@rarityCore` | RarityCore localized rarity text (e.g. "⭐ Rare") |
| `@vanillaRarity` | Vanilla rarity name ("Common", "Uncommon"...) |
| `@itemID` | Item registry name (e.g. "minecraft:diamond_sword") |
| `@modID` | Item's mod ID (e.g. "minecraft") |
| Other string | Displayed as-is |

## 6. itemModel — Item Model

Controls the item icon rendering in the title bar.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Render the item icon |
| `bigSize` | Boolean | `true` | `true` = large icon (32px), `false` = small (16px) |

> Large icons push the title bar text further right to accommodate the larger icon.

## 7. animation — Animation Parameters

Controls all animation effects for the tooltip.

### itemModel

Item icon scale animations.

```json
{
  "switching": { "enabled": true, "startSize": 0.5 },
  "appearing": { "enabled": true, "startSize": 0.5 }
}
```

- `switching` — Scale animation when switching to a different item
- `appearing` — Scale animation when the tooltip first appears
- `startSize` — Starting scale (0~1), the icon eases from this to normal size

### smoothMovement

Tooltip position smoothly follows the cursor.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `realTimeEnabled` | Boolean | `true` | `true` = smooth easing, `false` = instant jump |
| `speed` | Float | `1.0` | Following speed multiplier |

### smoothScaling

Smooth transition when the tooltip size changes.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable smooth scaling |
| `speed` | Float | `1.0` | Scaling speed multiplier |

### fadeOut

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable fade-out effect |
| `delay` | Integer | `500` | Wait time before fade-out starts (ms) |
| `duration` | Integer | `100` | Fade-out animation duration (ms) |

### fadeIn

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable fade-in effect |
| `duration` | Integer | `100` | Fade-in animation duration (ms) |

### switchEffect — Switch Flash

Border flash animation when switching items.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable flash effect |
| `color` | String | `"@rarityCore"` | Flash color (supports color tokens) |
| `duration` | Integer | `500` | Flash animation duration (ms) |
| `length` | Float | `1.6` | Flash trail length (higher = longer trail) |
| `segmentation` | Integer | `50` | Trail segments (higher = smoother, more performance cost) |

## Color Token System

The `color` field in styles supports three formats:

| Format | Example | Description |
|--------|---------|-------------|
| `@rarityCore` | `"@rarityCore"` | RarityCore rarity color (requires RarityCore) |
| `@vanillaRarity` | `"@vanillaRarity"` | Vanilla rarity color: white/yellow/cyan/purple |
| Hex | `"A100FF"` | Fixed color (RRGGBB), `#` prefix optional (e.g. `"#A100FF"`) |

## Built-in Styles

| Name | Characteristics | Best For |
|------|----------------|----------|
| **Vanilla** | Clean style, `@vanillaRarity`, titleBar lower opacity | General use |
| **VanillaRarity** | Emphasizes rarity info, `extraToolTip` shows rarity | Showcasing rarity |
| **RarityCoreStyles** | Based on `@rarityCore`, richer rarity colors | Paired with RarityCore |
| **RGB** | 8-color rainbow border + title bar, eye-catching | Want flashy effects |

## Creating Your Own Style

1. Create a new `.json` file in `config/colortooltips/styles/`. The filename becomes the style name.
2. Write your style content following the structure above. Only include fields you want to change—missing fields will use defaults.
3. Reference your style name in `common.json`'s `styleSelector`.
4. Run `/colortooltips reload` to apply immediately.

### Minimal Style Example

```json
{
  "border": {
    "colorFlowSpeed": 0,
    "fillColor": [{ "color": "FF5500" }]
  },
  "backGround": {
    "colorFlowSpeed": 0,
    "fillColor": [{ "color": "FF5500", "colorModifier": { "brightness": -0.9 } }]
  },
  "titleBar": {
    "fillColor": [{ "color": "FF5500" }]
  }
}
```

This style gives items an orange border and background, static without flow. Save as `Orange.json`, reference it in `styleSelector`, and you're done.
