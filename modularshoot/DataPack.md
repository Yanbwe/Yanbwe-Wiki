# 数据包注册

通过数据包 JSON 注册内容，与 Java API 注册等价、共享同一注册表。`/reload` 可热重载 JSON 定义。

## 通用规则

- JSON 文件放在 `data/<命名空间>/modularshoot/<注册表路径>/<id>.json`
- 文件名为条目 ID（不含命名空间），命名空间由文件夹路径决定
- 所有资源路径字段使用完整命名空间格式（如 `modularshoot:textures/gun/rifle.png`）
- 可选字段省略时使用代码中注明的默认值
- `/reload` 后 JSON 定义即时生效，已发放物品的行为实时跟随新定义

## 枪械 JSON

**路径**：`data/<命名空间>/modularshoot/guns/<枪械id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | 否 | 无（回退到枪械 ID 路径部分） | 显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `texture` | 资源路径字符串 | **是** | — | 基础纹理路径（如 `"modularshoot:textures/gun/rifle.png"`） |
| `shoot_texture` | 资源路径字符串 | 否 | 无 | 射击纹理路径。不指定时射击期间始终使用基础纹理 |
| `shoot_texture_mode` | 字符串 | 否 | `"per_shot"` | 射击纹理切换模式。`"per_shot"`（每次射击切纹理）/ `"while_firing"`（按住射击期间持续显示）。仅在指定了 `shoot_texture` 时生效 |
| `stats` | 属性ID→浮点数对象 | 否 | `{}` | 属性基础值。键**必须带完整命名空间**（如 `"modularshoot:hit_damage": 50.0`）。不出现的属性使用元数据表默认值 |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 枪械固有特性覆盖。无特性时留空对象 `{}` |
| `slots` | 种类ID→整数对象 | 否 | `{}` | 插件插槽配置，键为插件种类 ID，值为插槽数量 |
| `sounds` | 字符串→资源路径对象 | 否 | `{}` | 音效绑定。如 `"shoot": "modularshoot:gun.rifle.shoot"` |
| `bullet_style` | 对象 | 否 | 无 | 子弹视觉样式（见下表） |

### bullet_style 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `model` | 字符串→资源路径对象 | **是** | — | 渲染资源。`"3d"`→模型路径，`"billboard"`→纹理路径。建议两者都提供 |
| `render_mode` | 字符串 | **是** | — | `"billboard"`（2D 精灵）或 `"3d"`（静态 3D 模型） |

**路径**：`data/examplemod/modularshoot/guns/assault_rifle.json`

```json
{
  "name": "§a突击步枪",
  "texture": "examplemod:textures/gun/assault_rifle.png",
  "shoot_texture": "examplemod:textures/gun/assault_rifle_shoot.png",
  "shoot_texture_mode": "while_firing",
  "stats": {
    "modularshoot:hit_damage": 8.0,
    "modularshoot:fire_rate": 10.0,
    "modularshoot:range": 60.0,
    "modularshoot:accuracy_yaw": 3.0,
    "modularshoot:accuracy_pitch": 3.5,
    "modularshoot:entity_penetration": 0,
    "modularshoot:bullet_speed": 50.0,
    "modularshoot:bullet_size": 0.2,
    "modularshoot:block_penetration": 0
  },
  "traits": {
    "examplemod:full_auto": true
  },
  "slots": {
    "examplemod:barrel": 1,
    "examplemod:magazine": 1,
    "examplemod:grip": 1
  },
  "sounds": {
    "shoot": "examplemod:gun.assault_rifle.shoot"
  },
  "bullet_style": {
    "model": {
      "3d": "examplemod:models/bullet/rifle_bullet.json",
      "billboard": "examplemod:textures/bullet/rifle_bullet.png"
    },
    "render_mode": "billboard"
  }
}
```

## 插件 JSON

**路径**：`data/<命名空间>/modularshoot/plugins/<插件id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | 否 | 无 | 显示名称，支持 `§` 颜色代码 |
| `tags` | 字符串数组 | 否 | `[]` | 匹配用标签列表（如 `["c:barrel", "examplemod:barrel"]`）。空数组时无法匹配任何种类 |
| `priority` | 整数 | 否 | `0` | 特性冲突优先级，越大越优先 |
| `item_icon` | 资源路径字符串 | **是** | — | 物品图标纹理路径 |
| `modifiers` | 对象数组 | 否 | `[]` | 属性修饰符列表（见下表） |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 安装后提供的特性覆盖 |
| `exclusive_group` | 字符串 | 否 | 无 | 互斥组 ID。同一枪上同组插件不可共存 |
| `bullet_style` | 对象 | 否 | 无 | 子弹样式覆盖（格式同枪械的 `bullet_style`）。**整体覆盖**非字段级合并 |
| `texture_overlay` | 对象 | 否 | 无 | 纹理叠加（见下表） |
| `brief` | 字符串 | 否 | 无 | 一行简介 |
| `description` | 字符串 | 否 | 无 | 多行详细描述 |
| `color` | 字符串 | 否 | 无 | 名称颜色（如 `"#FF4444"`） |

