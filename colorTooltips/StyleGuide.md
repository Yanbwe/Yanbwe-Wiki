# 样式编写指南

样式文件定义了提示框的完整外观。每个 `.json` 文件包含 7 个配置块，分别控制提示框的不同部分。

> 提示：修改样式后使用 `/colortooltips reload` 即可在游戏中立即预览效果。

## 样式结构概览

一个完整的样式文件结构如下：

```json
{
  "border":      { /* 边框颜色、透明度、流动效果 */ },
  "backGround":  { /* 背景颜色、透明度、流动效果 */ },
  "titleBar":    { /* 标题栏颜色、高度、流动效果 */ },
  "itemName":    { /* 物品名称变色 */ },
  "extraToolTip":{ /* 额外提示文本 */ },
  "itemModel":   { /* 物品模型大小 */ },
  "animation":   { /* 淡入淡出、切换特效、缩放等动画参数 */ }
}
```

## 1. border — 边框

控制提示框外边框的颜色和动态效果。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `opacity` | 浮点数 | `1.0` | 边框整体透明度 (0~1) |
| `colorFlowSpeed` | 浮点数 | `1.0` | 颜色流动速度，`0` = 静止 |
| `colorFlowDirection` | 字符串 | `"Clockwise"` | `"Clockwise"`（顺时针）或 `"CounterClockwise"`（逆时针） |
| `fillColor` | 数组 | 见下文 | 填充颜色列表，按顺序沿边框分布 |

**fillColor** 数组中每个颜色条目的结构：

```json
{
  "color": "@rarityCore",
  "colorModifier": {
    "brightness": 0.0,
    "saturation": 0.0
  }
}
```

