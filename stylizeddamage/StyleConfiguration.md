# 样式文件说明

样式文件位于：

```
config/stylizeddamage/styles/<样式名>.json
```

每个样式文件定义一个伤害跳字的完整视觉表现。文件名即为样式名（不含 `.json`）。

模组自带默认样式文件 `styles/default.json`。

## 样式属性一览

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `color` | 字符串 | `"#FFFFFF"` | 文字颜色（支持固定色/彩虹） |
| `fontSize` | 浮点数 | `1.0` | 字体大小倍率 |
| `fontStyle` | 字符串 | `"bold"` | 字体样式 |
| `shadow` | 布尔值 | `true` | 是否显示文字阴影 |
| `outlineColor` | 字符串/null | `null` | 文字描边颜色 |
| `backgroundColor` | 字符串/null | `null` | 文字背景色块 |
| `sound` | 字符串/null | `null` | 跳字出现音效 |
| `prefix` | 字符串 | `""` | 文字前缀 |
| `suffix` | 字符串 | `""` | 文字后缀 |
| `icon` | 字符串/null | `null` | 图标纹理路径 |
| `iconPosition` | 字符串 | `"left"` | 图标位置：`"left"` 或 `"right"` |
| `iconOffsetX` | 浮点数 | `0` | 跳字图标水平微调像素偏移 |
| `iconOffsetY` | 浮点数 | `0` | 跳字图标垂直微调像素偏移 |
| `hudIconOffsetX` | 浮点数 | `0` | 总伤害 HUD 图标水平微调像素偏移（独立于 `iconOffsetX`） |
| `hudIconOffsetY` | 浮点数 | `0` | 总伤害 HUD 图标垂直微调像素偏移（独立于 `iconOffsetY`） |
| `killText` | 字符串/null | `null` | kill 型跳字显示的文本（替代伤害数字） |
| `bypassDisplayOpacity` | 布尔值 | `false` | 为 `true` 时无视全局 `displayOpacity` 配置 |
| `decimalPlaces` | 整数 | `1` | 伤害数字保留的小数位数；整型伤害（如 `12.0`）仍显示为整数，小数伤害按该位数四舍五入；小于 `0` 时回退为 `1` |
| `animation` | 对象 | — | 动画配置（见下文） |
| `damageScale` | 对象 | — | 伤害大小缩放（见下文） |

## 颜色系统

### 固定色

十六进制 RGB 格式：

```json
"color": "#FF4444"
```

也支持 ARGB 格式（含透明度）：

```json
"color": "#80FF4444"
```

### 彩虹色

```json
"color": "rainbow:speed:10"
```

- `speed` 参数控制色相旋转速度（每 tick 偏移的度数）
- 值越大颜色变化越快
- 每 tick 色相自动偏移，产生流动的彩虹效果

## 字体样式

| 值 | 效果 |
|----|------|
| `"normal"` | 普通字体 |
| `"bold"` | 粗体 |
| `"italic"` | 斜体 |
| `"bold_italic"` | 粗斜体 |

## 前缀与后缀

```json
"prefix": "-",
"suffix": " ❤"
```

渲染效果示例：`-128 ❤`

### 图标

图标显示在文字旁边，按 Minecraft 纹理路径指定：

```json
"icon": "minecraft:textures/particle/angry.png",
"iconPosition": "right",
"iconOffsetX": 0,
"iconOffsetY": 4,
"hudIconOffsetX": 0,
"hudIconOffsetY": 4
```

| 参数 | 说明 |
|------|------|
| `icon` | 纹理路径，格式 `命名空间:textures/...` |
| `iconPosition` | `"left"`（文字左边）或 `"right"`（文字右边） |
| `iconOffsetX` | 跳字图标水平微调（正=右移，负=左移） |
| `iconOffsetY` | 跳字图标垂直微调（正=下移，负=上移） |
| `hudIconOffsetX` | 总伤害 HUD 图标水平微调（正=右移，负=左移） |
| `hudIconOffsetY` | 总伤害 HUD 图标垂直微调（正=下移，负=上移） |

