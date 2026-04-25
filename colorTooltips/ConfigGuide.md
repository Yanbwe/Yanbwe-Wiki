# ColorTooltips 配置文件说明

配置文件位于：

`config/colortooltips-client.toml`

## 配置选项说明

### 基础选项

#### enabled

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用彩色提示框。关闭后将恢复原版提示框样式。

#### customHeaderEnabled

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用自定义标题栏（物品图标 + 白色名称 + 稀有度文字）。关闭则保留原版物品名称。未安装 RarityCore 时强制禁用。

#### bgAlpha

- **类型**: 浮点数
- **范围**: 0.0 ~ 1.0
- **默认值**: 0.97
- **说明**: 提示框背景透明度。0.0 为完全透明，1.0 为完全不透明。

#### bgDarken

- **类型**: 浮点数
- **范围**: 0.0 ~ 1.0
- **默认值**: 0.7
- **说明**: 背景颜色暗度。基于稀有度颜色进行暗化处理，值越大背景越暗。

#### borderGradientEnabled

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用边框渐变效果。

#### titlebarGradientEnabled

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用标题栏渐变效果。

---

### 色彩变化

#### hueVariation

- **类型**: 浮点数
- **范围**: 0.0 ~ 1.0
- **默认值**: 0.1
- **说明**: 色相变化范围。控制颜色流动时色相的偏移幅度，值越大色彩变化越丰富。

#### valueVariation

- **类型**: 浮点数
- **范围**: 0.0 ~ 1.0
- **默认值**: 0.4
- **说明**: 明度变化范围。控制颜色流动时明度的偏移幅度。

#### saturationVariation

- **类型**: 浮点数
- **范围**: 0.0 ~ 1.0
- **默认值**: 0.1
- **说明**: 饱和度变化范围。控制颜色流动时饱和度的偏移幅度。

---

### 切换动画

#### switchTailSegments

- **类型**: 整数
- **范围**: 10 ~ 100
- **默认值**: 50
- **说明**: 提示框切换位置时拖尾的分段数。值越大拖尾越平滑，但性能开销也越大。

#### switchTailLength

- **类型**: 浮点数
- **范围**: 0.1 ~ 2.0
- **默认值**: 1.6
- **说明**: 拖尾长度因子。控制位置切换动画中拖尾的长度。

#### switchTailAlphaExponent

- **类型**: 浮点数
- **范围**: 0.1 ~ 1.0
- **默认值**: 0.5
- **说明**: 拖尾透明度衰减指数。值越小，拖尾越明显。

#### fadeOutDelay

- **类型**: 整数
- **范围**: 0 ~ 1000
- **默认值**: 100
- **单位**: 毫秒
- **说明**: 提示框开始淡出前的延迟时间。

#### fadeInDuration

- **类型**: 整数
- **范围**: 0 ~ 500
- **默认值**: 100
- **单位**: 毫秒
- **说明**: 提示框淡入动画的时长。

#### switchFlashDuration

- **类型**: 整数
- **范围**: 0 ~ 1000
- **默认值**: 500
- **单位**: 毫秒
- **说明**: 切换物品时边框闪光动画的时长。

#### itemScaleMin

- **类型**: 浮点数
- **范围**: 0.1 ~ 1.0
- **默认值**: 0.5
- **说明**: 物品图标出现时的最小缩放比例。动画从该值缓动到 1.0。

---

### 色彩流动

#### gradientPeriod

- **类型**: 浮点数
- **范围**: 50.0 ~ 500.0
- **默认值**: 200.0
- **说明**: 颜色渐变周期。控制颜色流动动画一个完整周期的时长，值越大颜色变化越慢。

#### scrollSpeed

- **类型**: 浮点数
- **范围**: 0.01 ~ 0.2
- **默认值**: 0.05
- **说明**: 颜色在边框和标题栏上的滚动速度。

---

### 提示框锁定

#### lockScrollSensitivity

- **类型**: 浮点数
- **范围**: 1.0 ~ 20.0
- **默认值**: 10.0
- **说明**: 按住 Shift + 鼠标滚轮移动提示框时的灵敏度。值越大，每次滚轮滚动时提示框移动的距离越大。

---

### 其他

#### showRarityCoreWarning

- **类型**: 布尔值
- **默认值**: true
- **说明**: 未安装 RarityCore 时是否在进入世界前显示警告提示。

---

## 配置示例

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

## 注意事项

1. 修改配置文件后需要重启游戏或重载配置才能生效。
2. `customHeaderEnabled` 选项仅在安装 RarityCore 时生效，未安装时将被强制禁用。
3. 如果配置文件损坏，可以删除后重新启动游戏以生成默认配置。
