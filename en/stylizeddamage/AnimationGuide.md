# Animation Guide

Four independent animation modules run in parallel: **position**, **size**, **brightness**, **opacity**.

Lifecycle: `enter → hold → exit → remove`

The exit phase starts after the **longest enter duration** across all modules, ensuring synchronized exit timing.

> **Distance scaling**: Position animation offsets scale with entity distance (same ratio as font size). Distant entities have smaller movement.

## Structure

```json
"animation": {
  "hold": 5,
  "position": { ... },
  "size": { ... },
  "brightness": { ... },
  "opacity": { ... }
}
```

## Common Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | `"none"` or `"normal"` |
| `duration` | int | Duration in ticks |
| `easing` | object | Easing curve |

### Easing Curves

| Config | Effect |
|--------|--------|
| `{ "in": false, "out": true }` | Ease out (default) |
| `{ "in": true, "out": false }` | Ease in |
| `{ "in": true, "out": true }` | Ease in-out |
| `{ "in": false, "out": false }` | Linear |

## Random Values

```json
// Fixed
"distance": 20

// Base + random (0% ~ 50%)
"distance": { "base": 20, "random": 0.5 }

// Base + random (-30% ~ 30%)
"distance": { "base": 20, "random": [-0.3, 0.3] }
```

## Position

**XY offset:**
```json
"startOffset": { "type": "xy", "x": -10, "y": -20 }
```

**Direction offset:**
```json
"startOffset": { "type": "direction", "angle": -90, "distance": 12 }
```

- `angle` 0° = right, 90° = up, -90° = down

## Other Modules

- **Size**: offsets relative to base `fontSize` (0.3 = 30% larger)
- **Brightness**: positive = brighter, negative = darker
- **Opacity**: 0.0 = transparent, 1.0 = opaque

## Lifecycle Example

With default style (max enter=40, hold=10):

```
Tick 0-40:  Enter animations (varying durations)
            Shorter enters hold until the longest finishes
Tick 40-50: Hold (10 ticks)
Tick 50-90: Exit animations play in sync
Tick 90:    Removed
```
