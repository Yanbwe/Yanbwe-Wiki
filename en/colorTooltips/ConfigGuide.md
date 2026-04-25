# ColorTooltips Config Guide

The configuration file is located at:

`config/colortooltips-client.toml`

## Configuration Options

### Basic Options

#### enabled

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable colored tooltips. Disable to restore vanilla tooltip style.

#### customHeaderEnabled

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the custom header (item icon + white name + rarity text). Disable to keep vanilla item name. Forced disabled without RarityCore installed.

#### bgAlpha

- **Type**: Double
- **Range**: 0.0 ~ 1.0
- **Default**: 0.97
- **Description**: Tooltip background opacity. 0.0 is fully transparent, 1.0 is fully opaque.

#### bgDarken

- **Type**: Double
- **Range**: 0.0 ~ 1.0
- **Default**: 0.7
- **Description**: Background darken factor. Darkens the background based on the rarity color. Higher values produce darker backgrounds.

#### borderGradientEnabled

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the border gradient effect.

#### titlebarGradientEnabled

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to enable the title bar gradient effect.

---

### Color Variation

#### hueVariation

- **Type**: Double
- **Range**: 0.0 ~ 1.0
- **Default**: 0.1
- **Description**: Hue variation range. Controls the magnitude of hue offset during color flow. Higher values produce more varied colors.

#### valueVariation

- **Type**: Double
- **Range**: 0.0 ~ 1.0
- **Default**: 0.4
- **Description**: Value (brightness) variation range. Controls the magnitude of brightness offset during color flow.

#### saturationVariation

- **Type**: Double
- **Range**: 0.0 ~ 1.0
- **Default**: 0.1
- **Description**: Saturation variation range. Controls the magnitude of saturation offset during color flow.

---

### Switch Animation

#### switchTailSegments

- **Type**: Integer
- **Range**: 10 ~ 100
- **Default**: 50
- **Description**: Number of trail segments when the tooltip switches position. Higher values produce smoother trails but with greater performance cost.

#### switchTailLength

- **Type**: Double
- **Range**: 0.1 ~ 2.0
- **Default**: 1.6
- **Description**: Trail length factor. Controls trail length in position switch animations.

#### switchTailAlphaExponent

- **Type**: Double
- **Range**: 0.1 ~ 1.0
- **Default**: 0.5
- **Description**: Trail alpha decay exponent. Smaller values make the trail more visible.

#### fadeOutDelay

- **Type**: Integer
- **Range**: 0 ~ 1000
- **Default**: 100
- **Unit**: ms
- **Description**: Delay before the tooltip starts fading out.

#### fadeInDuration

- **Type**: Integer
- **Range**: 0 ~ 500
- **Default**: 100
- **Unit**: ms
- **Description**: Duration of the tooltip fade-in animation.

#### switchFlashDuration

- **Type**: Integer
- **Range**: 0 ~ 1000
- **Default**: 500
- **Unit**: ms
- **Description**: Duration of the border flash animation when switching items.

#### itemScaleMin

- **Type**: Double
- **Range**: 0.1 ~ 1.0
- **Default**: 0.5
- **Description**: Minimum scale of the item icon when appearing. The animation eases from this value to 1.0.

---

### Color Flow

#### gradientPeriod

- **Type**: Double
- **Range**: 50.0 ~ 500.0
- **Default**: 200.0
- **Description**: Gradient period. Controls the duration of one full cycle of the color flow animation. Higher values produce slower color changes.

#### scrollSpeed

- **Type**: Double
- **Range**: 0.01 ~ 0.2
- **Default**: 0.05
- **Description**: Speed at which colors scroll across the border and title bar.

---

### Tooltip Lock

#### lockScrollSensitivity

- **Type**: Double
- **Range**: 1.0 ~ 20.0
- **Default**: 10.0
- **Description**: Sensitivity when moving the tooltip with Shift + mouse scroll. Higher values move the tooltip further per scroll tick.

---

### Miscellaneous

#### showRarityCoreWarning

- **Type**: Boolean
- **Default**: true
- **Description**: Whether to show a warning screen before entering the world when RarityCore is not installed.

---

## Example Configuration

```toml
[options]
    enabled = true
    customHeaderEnabled = true
    bgAlpha = 0.97
    bgDarken = 0.7
    borderGradientEnabled = true
    titlebarGradientEnabled = true

[color_variation]
    hueVariation = 0.1
    valueVariation = 0.4
    saturationVariation = 0.1

[switch_animation]
    switchTailSegments = 50
    switchTailLength = 1.6
    switchTailAlphaExponent = 0.5
    fadeOutDelay = 100
    fadeInDuration = 100
    switchFlashDuration = 500
    itemScaleMin = 0.5

[color_flow]
    gradientPeriod = 200.0
    scrollSpeed = 0.05

[tooltip_lock]
    lockScrollSensitivity = 10.0

showRarityCoreWarning = true
```

## Notes

1. After modifying the configuration file, restart the game or reload the config for changes to take effect.
2. The `customHeaderEnabled` option only works when RarityCore is installed; it will be forced disabled otherwise.
3. If the configuration file becomes corrupted, delete it and restart the game to generate a default one.
