# 配置文件说明 (common.json)

配置文件位于：

```
config/stylizeddamage/common.json
```

如果配置文件不存在，模组首次加载时会自动生成默认配置。

## 配置选项

### selectors — 选择器配置

选择器决定「什么伤害使用什么样式」。采用三层匹配机制：

1. **第一层**：按伤害数值区间分流（可选）
2. **第二层**：按受伤目标类型分流（可选）
3. **第三层**：按伤害类型匹配（match 数组）

```json
"selectors": {
  "common": {
    "common": [
      { "match": ["*"], "style": "default" }
    ]
  }
}
```

#### 区间 Key 格式

| 格式 | 含义 | 示例 |
|------|------|------|
| `"common"` | 不满足任何区间时的兜底 | — |
| `"[min,max]"` | 闭区间 | `"[0,50]"` |
| `"[min,...]"` | min 及以上 | `"[50,...]"` |
| `"[...,max]"` | max 及以下 | `"[...,10]"` |

#### 分支路径

| 分支 | 命中条件 |
|------|----------|
| `player.yourTeam` | 目标为玩家且与自己同队 |
| `player.otherTeam` | 目标为玩家且与自己不同队 |
| `player.common` | 目标为玩家但无队伍信息 |
| `mob.hostile` | 目标为敌对生物 |
| `mob.passive` | 目标为被动生物 |
| `mob.common` | 目标为生物但无法判断敌友 |
| `common` | 以上均不匹配时的兜底 |

#### match 数组

- 每个选择器的 `match` 数组内的条件之间是「或」的关系
- 支持伤害类型 ID：`"minecraft:in_fire"`、`"minecraft:fall"`
- 支持标签：`"#minecraft:is_fire"`、`"#minecraft:bypasses_armor"`（启动时自动展开为具体伤害类型）
- 支持伪伤害类型：`"heal"`（治疗）、`"absorption"`（吸收）、`"kill"`（击杀）
- 支持暴击：`"critical"`
- 通配符：`"*"` 匹配所有真实伤害类型，但不匹配伪伤害类型（`heal`、`absorption`、`kill`）。伪类型需通过显式规则单独匹配；配置文件省略对应伪类型规则时，该伪类型跳字被完全抑制

#### 完整示例

```jsonc
"selectors": {
  // 区间：[50,...] — 高伤害走特殊样式
  "[50,...]": {
    "common": [
      { "match": ["*"], "style": "high_damage" }
    ]
  },
  // 区间：common — 常规伤害
  "common": {
    // 玩家分支
    "player": {
      "yourTeam": [
        { "match": ["*"], "style": "friendly" }
      ],
      "otherTeam": [
        { "match": ["critical"], "style": "critical" },
        { "match": ["*"], "style": "enemy" }
      ]
    },
    // 生物分支
    "mob": {
      "hostile": [
        { "match": ["minecraft:in_fire"], "style": "fire" },
        { "match": ["minecraft:magic"], "style": "magic" },
        { "match": ["*"], "style": "default" }
      ],
      "passive": [
        { "match": ["*"], "style": "default" }
      ]
    },
    // 兜底
    "common": [
      { "match": ["*"], "style": "default" }
    ]
  }
}
```

### displayFilter — 显示过滤器

控制「哪些伤害需要显示跳字」。

```json
"displayFilter": {
  "mode": "byTarget",
  "hideSelfDamage": true,
  "bySource": { ... },
  "byTarget": { ... }
}
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `mode` | 字符串 | `"byTarget"` | 判断方案：`"bySource"` 或 `"byTarget"` |
| `hideSelfDamage` | 布尔值 | `true` | 隐藏自身受到的伤害 |

#### bySource（基于伤害来源）

| 来源 | 同队 | 异队 |
|------|------|------|
| `player` | `false` | `false` |
| `mob.hostile` | `false` | — |
| `mob.passive` | `false` | — |
| `other` | `false` | — |

#### byTarget（基于受伤目标，默认）

| 目标 | 同队 | 异队 |
|------|------|------|
| `player` | `true` | `true` |
| `mob.hostile` | `true` | — |
| `mob.passive` | `true` | — |
| `other` | `true` | — |

### displayOpacity — 全局透明度

按**伤害来源**控制跳字透明度（0.0 = 全透明，1.0 = 完全不透明）。

```json
"displayOpacity": {
    "player": 1.0,
    "mobHostile": 0.5,
    "mobPassive": 0.75,
    "other": 1.0
}
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `player` | 浮点数 | `1.0` | 玩家造成的伤害透明度 |
| `mobHostile` | 浮点数 | `0.5` | 敌对生物造成的伤害透明度 |
| `mobPassive` | 浮点数 | `0.75` | 友善生物造成的伤害透明度 |
| `other` | 浮点数 | `1.0` | 其他来源（环境等）的透明度 |

> 这个透明度乘在动画透明度之上。比如动画透明度为 0.8，`mobHostile` 为 0.5，最终渲染 = 0.8 × 0.5 = 0.4。