> **锚点说明**：跳字与总伤害 HUD（总伤害数字和尾随数字）的图标锚点一致——水平方向紧贴文字边缘，垂直方向图标中心与文字中心对齐，偏移量在此基础上微调。
>
> **偏移配置独立**：`iconOffsetX/Y` 仅作用于伤害跳字图标；`hudIconOffsetX/Y` 仅作用于总伤害 HUD 图标。两套配置互不影响，可分别调校，避免一处调整导致另一处错位。

## 音效

跳字出现时播放的音效，使用 Minecraft 音效 ID：

```json
"sound": "minecraft:entity.player.hurt"
```

设为 `null` 则不播放音效。

## damageScale — 伤害大小缩放

根据伤害数值自动放大字体和延长停留时间，伤害越高字越大、停留越久。

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

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔值 | `true` | 是否启用 |
| `baseFontSize` | 浮点数 | `1.0` | 基础字体大小倍率（伤害为 0 时） |
| `stepSize` | 浮点数 | `10` | 每步对应多少伤害值 |
| `sizeOffsetPerStep` | 浮点数 | `1` | 每步增加的字体大小 |
| `maxSize` | 浮点数 | `2.5` | 最大字体大小倍率 |
| `holdBase` | 浮点数 | `0` | 基础额外停留 tick 数 |
| `holdOffsetPerStep` | 浮点数 | `10` | 每步增加的停留 tick 数 |
| `holdMax` | 浮点数 | `20` | 最大额外停留 tick 数 |

### 计算公式

```
字体大小 = clamp(baseFontSize + (伤害值 / stepSize) × sizeOffsetPerStep, baseFontSize, maxSize)
停留增量 = clamp(round((伤害值 / stepSize) × holdOffsetPerStep), 0, holdMax - holdBase)
```

最终停留时间 = 动画中的 `hold` + 停留增量。

## killText — 击杀文字

当伤害类型为 `"kill"`（致命伤害）时，跳字不显示伤害数字，而是显示 `killText` 字段的值：

```json
"killText": "击杀!"
```

设为 `null` 则正常显示伤害数字。

