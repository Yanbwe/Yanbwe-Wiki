# Style Configuration

Style files are located at:

```
config/stylizeddamage/styles/<style_name>.json
```

Each file defines the visual appearance for a damage number. The filename (without `.json`) is the style name.

---

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
| `icon` | string/null | `null` | Icon texture path |
| `iconPosition` | string | `"left"` | Icon position: `"left"` or `"right"` |
| `iconOffsetX` | float | `0` | Horizontal icon offset in pixels |
| `iconOffsetY` | float | `0` | Vertical icon offset in pixels |
| `killText` | string/null | `null` | Text for kill-type numbers (replaces damage value) |
| `bypassDisplayOpacity` | boolean | `false` | When `true`, ignores global `displayOpacity` config |
| `animation` | object | — | Animation config |
| `damageScale` | object | — | Damage-based scaling |

---

## Color Formats

**Solid:**
```json
"color": "#FF4444"
```

**Rainbow:**
```json
"color": "rainbow:speed:10"
```

---

## Font Styles

| Value | Effect |
|-------|--------|
| `"normal"` | Normal |
| `"bold"` | Bold |
| `"italic"` | Italic |
| `"bold_italic"` | Bold Italic |

---

## Damage Scale

Automatically scales font size and increases hold time based on damage amount.

```json
"damageScale": {
  "enabled": false,
  "baseFontSize": 1.0,
  "stepSize": 10,
  "sizeOffsetPerStep": 0.5,
  "maxSize": 3.0,
  "holdBase": 0,
  "holdOffsetPerStep": 40,
  "holdMax": 200
}
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `enabled` | boolean | `false` | Enable damage scaling |
| `baseFontSize` | float | `1.0` | Base font size at zero damage |
| `stepSize` | float | `10` | Damage points per scaling step |
| `sizeOffsetPerStep` | float | `0.5` | Font size added per step |
| `maxSize` | float | `3.0` | Maximum font size multiplier |
| `holdBase` | float | `0` | Base extra hold ticks |
| `holdOffsetPerStep` | float | `40` | Extra hold ticks added per step |
| `holdMax` | float | `200` | Maximum extra hold ticks |

### Formulas

```
fontSize = clamp(baseFontSize + (damage / stepSize) × sizeOffsetPerStep, baseFontSize, maxSize)
holdExtra = clamp(round((damage / stepSize) × holdOffsetPerStep), 0, holdMax - holdBase)
```

Total hold time = animation `hold` + holdExtra.

---

See [Animation Guide](/en/stylizeddamage/AnimationGuide) for detailed animation configuration.