### 伤害显示设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `minDamageDisplay` | 浮点数 | `0.1` | 低于此值的伤害不显示跳字 |
| `maxActiveNumbers` | 整数 | `999` | 屏幕上同时显示的最大跳字数 |
| `showHealing` | 布尔值 | `true` | 是否显示治疗数字 |
| `showAbsorption` | 布尔值 | `true` | 是否显示吸收数字 |
| `hideFullHealthHeal` | 布尔值 | `true` | 满血生物回血时不显示跳字 |
| `killOnlyOnMobDeath` | 布尔值 | `false` | 生物被击杀时只显示 kill 文字，不显示具体伤害数字 |
| `killOnlyFullHealth` | 布尔值 | `false` | 上一项开启时，仅对满血被秒杀的情况生效 |
| `displayScope` | 字符串 | `"all"` | 跳字显示范围：`all`（全部）/ `selfDealt`（仅自己造成）/ `selfRelated`（自己造成+自己受到） |
| `hideBehindWall` | 布尔值 | `false` | 跳字触发点与相机之间被完全固体不透明方块遮挡时不显示（玻璃、树叶等半透明方块不算遮挡） |

> `displayScope` 与 `hideBehindWall` 默认均不开启，不影响原有显示行为。

### 数字缩进（numberAbbreviation）

将大数值自动缩进显示，例如 `1200 → 1.2k`、`1500000 → 1.5M`，使大数字更易读。

```json
"numberAbbreviation": {
    "enabled": false,
    "threshold": 1000.0,
    "suffixes": ["k", "M", "B", "T"],
    "decimalPlaces": 1
}
```

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | 布尔值 | `false` | 是否启用数字缩进（默认关闭） |
| `threshold` | 浮点数 | `1000.0` | 低于此值的伤害不缩进 |
| `suffixes` | 字符串数组 | `["k","M","B","T"]` | 每 1000 倍递增的后缀，按升序排列 |
| `decimalPlaces` | 整数 | `1` | 缩进后保留的小数位数（如 `1.2k`、`1.23k`） |

- 整数结果不显示小数（`2000 → 2k`），非整数按 `decimalPlaces` 保留小数
- 同时作用于浮动跳字与总伤害面板（totalDamage）

### 距离缩放

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `distanceScaleSegment` | 浮点数 | `10.0` | 距离倍数段（格） |
| `distanceScaleFactor` | 浮点数 | `0.2` | 每段的缩小系数 |
| `distanceScaleMin` | 浮点数 | `0.3` | 最小缩放倍率 |
| `maxDisplayDistance` | 浮点数 | `64.0` | 最大显示距离（格） |

距离缩放公式：

```
最终缩放 = clamp(fontSize × (1 - (距离 ÷ 距离倍数段) × 缩小系数), 最小缩放, fontSize)
```

- 距离 0 格 → 100% 大小
- 每 10 格缩小 0.2 倍
- 最小 0.3 倍
- 超过 64 格不显示

### totalDamage — 总伤害面板

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | 布尔值 | `true` | 是否启用总伤害面板 |
| `resetTimeout` | 整数 | `100` | 无伤害后重置延迟（tick，20 tick = 1 秒） |
| `maxTrailCount` | 整数 | `20` | 尾随伤害最大条数 |
| `baseFontSize` | 浮点数 | `2.0` | 基础字体大小倍率 |
| `sizeOffsetPerThousand` | 浮点数 | `0.5` | 每 100 伤害字体增量 |
| `sizeOffsetMax` | 浮点数 | `3.0` | 最大字体倍率 |
| `positionX` | 浮点数 | `-0.15` | 水平偏移（窗口宽度的比例，负值左移） |
| `positionY` | 浮点数 | `0.15` | 垂直偏移（窗口高度的比例，正值下移） |
| `enableEntryAnimation` | 布尔值 | `true` | 总伤害数字是否播放入场动画 |
| `enableExitAnimation` | 布尔值 | `true` | 总伤害数字是否播放退场动画 |
| `enableBounceAnimation` | 布尔值 | `true` | 总伤害数字数值变化时是否弹跳 |
| `enableTrailEntryAnimation` | 布尔值 | `true` | 尾随条目是否从右侧滑入 |
| `enableTrailExitAnimation` | 布尔值 | `true` | 尾随条目是否向左滑出 |
| `bounceScalePeak` | 浮点数 | `1.4` | 弹跳动画峰值缩放（1.4 = 顶峰时放至 140% 大小） |
| `labelText` | 字符串 | `"Damage"` | 总伤害数字上方显示的标签文本，设为空字符串 `""` 可隐藏 |

字体大小公式：
```
clamp(baseFontSize + floor(总伤害 ÷ 100) × sizeOffsetPerThousand, baseFontSize, sizeOffsetMax)
```

面板选择器（仅按伤害区间分流）：

```json
"selectors": {
  "common":    { "style": "total" },
  "[100,...]":  { "style": "total_high" },
  "[1000,...]": { "style": "total_insane" }
}
```

## 伪伤害类型

除了原版伤害类型外，模组提供了三个内置伪伤害类型：

| ID | 触发条件 | 说明 |
|----|---------|------|
| `heal` | 实体被治疗 | 需 `showHealing: true` |
| `absorption` | 玩家吸收值增加 | 需 `showAbsorption: true` |
| `kill` | 伤害致命 | 不计入总伤害和尾随列表，始终置顶渲染。使用匹配样式的 `killText` 字段代替伤害数字 |

### kill 类型示例

```json
"selectors": {
  "common": {
    "common": [
      { "match": ["kill"], "style": "kill_style" },
      { "match": ["*"], "style": "default" }
    ]
  }
}
```

kill 跳字不会出现在总伤害面板和尾随列表中，仅用于视觉效果。

## 重载配置

修改配置后使用命令热重载：

```
/stylizeddamage reload
```