### modifiers 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `attribute` | 字符串 | **是** | — | 目标属性名。不带命名空间时默认 `modularshoot` 命名空间（如 `"fire_rate"` → `modularshoot:fire_rate`） |
| `operation` | 字符串 | **是** | — | `"add"`（加算）/ `"multiply"`（普通乘算）/ `"multiply_total"`（最终乘算） |
| `value` | 浮点数 | **是** | — | 修饰数值 |

### texture_overlay 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `texture` | 资源路径字符串 | **是** | — | 叠加图层纹理路径 |
| `layer` | 整数 | **是** | — | 层级，越大越靠上。同层级按安装顺序（后装覆盖先装） |

**路径**：`data/examplemod/modularshoot/plugins/rapid_barrel.json`

```json
{
  "name": "§c速射枪管",
  "tags": ["c:barrel", "examplemod:barrel"],
  "priority": 150,
  "item_icon": "examplemod:textures/plugins/rapid_barrel.png",
  "modifiers": [
    { "attribute": "fire_rate", "operation": "multiply", "value": 1.0 },
    { "attribute": "hit_damage", "operation": "multiply", "value": -0.2 },
    { "attribute": "accuracy_yaw", "operation": "multiply_total", "value": 0.3 }
  ],
  "traits": { "examplemod:rapid_fire": true },
  "exclusive_group": "group:barrel_type",
  "bullet_style": {
    "model": { "billboard": "examplemod:textures/bullet/fast_bullet.png" },
    "render_mode": "billboard"
  },
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/rapid_barrel_overlay.png",
    "layer": 10
  },
  "brief": "大幅提升射速，但伤害和精准度略有下降",
  "description": "安装后射速翻倍，但单发伤害降低 20%，散布增加 30%。",
  "color": "#FF4444"
}
```

**路径**：`data/examplemod/modularshoot/plugins/extended_mag.json`

```json
{
  "name": "§b扩容弹匣",
  "tags": ["c:magazine", "examplemod:magazine"],
  "priority": 100,
  "item_icon": "examplemod:textures/plugins/extended_mag.png",
  "modifiers": [
    { "attribute": "fire_rate", "operation": "add", "value": 2.0 }
  ],
  "exclusive_group": "group:mag_type",
  "brief": "增加弹容量",
  "color": "#44AAFF"
}
```

## 插件种类 JSON

**路径**：`data/<命名空间>/modularshoot/plugin_types/<种类id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | 否 | 无 | 种类显示名称 |
| `tags` | 字符串数组 | 否 | `[]` | 匹配用标签列表。空数组时无法匹配任何插件 |
| `priority` | 整数 | 否 | `0` | 显示优先级 + 安装自动选择二级排序键。**不影响插件特性冲突优先级** |
| `color` | 字符串 | 否 | 无 | 种类名称颜色（如 `"#FFAA00"`） |

**路径**：`data/examplemod/modularshoot/plugin_types/barrel.json`

```json
{
  "name": "枪管",
  "tags": ["c:barrel", "examplemod:barrel"],
  "priority": 10,
  "color": "#FFAA00"
}
```

**路径**：`data/examplemod/modularshoot/plugin_types/grip.json`

```json
{
  "name": "握把",
  "tags": ["c:grip", "examplemod:grip"],
  "priority": 30,
  "color": "#8888FF"
}
```

## 特性 JSON

**路径**：`data/<命名空间>/modularshoot/traits/<特性id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `default_value` | 布尔值 | **是** | — | 默认值。枪械未声明该特性时使用 |
| `name` | 字符串 | 否 | 无（回退到特性 ID 路径部分） | 显示名称，支持 `§` 和 `lang:` |
| `description` | 字符串 | 否 | `""` | 说明文本 |
| `color` | 字符串 | 否 | 无 | 名称颜色（如 `"#FF8800"`） |
| `brief` | 字符串 | 否 | 无 | 一行简介 |
| `force_show` | 布尔值 | 否 | `false` | 是否强制展示（无论值为何都显示在 tooltip） |
| `priority` | 整数 | 否 | `0` | 显示优先级，越大越靠前 |

**路径**：`data/examplemod/modularshoot/traits/ignite.json`

```json
{
  "default_value": false,
  "name": "子弹着火",
  "description": "命中时点燃目标",
  "color": "#FF8800",
  "brief": "命中时点燃目标 3 秒",
  "force_show": false,
  "priority": 10
}
```

