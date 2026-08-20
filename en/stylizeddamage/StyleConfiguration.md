# Style Configuration

Style files are located at:

```
config/stylizeddamage/styles/<style_name>.json
```

Each file defines the visual appearance for a damage number. The filename (without `.json`) is the style name.

## Style Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | string | `"#FFFFFF"` | Text color (solid/rainbow) |
| `fontSize` | float | `1.0` | Font size multiplier |
| `fontStyle` | string | `"bold"` | Font style |
| `shadow` | boolean | `true` | Text shadow |
| `outlineColor` | string/null | `null` | Outline color |
| `backgroundColor` | string/null | `null` | Background color |
| `sound` | string/null | `null` | Sound effect on spawn |
| `prefix` | string | `""` | Text prefix |
| `suffix` | string | `""` | Text suffix |
| `icon` | string/null | `""` (empty string, treated as no icon) | Icon texture path |
| `iconPosition` | string | `"right"` | Icon position: `"left"` or `"right"` |
| `iconOffsetX` | float | `0` | Horizontal damage-number icon offset in pixels |
| `iconOffsetY` | float | `4` | Vertical damage-number icon offset in pixels |
| `hudIconOffsetX` | float | `0` | Horizontal total-damage HUD icon offset in pixels (independent of `iconOffsetX`) |
| `hudIconOffsetY` | float | `0` | Vertical total-damage HUD icon offset in pixels (independent of `iconOffsetY`) |
| `killText` | string/null | `"kill!"` (generated default file value; omitted files fall back to `null` and show the damage number) | Text for kill-type numbers (replaces damage value) |
| `bypassDisplayOpacity` | boolean | `false` | When `true`, ignores global `displayOpacity` config |
| `decimalPlaces` | int | `1` | Decimal places for damage numbers; integer damage values are always shown without decimals; values below `0` fall back to `1` |
| `animation` | object | — | Animation config |
| `damageScale` | object | — | Damage-based scaling |

## Color Formats

**Solid:**
```json
"color": "#FF4444"
```

**Rainbow:**
```json
"color": "rainbow:speed:10"
```

## Font Styles

| Value | Effect |
|-------|--------|
| `"normal"` | Normal |
| `"bold"` | Bold |
| `"italic"` | Italic |
| `"bold_italic"` | Bold Italic |

## Damage Scale

Automatically scales font size and increases hold time based on damage amount.

```json
"damageScale": {
  "enabled": true,
  "baseFontSize": 1.0,
  "stepSize": 10,
  "sizeOffsetPerStep": 1,
  "maxSize": 2.5,
  "holdBase": 0,
  "holdOffsetPerStep": 10,
  "holdMax": 20
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `true` | Enable damage scaling |
| `baseFontSize` | float | `1.0` | Base font size at zero damage |
| `stepSize` | float | `10` | Damage points per scaling step |
| `sizeOffsetPerStep` | float | `1` | Font size added per step |
| `maxSize` | float | `2.5` | Maximum font size multiplier |
| `holdBase` | float | `0` | Base extra hold ticks |
| `holdOffsetPerStep` | float | `10` | Extra hold ticks added per step |
| `holdMax` | float | `20` | Maximum extra hold ticks |

### Formulas

```
fontSize = clamp(baseFontSize + (damage / stepSize) × sizeOffsetPerStep, baseFontSize, maxSize)
holdExtra = clamp(round((damage / stepSize) × holdOffsetPerStep), 0, holdMax - holdBase)
```

Total hold time = animation `hold` + holdExtra.

> **Note:** The generated default `default.json` uses `holdOffsetPerStep: 5`; if a style file omits the entire `damageScale` block, the code fallback default is `10`. It is recommended to write this field explicitly to avoid ambiguity.

## Number Decimals

Controls how damage numbers are rounded for display.

```json
"decimalPlaces": 1
```

- Default is `1`, i.e. one decimal place (`12.34` → `12.3`).
- Integer damage values always drop the decimal part (`12.0` → `12`).
- Fractional damage is rounded to the configured number of decimal places (`decimalPlaces: 2` → `12.345` → `12.35`).
- Values below `0` fall back to the default (`1`).

See [Animation Guide](/en/stylizeddamage/AnimationGuide) for detailed animation configuration.