> 关于如何配置 kill 伪伤害类型 → [配置文件说明](/stylizeddamage/Configuration#伪伤害类型)

## decimalPlaces — 小数位数

控制伤害数字的四舍五入显示精度。

```json
"decimalPlaces": 1
```

- 默认值为 `1`，即精确至小数点后一位（如 `12.34` → `12.3`）。
- 整型伤害（如 `12.0`）始终显示为整数（`12`），不会显示多余的 `.0`。
- 小数伤害按配置的位数四舍五入（如 `decimalPlaces: 2` 时，`12.345` → `12.35`）。
- 取值小于 `0` 时回退为默认值 `1`。

## 完整样式示例

### 默认样式 (default.json)

白色粗体、向上浮动、淡入淡出、随伤害放大：

```json
{
  "color": "#FFFFFF",
  "fontSize": 1,
  "fontStyle": "bold",
  "shadow": true,
  "outlineColor": null,
  "prefix": "",
  "suffix": "",
  "icon": "",
  "sound": null,
  "killText": "kill!",
  "iconPosition": "right",
  "iconOffsetX": 0,
  "iconOffsetY": 4,
  "hudIconOffsetX": 0,
  "hudIconOffsetY": 4,
  "decimalPlaces": 1,
  "damageScale": {
    "enabled": true,
    "baseFontSize": 1.0,
    "stepSize": 10,
    "sizeOffsetPerStep": 1,
    "maxSize": 2.5,
    "holdBase": 0,
    "holdOffsetPerStep": 10,
    "holdMax": 20
  },
  "animation": {
    "hold": 5,
    "position": {
      "enter": {
        "type": "normal",
        "duration": 5,
        "easing": { "in": false, "out": true },
        "startOffset": { "type": "xy", "x": { "base": 2, "random": [-2, 2] }, "y": { "base": 2, "random": [-2, 2] } },
        "targetOffset": { "type": "direction", "angle": { "base": 90, "random": [-1, 1] }, "distance": { "base": 20, "random": [-2, 2] } }
      },
      "exit": { "type": "none" }
    },
    "size": {
      "enter": {
        "type": "normal",
        "duration": 5,
        "easing": { "in": true, "out": true },
        "startOffset": -0.6,
        "targetOffset": 0
      },
      "exit": {
        "type": "normal",
        "duration": 10,
        "easing": { "in": true, "out": false },
        "targetOffset": -1
      }
    },
    "brightness": {
      "enter": { "type": "none" },
      "exit": { "type": "none" }
    },
    "opacity": {
      "enter": {
        "type": "normal",
        "duration": 5,
        "easing": { "in": true, "out": true },
        "startOpacity": 0,
        "targetOpacity": 1
      },
      "exit": {
        "type": "normal",
        "duration": 10,
        "easing": { "in": true, "out": false },
        "targetOpacity": 0
      }
    }
  }
}
```

### 火焰伤害样式 (fire.json)

橙色文字 + 跳动动画 + 🔥 后缀：

```json
{
  "color": "#FF6600",
  "fontSize": 1.1,
  "fontStyle": "bold",
  "shadow": true,
  "outlineColor": "#331100",
  "suffix": "🔥",
  "animation": {
    "hold": 10,
    "position": {
      "enter": {
        "type": "normal",
        "duration": 6,
        "easing": { "in": false, "out": true },
        "startOffset": { "type": "direction", "angle": -70, "distance": { "base": 8, "random": 0.5 } },
        "targetOffset": { "type": "xy", "x": { "base": 0, "random": [-0.2, 0.2] }, "y": 0 }
      },
      "exit": { "type": "none" }
    },
    "size": {
      "enter": {
        "type": "normal",
        "duration": 4,
        "easing": { "in": true, "out": true },
        "startOffset": 0.5,
        "targetOffset": 0
      },
      "exit": {
        "type": "normal",
        "duration": 8,
        "easing": { "in": true, "out": true },
        "targetOffset": -0.3
      }
    },
    "opacity": {
      "enter": {
        "type": "normal",
        "duration": 6,
        "easing": { "in": true, "out": true },
        "startOpacity": 0,
        "targetOpacity": 1
      },
      "exit": {
        "type": "normal",
        "duration": 10,
        "easing": { "in": true, "out": true },
        "targetOpacity": 0
      }
    }
  }
}
```

### 魔法伤害样式 (magic.json)

紫色闪烁文字 + ✦ 后缀：

```json
{
  "color": "rainbow:speed:5",
  "fontSize": 1.2,
  "fontStyle": "italic",
  "shadow": true,
  "outlineColor": "#6600AA",
  "suffix": " ✦",
  "animation": {
    "hold": 8,
    "position": {
      "enter": {
        "type": "normal",
        "duration": 10,
        "easing": { "in": true, "out": false },
        "startOffset": { "type": "direction", "angle": -90, "distance": 20 },
        "targetOffset": { "type": "xy", "x": 0, "y": 0 }
      },
      "exit": {
        "type": "normal",
        "duration": 15,
        "easing": { "in": true, "out": true },
        "targetOffset": { "type": "direction", "angle": -60, "distance": 30 }
      }
    },
    "brightness": {
      "enter": {
        "type": "normal",
        "duration": 8,
        "easing": { "in": true, "out": true },
        "startOffset": 0.3
      },
      "exit": {
        "type": "normal",
        "duration": 10,
        "easing": { "in": true, "out": true },
        "targetOffset": -0.2
      }
    },
    "opacity": {
      "enter": {
        "type": "normal",
        "duration": 6,
        "easing": { "in": true, "out": true },
        "startOpacity": 0,
        "targetOpacity": 1
      },
      "exit": {
        "type": "normal",
        "duration": 15,
        "easing": { "in": true, "out": true },
        "targetOpacity": 0
      }
    }
  }
}