- `color` — 颜色来源（详见下方 [颜色 Token 系统](#颜色-token-系统)）
- `colorModifier` — 颜色修正（可选）
  - `brightness` — 明度偏移，`-1.0`（纯黑）到 `1.0`（纯白）
  - `saturation` — 饱和度偏移，`-1.0`（灰度）到 `1.0`（极艳）

> `colorFlowSpeed` 为 `0` 时只用 `fillColor` 的第一个颜色作为静态单色边框。

## 2. backGround — 背景

控制提示框内部背景的颜色和效果。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `opacity` | 浮点数 | `0.8` | 背景透明度 (0~1) |
| `colorFlowSpeed` | 浮点数 | `0.0` | 颜色流动速度，`0` = 静止 |
| `colorFlowDirection` | 字符串 | `"TopToDown"` | `"TopToDown"` / `"DownToTop"` / `"LeftToRight"` / `"RightToLeft"` |
| `fillColor` | 数组 | 见上文 | 填充颜色列表，沿指定方向分布 |

## 3. titleBar — 标题栏

提示框顶部的彩色横条，显示物品图标和名称。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否显示标题栏 |
| `twoHeight` | 布尔 | `true` | `true` = 双行高 (24px)，`false` = 单行 (11px) |
| `opacity` | 浮点数 | `1.0` | 标题栏透明度 |
| `colorFlowSpeed` | 浮点数 | `1.0` | 颜色流动速度 |
| `colorFlowDirection` | 字符串 | `"LeftToRight"` | `"LeftToRight"` 或 `"RightToLeft"` |
| `extraOpacityOnRight` | 布尔 | `true` | 标题栏右侧是否逐渐透明（渐变消失效果） |
| `fillColor` | 数组 | 见上文 | 标题栏颜色列表 |

> `twoHeight` 与 `itemModel.bigSize` 任意一个开启时，标题栏强制使用双行 24px 高度。

## 4. itemName — 物品名变色

控制物品名称是否跟随稀有度变色。

```json
{
  "changeColor": {
    "enabled": false,
    "color": "@rarityCore"
  }
}
```

- `enabled` — `true` 时物品名使用指定颜色
- `color` — 颜色来源（支持所有 token，见下方）

## 5. extraToolTip — 额外提示文本

在提示框中额外显示一行文本，可用于展示稀有度、模组来源等。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `false` | 是否显示额外提示文本 |
| `content` | 字符串 | `"@rarityCore"` | 文本内容，支持动态 token |
| `contentColor` | 字符串 | `"@rarityCore"` | 文本颜色，支持颜色 token |

**content 支持的动态 token：**

| Token | 效果 |
|-------|------|
| `@rarityCore` | RarityCore 本地化稀有度文本（如 "⭐ 稀有"） |
| `@vanillaRarity` | 原版稀有度名称（"Common"、"Uncommon"...） |
| `@itemID` | 物品注册名（如 "minecraft:diamond_sword"） |
| `@modID` | 物品所属模组 ID（如 "minecraft"） |
| 其他字符串 | 直接显示原文本 |

## 6. itemModel — 物品模型

控制标题栏中物品图标的渲染方式。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否渲染物品图标 |
| `bigSize` | 布尔 | `true` | `true` = 大图标 (32px)，`false` = 小图标 (16px) |

> 大图标会使标题栏文字右移更多空间以容纳大图标。

## 7. animation — 动画参数

控制提示框的所有动画效果。

### itemModel

物品图标缩放动画。

```json
{
  "switching": { "enabled": true, "startSize": 0.5 },
  "appearing": { "enabled": true, "startSize": 0.5 }
}
```

- `switching` — 切换到不同物品时的缩放动画
- `appearing` — 提示框首次出现时的缩放动画
- `startSize` — 缩放起点 (0~1)，物品图标从此比例缓动到正常大小

### smoothMovement

提示框位置平滑跟随鼠标。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `realTimeEnabled` | 布尔 | `true` | `true` = 平滑缓动，`false` = 直接跳变 |
| `speed` | 浮点数 | `1.0` | 跟随速度倍率 |

### smoothScaling

提示框大小变化时的平滑过渡。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否启用平滑缩放 |
| `speed` | 浮点数 | `1.0` | 缩放速度倍率 |

### fadeOut — 淡出

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否启用淡出效果 |
| `delay` | 整数 | `500` | 鼠标离开后淡出前的等待时间（毫秒） |
| `duration` | 整数 | `100` | 淡出动画时长（毫秒） |

### fadeIn — 淡入

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否启用淡入效果 |
| `duration` | 整数 | `100` | 淡入动画时长（毫秒） |

### switchEffect — 切换闪光

物品切换时边框上的闪光动画。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否启用闪光特效 |
| `color` | 字符串 | `"@rarityCore"` | 闪光颜色（支持颜色 token） |
| `duration` | 整数 | `500` | 闪光动画时长（毫秒） |
| `length` | 浮点数 | `1.6` | 闪光拖尾长度（值越大拖尾越长） |
| `segmentation` | 整数 | `50` | 拖尾分段数（值越大拖尾越平滑，但性能开销更大） |

## 颜色 Token 系统

样式中的 `color` 字段支持三种写法：

| 写法 | 示例 | 说明 |
|------|------|------|
| `@rarityCore` | `"@rarityCore"` | RarityCore 稀有度颜色（安装 RarityCore 时可用） |
| `@vanillaRarity` | `"@vanillaRarity"` | 原版稀有度颜色：白色/黄色/青色/紫色 |
| 十六进制 | `"A100FF"` | 固定颜色 (RRGGBB)，支持 `#` 前缀（如 `"#A100FF"`） |

## 四套预置样式

| 名称 | 特点 | 适用场景 |
|------|------|---------|
| **Vanilla** | 简洁风，基于 `@vanillaRarity`，titleBar 较透明 | 默认通用 |
| **VanillaRarity** | 强化稀有度信息，`extraToolTip` 显示稀有度 | 展示稀有度 |
| **RarityCoreStyles** | 基于 `@rarityCore`，稀有度颜色更丰富 | 搭配 RarityCore |
| **RGB** | 8 色彩虹边框 + 标题栏，绚丽夺目 | 想要炫彩效果 |

## 编写自己的样式

1. 在 `config/colortooltips/styles/` 目录下新建一个 `.json` 文件，文件名即为样式名。
2. 参照上面的结构编写样式内容，只需写你想要修改的字段，缺失字段会自动使用默认值。
3. 在 `common.json` 的 `styleSelector` 中引用你的样式名。
4. 执行 `/colortooltips reload` 立即生效。

### 最简样式示例

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

这个样式会给物品一个橙色的边框和背景，静止不流动。保存为 `Orange.json` 后在 `styleSelector` 中引用即可使用。