## 属性元数据 JSON

**路径**：`data/<命名空间>/modularshoot/attribute_meta/<属性逻辑id>.json`

> 此表只登记元数据，**不创建属性本体**。属性本体须用原版 `DeferredRegister` 注册。

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `binds` | 资源路径字符串 | **是** | — | 指向已注册的原版 `Attribute` ID（如 `"minecraft:generic.max_health"`）。框架通过此字段定位 `Attribute` holder |
| `default_value` | 浮点数 | **是** | — | 枪械未声明该属性时的基础值（参与加算）。**非原版 base 值** |
| `description` | 字符串 | 否 | `""` | 说明文本 |
| `color` | 字符串 | 否 | `""` | 名称颜色 |
| `priority` | 整数 | 否 | `0` | 显示优先级 |
| `force_show` | 布尔值 | 否 | `false` | 是否强制展示 |

**路径**：`data/examplemod/modularshoot/attribute_meta/custom_recoil.json`

```json
{
  "binds": "examplemod:custom_recoil",
  "default_value": 5.0,
  "description": "自定义后坐力属性",
  "color": "#FF9944",
  "priority": 15,
  "force_show": true
}
```

**路径**：`data/examplemod/modularshoot/attribute_meta/hit_damage.json`

（覆盖框架预置属性的元数据——调整默认值和颜色）

```json
{
  "binds": "modularshoot:hit_damage",
  "default_value": 2.0,
  "color": "#FF2222",
  "priority": 0,
  "force_show": false
}
```

## 状态 JSON

**路径**：`data/<命名空间>/modularshoot/states/<状态id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `domain` | 字符串 | **是** | — | 归属域。`"gun"` / `"player"` / `"bullet"` |
| `value_type` | 字符串 | **是** | — | 值类型。`"int"` / `"long"` / `"double"` / `"float"` / `"boolean"` / `"string"` / `"uuid"` |
| `default_value` | 对应类型 | 否 | 对应类型零值 | 初始值，类型须与 `value_type` 匹配 |
| `display` | 对象 | **是** | — | 显示元数据（见下表） |

### display 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | **是** | — | tooltip 中状态名称。支持 `§` 和 `lang:` |
| `color` | 字符串 | **是** | — | 名称颜色（如 `"#FFAA00"`） |
| `format` | 字符串 | 否 | `"{value}"` | 显示模板，`{value}` 占位 |
| `priority` | 整数 | 否 | `0` | 显示排序，越大越靠前 |
| `hide_default` | 布尔值 | 否 | `false` | 值为默认值时不显示 |

**路径**：`data/examplemod/modularshoot/states/kill_count.json`

```json
{
  "domain": "gun",
  "value_type": "int",
  "default_value": 0,
  "display": {
    "name": "击杀层数",
    "color": "#FFAA00",
    "format": "{value} 层",
    "priority": 10,
    "hide_default": true
  }
}
```

**路径**：`data/examplemod/modularshoot/states/heat.json`

```json
{
  "domain": "gun",
  "value_type": "double",
  "default_value": 0.0,
  "display": {
    "name": "热量",
    "color": "#FF4400",
    "format": "{value} °C",
    "priority": 5,
    "hide_default": false
  }
}
```

**路径**：`data/examplemod/modularshoot/states/headshot_streak.json`

```json
{
  "domain": "player",
  "value_type": "int",
  "default_value": 0,
  "display": {
    "name": "连续爆头",
    "color": "#FFD700",
    "format": "{value} 连杀",
    "priority": 20,
    "hide_default": true
  }
}
```

**路径**：`data/examplemod/modularshoot/states/target_entity.json`

```json
{
  "domain": "bullet",
  "value_type": "uuid",
  "display": {
    "name": "锁定目标",
    "color": "#AA44FF",
    "priority": 0,
    "hide_default": true
  }
}
```

## 注册冲突与覆盖

| 场景 | 行为 |
|------|------|
| 同一 ID 同时存在于 Java API 和数据包 | Java API 优先，数据包注册被忽略，日志输出警告 |
| 同一 ID 出现在多个数据包中 | 数据包加载顺序靠后的覆盖靠前（遵循 `pack.mcmeta` 优先级） |
| Java API 注册后通过数据包覆盖 | 不支持。需在 Java 代码中通过 API 修改 |

## `/reload` 重载行为

- 重载后 JSON 定义即时更新，已发放物品的行为实时跟随新定义（因为始终从注册表实时读取）
- 物品上的 Data Component 字段（`gunId`、`pluginId` 等）不随 `/reload` 改变
- Java API 注册的条目不受 `/reload` 影响（不丢失）
- 创造模式标签页在重载后自动刷新
