# 数据包注册

通过数据包 JSON 注册内容，与 Java API 注册等价、共享同一注册表。`/reload` 可热重载 JSON 定义。

## 通用规则

- JSON 文件放在 `data/<命名空间>/modularshoot/<注册表路径>/<id>.json`
- 文件名为条目 ID（不含命名空间），命名空间由文件夹路径决定
- 所有资源路径字段使用完整命名空间格式（如 `modularshoot:textures/gun/rifle.png`）
- 可选字段省略时使用代码中注明的默认值
- `/reload` 后 JSON 定义即时生效，已发放物品的行为实时跟随新定义

**子弹伤害类型与击退约定**：子弹命中**不产生击退**。框架随包将 `modularshoot:bullet_damage` 加入 `minecraft:no_knockback` 伤害类型 tag（`data/minecraft/tags/damage_type/no_knockback.json`），原版 `hurt()` 据此跳过击退分支。若上层模组通过 `ammo_damage_type` 状态或 trait 钩子使用**自定义伤害类型**，该类型必须由所属模组同样加入 `minecraft:no_knockback` tag——否则会触发原版"零向量随机方向击退"兜底行为（多个数据包写入同一 tag 文件按 union 合并，追加安全）。需要子弹击退效果时应在伤害处理器/`onHit` 钩子中自行实现。

## 枪械 JSON

**路径**：`data/<命名空间>/modularshoot/guns/<枪械id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | 否 | 无（回退到枪械 ID 路径部分） | 显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `texture` | 资源路径字符串 | **是** | — | 基础纹理路径（如 `"modularshoot:textures/gun/rifle.png"`） |
| `shoot_texture` | 资源路径字符串 | 否 | 无 | 射击纹理路径。不指定时射击期间始终使用基础纹理 |
| `shoot_texture_mode` | 字符串 | 否 | `"per_shot"` | 射击纹理切换模式。`"per_shot"`（每次射击切纹理）/ `"while_firing"`（按住射击期间持续显示）。仅在指定了 `shoot_texture` 时生效 |
| `texture_scale` | 字符串 | 否 | `"auto"` | 渲染几何是否随纹理分辨率缩放。`"auto"`（16 像素 = 1 格，32×32 纹理渲染为 2 倍大，宽高分别缩放不变形，厚度固定 1/16 格）/ `"fixed"`（固定 16×16 单位网格，大纹理仅表现为更精细） |
| `stats` | 属性ID→浮点数对象 | 否 | `{}` | 属性基础值。键为属性 ID：裸键（无冒号）自动补 `modularshoot` 命名空间（如 `"hit_damage"` ≡ `"modularshoot:hit_damage"`），显式 `minecraft:` 前缀同样归一为 `modularshoot`，其他显式命名空间原样保留。不出现的属性使用元数据表默认值 |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 枪械固有特性覆盖。无特性时留空对象 `{}` |
| `variants` | 变体ID→浮点数对象 | 否 | `{}` | 变体池基础权重：变体 ID → 权重。如 `"variants": { "modularshoot:example_fireball": 0.5, "modularshoot:example_heavy_blade": 1.5 }`。每发射击实时组装池，与插件的 `adds_variants` 同变体求和，并经贡献者权重修饰符调整后加权随机选举（详见「变体 JSON」） |
| `extra_values` | 命名空间数字对象 | 否 | `{}` | 扩展数值字段：键为 ResourceLocation（须带命名空间）、值为数字。框架只承载并按 key 求和、不解释语义；`ModularShootAPI.getExtraValueSums` / `getExtraValue` 读取时与已安装插件累加值相加（枪械定义为基础值） |
| `slots` | 种类ID→整数对象 | 否 | `{}` | 插件插槽配置，键为插件种类 ID，值为插槽数量 |
| `sounds` | 字符串→资源路径对象 | 否 | `{}` | 音效绑定，键为槽位名、值为音效 ID。支持槽位：`shoot`（射击音效）、`hit_entity`/`hit_block`/`hit_pierce`（命中音效，随命中包下发客户端播放）、`plugin_install`（插件安装音效）；**未配置的槽位一律静音**。如 `"shoot": "modularshoot:gun.rifle.shoot"`（槽位详见下表） |
| `sound_range` | 浮点数 | 否 | 无（音效自带范围，默认 16 格） | 音效可闻半径覆盖（格）。未声明时由音效事件自带 range（默认 16 格）决定。如 `"sound_range": 24` |
| `bullet_style` | 对象 | 否 | 无 | 子弹视觉样式（见下表） |

**`sounds` 槽位说明**：

| 槽位 | 触发时机 | 播放方 | 未配置 |
|------|---------|--------|--------|
| `shoot` | 每次射击 | 服务端 | 静音 |
| `hit_entity` | 子弹命中实体 | 客户端（服务端解析 ID 随 `BulletHitS2CPacket` 下发） | 静音 |
| `hit_block` | 子弹命中方块 | 同上 | 静音 |
| `hit_pierce` | 子弹穿透命中 | 同上（当前无广播点，槽位预留） | 静音 |
| `plugin_install` | 插件安装成功 | 服务端（同步客户端） | 静音 |

> 槽位未配置一律静音——框架从不硬编码播放任何音效。客户端播放命中特效前 post `ClientBulletHitEvent`（可取消），供扩展模组取消或追加特效（见 API 参考/事件一览）。

### bullet_style 子字段

> **v2 结构（修饰符叠加）**：旧版的 `model` 对象 + `render_mode` 已废弃，替换为 `base` + `modifiers`。多个来源（枪械 / 插件 / 特性 / 状态条件）的修饰符会**叠加组合**而非整体覆盖。

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `base` | 对象 | 否 | 无 | 基础外观（见下）。缺失时使用框架默认贴图（`modularshoot:textures/bullet/default.png`） |
| `modifiers` | 对象数组 | 否 | `[]` | 修饰符列表（见下），同来源按声明顺序、跨来源按 枪械→插件（按安装序）→激活特性→状态条件 组合 |

### base 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `render_mode` | 字符串 | **是** | — | `"billboard"`（2D 精灵）或 `"3d"`（静态 3D 模型） |
| `texture` | 资源路径字符串 | 否 | 无 | billboard 模式纹理路径（3d 模式不填） |
| `model` | 资源路径字符串 | 否 | 无 | 3d 模式模型路径（billboard 模式不填） |

### modifiers 修饰符类型表

| `type` | 字段 | 合并规则 |
|--------|------|---------|
| `"scale"` | `value`（浮点数，>0） | **连乘**：所有来源的 scale 值相乘为最终视觉缩放。NaN/≤0 跳过并告警 |
| `"tint"` | `color`（数组 `[r,g,b]` 或 `[r,g,b,a]`，各通道 0~1） | **逐通道连乘**：所有来源的 tint 逐通道相乘。负/NaN 通道跳过并告警；>1 clamp 到 1 |
| `"attach_layer"` | `render_mode`/`texture`/`model`/`follow_rotation`/`follow_scale`/`offset`/`scale`/`tint` | **并行绘制**：独立层叠加在 base 之上，不参与 scale/tint 连乘；自身 scale/tint 只作用于本层 |

> 修饰符内的 `type` 若无法识别，该条会被跳过并记 WARN，**不会**导致整个列表解析失败。

### attach_layer 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `render_mode` | 字符串 | **是** | — | `"billboard"` 或 `"3d"` |
| `texture` | 资源路径字符串 | 否 | 无 | billboard 层纹理（3d 层不填） |
| `model` | 资源路径字符串 | 否 | 无 | 3d 层模型（billboard 层不填） |
| `follow_rotation` | 布尔值 | 否 | `false` | 是否随子弹飞行方向旋转（billboard 层恒朝相机，忽略此值） |
| `follow_scale` | 布尔值 | 否 | `true` | 是否继承 base 视觉缩放（`baseScale × scale`） |
| `offset` | 数值数组 | 否 | `[0,0,0]` | 相对 base 中心的位置偏移 `[x,y,z]` |
| `scale` | 浮点数 | 否 | `1.0` | 本层缩放 |
| `tint` | 数组 | 否 | `[1,1,1,1]` | 本层染色 |

> **v1 限制**：`attach_layer` 目前仅完整支持 `billboard` 层；`"3d"` 层暂不绘制（跳过并记 DEBUG 日志）。

**路径**：`data/examplemod/modularshoot/guns/assault_rifle.json`

```json
{
  "name": "§a突击步枪",
  "texture": "examplemod:textures/gun/assault_rifle.png",
  "shoot_texture": "examplemod:textures/gun/assault_rifle_shoot.png",
  "shoot_texture_mode": "while_firing",
  "texture_scale": "auto",
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
    "base": {
      "render_mode": "billboard",
      "texture": "examplemod:textures/bullet/rifle_bullet.png"
    },
    "modifiers": [
      { "type": "scale", "value": 1.2 },
      { "type": "tint", "color": [1.0, 0.9, 0.8] },
      { "type": "attach_layer", "render_mode": "billboard",
        "texture": "examplemod:textures/bullet/flame.png",
        "follow_scale": true, "offset": [0.0, 0.1, -0.3], "scale": 0.8 }
    ]
  }
}
```

## 插件 JSON

**路径**：`data/<命名空间>/modularshoot/plugins/<插件id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | 否 | 无 | 显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `tags` | 字符串数组 | 否 | `[]` | 匹配用标签列表（如 `["c:barrel", "examplemod:barrel"]`）。空数组时无法匹配任何种类 |
| `priority` | 整数 | 否 | `0` | 特性冲突优先级，越大越优先 |
| `item_icon` | 资源路径字符串 | **是** | — | 物品图标纹理路径 |
| `texture_scale` | 字符串 | 否 | `"auto"` | 图标渲染几何是否随纹理分辨率缩放，语义同枪械的 `texture_scale`（`"auto"` / `"fixed"`） |
| `modifiers` | 对象数组 | 否 | `[]` | 属性修饰符列表（见下表） |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 安装后提供的特性覆盖。键须带完整命名空间——裸键会静默落入 `minecraft` 命名空间（与枪械侧自动补 `modularshoot` 不对称） |
| `adds_variants` | 变体ID→浮点数对象 | 否 | `{}` | 追加进枪械变体池的基础权重。与枪械声明的同变体权重求和。如 `"adds_variants": { "modularshoot:example_fireball": 0.5 }`。键须带完整命名空间——裸键会静默落入 `minecraft` 命名空间（详见「变体 JSON」） |
| `exclusive_group` | 字符串 | 否 | 无 | 互斥组 ID。同一枪上同组插件不可共存 |
| `bullet_style` | 对象 | 否 | 无 | 子弹样式（格式同枪械的 `bullet_style`）。**叠加组合**：插件与枪械的 base 按 `visual_priority`（未声明时回退 `priority`；同值后装赢）选举出赢家，modifiers 全部叠加 |
| `visual_priority` | 整数 | 否 | 无（回退 `priority`） | 插件 `bullet_style` 的 base 参与视觉选举的专用优先级；未声明时回退 `priority`。同值按安装顺序后装赢 |
| `texture_overlay` | 对象 | 否 | 无 | 纹理叠加（见下表） |
| `gun_outline` | 对象 | 否 | 无 | 整枪描边：对合成结果（基础纹理 + 所有叠加图层）的轮廓描边。`{ "color": [r,g,b], "alpha": 0.9, "width": 3 }`。**多插件可叠加**：按 `width` 从宽到窄逐层绘制，形成同心嵌套的多层描边；同宽按安装顺序后装覆盖先装。静态描边颜色烘焙进合成纹理；如需**逐帧变色描边**（如彩虹），集成模组可在客户端以本插件 id 向 `DynamicOutlineTintRegistry` 注册 provider（数据包无需任何改动，见 API 文档）。**不受纹理边界限制**：描边绘制在轮廓外侧，即使纹理内容顶满 16×16 画布边缘，框架也会自动扩展画布，描边在物品正面、背面与侧面完整可见，无需在纹理中预留描边空间 |
| `extra_values` | 命名空间数字对象 | 否 | `{}` | 扩展数值字段：键为 ResourceLocation（须带命名空间）、值为数字。框架只承载并按 key 求和、不解释语义。集成模组可在插件安装/拆卸事件中经 `ModularShootAPI.getExtraValueSums` 读取枪械的 `extra_values` 总额（枪械定义基础值 + 已安装插件累加值），并翻译到自身系统（如稀有度核心写入稀有度组件） |
| `brief` | 字符串 | 否 | 无 | 一行简介，支持 `lang:` 翻译键前缀 |
| `description` | 字符串 | 否 | 无 | 多行详细描述，支持 `lang:` 翻译键前缀 |
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
| `alignment` | 字符串 | 否 | `"top_left"` | 九宫格对齐：`"top_left"` / `"top_center"` / `"top_right"` / `"center_left"` / `"center"` / `"center_right"` / `"bottom_left"` / `"bottom_center"` / `"bottom_right"`。仅 `fit` 为 `"none"` 时生效 |
| `fit` | 字符串 | 否 | `"none"` | 适配模式：`"none"`（不缩放，按对齐混合，超出画布部分被裁剪并输出 WARN）/ `"fill"`（拉伸铺满画布，宽高比不同会变形）/ `"contain"`（等比缩放至完整可见，居中留透明边） |
| `tint` | 浮点数数组 | 否 | `[1,1,1,1]` | RGBA 乘色：混合前对图层像素逐通道相乘（含透明度），白色恒等。如 `[1.0, 0.4, 0.3, 1.0]` 让图层泛红 |
| `blend` | 字符串 | 否 | `"normal"` | 颜色混合模式：`"normal"`（普通 alpha 覆盖）/ `"multiply"`（乘色加深）/ `"screen"`（滤色提亮）/ `"add"`（相加提亮，结果 clamp 到 1）。仅影响颜色通道，透明度始终按普通覆盖合成 |
| `outline` | 对象 | 否 | 无 | 图层描边：沿图层自身 alpha 边缘向外描边。`{ "color": [r,g,b], "alpha": 1.0, "width": 1 }`，`width` 为像素宽度（默认 1）。描边随图层一起摆放/缩放（`fill`/`contain` 时等比例缩放）；描边色不参与 `tint` |

**视觉增强示例**：`data/examplemod/modularshoot/plugins/ember_overlay.json`

```json
{
  "name": "§c枪械余烬",
  "tags": ["c:accessory"],
  "priority": 90,
  "item_icon": "examplemod:textures/plugins/ember.png",
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/ember_overlay.png",
    "layer": 5,
    "fit": "contain",
    "tint": [1.0, 0.4, 0.3, 1.0],
    "blend": "add",
    "outline": { "color": [1.0, 0.9, 0.4], "alpha": 1.0, "width": 1 }
  },
  "gun_outline": { "color": [1.0, 0.2, 0.1], "alpha": 0.9, "width": 3 }
}
```

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
    "base": { "render_mode": "billboard", "texture": "examplemod:textures/bullet/fast_bullet.png" },
    "modifiers": [ { "type": "scale", "value": 1.5 } ]
  },
  "texture_overlay": {
    "texture": "examplemod:textures/plugins/rapid_barrel_overlay.png",
    "layer": 10,
    "alignment": "center",
    "fit": "fill"
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
| `visual_modifiers` | 对象数组 | 否 | `[]` | 视觉修饰符列表（格式同 `bullet_style.modifiers`）。**特性激活时**这些修饰符叠加进子弹视觉组合；未激活不生效 |

**路径**：`data/examplemod/modularshoot/traits/ignite.json`

```json
{
  "default_value": false,
  "name": "子弹着火",
  "description": "命中时点燃目标",
  "color": "#FF8800",
  "brief": "命中时点燃目标 3 秒",
  "force_show": false,
  "priority": 10,
  "visual_modifiers": [
    { "type": "tint", "color": [1.0, 0.4, 0.2] }
  ]
}
```

## 属性元数据 JSON

**路径**：`data/<命名空间>/modularshoot/attribute_meta/<属性逻辑id>.json`

> 此表只登记元数据，**不创建属性本体**。属性本体须用原版 `DeferredRegister` 注册。

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `binds` | 资源路径字符串 | **是** | — | 指向已注册的原版 `Attribute` ID（如 `"minecraft:generic.max_health"`）。框架通过此字段定位 `Attribute` holder。**三路径共用**：挂载层（枪械基础值修饰符按此解析挂载目标）、结算层（射击结算、射速门禁、客户端预测、`/modularshoot stats` 与 debug 命令读值）、显示层（tooltip 取值）均经 `binds` 解析；可指向任意已注册属性（含 `minecraft:*`） |
| `default_value` | 浮点数 | **是** | — | 枪械未声明该属性时的基础值（参与加算）。**非原版 base 值** |
| `entity_types` | 实体类型 ID 数组 | 否 | `["minecraft:player"]` | **读取生效白名单**：只有列表内的实体类型，其属性值才会被框架读取；白名单外的实体类型读取时降级为 `0.0`。默认仅玩家（保持引入白名单前的行为）。挂载侧已把框架 10 个预置属性**预挂载到全部实体类型**（懒实例化，代价可忽略），因此本字段只控制"谁的属性值生效"，不控制"谁能挂载"——纯数据包改动即可切换生效范围，无需动代码。`shooters` 的 `attribute_binds` 同样受此白名单约束（见「发射者 JSON」） |
| `description` | 字符串 | 否 | `""` | 说明文本 |
| `color` | 字符串 | 否 | `""` | 名称颜色 |
| `priority` | 整数 | 否 | `0` | 显示优先级 |
| `force_show` | 布尔值 | 否 | `false` | 是否强制展示 |
| `unit` | 字符串 | 否 | 无 | 数值后显示的计量单位翻译键（如 `"modularshoot.unit.per_second"`）；缺省不显示 |

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

**路径**：`data/examplemod/modularshoot/attribute_meta/hit_damage.json`

（**重绑示例**——将逻辑属性 `hit_damage` 重绑到原版攻击力属性。与上一个示例同路径，实际部署时二选一）

```json
{
  "binds": "minecraft:attack_damage",
  "default_value": 10.0
}
```

> **效果**：持枪时玩家攻击伤害 = 原版 base（1.0）+ 枪械伤害（10.0）= **11 点**，射击结算同样读到此值；卸枪后修饰符移除、攻击伤害恢复原版 base；持枪近战攻击也会同步提升（特性，非缺陷）。

> **注意事项**：
> - **base 偏移约定**：绑定到非零 base 属性时，结算值为"属性 base + 修饰符净额"。如重绑到 `minecraft:attack_damage`（玩家 base = 1.0）后，结算 = 1.0 + 枪械伤害。框架**不自动校准**，数据包作者需用 `default_value` 或枪械 `stats` 补偿
> - **近战副作用**：修饰符挂到 `minecraft:attack_damage` 后，持枪近战伤害同步提升（特性，非缺陷）
> - **syncable 约定**：绑定目标建议为 syncable 属性（客户端预测与 tooltip 需要同步值）；非 syncable 时客户端读到 0.0，客户端射速预测**静默禁用**（不影响服务端）
> - **新增即插即用，删除即禁用**：数据包新增任意逻辑 id 的 attribute_meta 条目后，枪械 `stats` 自动支持该键（不限于预置 10 属性）；删除条目会禁用该逻辑属性的挂载与结算（读值 0.0）
> - **避免多条目绑定同一属性**：基础修饰符共用固定 ID（`modularshoot:gun_base`），同属性多条目互相覆盖且胜者无稳定保证
> - **降级契约不变**：`binds` 目标未注册 → 元数据条目保留、修饰符不挂载、tooltip 不显示、读值 0
> - **生效范围由数据包控制**：挂载侧已把框架 10 个预置属性预挂载到**全部**实体类型（懒实例化），`entity_types` 决定"谁的属性值被读取"——白名单外实体读取 `0.0`，纯数据包改动即可切换生效范围。玩家始终显式优先挂载。第三方属性只挂载于玩家（框架只预挂载自己的属性），`entity_types` 命中非玩家实体时若该属性未挂载到目标实体，读取同样降级 `0.0`

## 发射者 JSON（shooters）

**路径**：`data/<命名空间>/modularshoot/shooters/<发射者id>.json`

**发射者定义**（`ShooterDefinition`）是独立发射（炮塔、陷阱、Boss 攻击、脚本场景等非玩家发射源）的**配置模板**：给定一份数值模板，内容模组在发射时从源实体实时读取属性值覆盖上去，生成子弹快照交给 `ModularShootAPI.fireBullet`。注册表键（发射者 ID）由注册表本身提供，不是 JSON 字段。

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `stats` | 属性ID→浮点数对象 | **是** | —（**非空**，空模板/空对象使整个条目加载失败，报错 `stats must not be empty`） | 快照数值模板：逻辑属性 ID → 基础值。**键须带完整命名空间**（如 `"modularshoot:hit_damage"`）——与枪械 `stats` 不同，这里不自动补 `modularshoot` 命名空间，裸键会导致解析失败 |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 快照固有特性标志（如 `"examplemod:ignite": true`）。键同样须带完整命名空间 |
| `bullet_style` | 对象 | 否 | 无 | 独立发射视觉样式，结构同枪械的 `bullet_style`（`base` + `modifiers`）。缺失时 compose 阶段使用框架默认子弹外观 |
| `shoot_sound` | 对象 | 否 | 无 | 发射音效（见下表）。缺失时静音 |
| `attribute_binds` | 资源路径字符串数组 | 否 | `[]` | 属性绑定列表：快照生成时逐项从**源实体**实时读取该逻辑属性的最终值，**覆盖**模板对应条目（允许引入模板没有的新键，与 `extra_values` 约定一致）；读取为空则**保留模板值**。读取条件见下方「createSnapshot 语义」 |

**shoot_sound 子字段**（`ShootSound` record）：

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `id` | 资源路径字符串 | **是** | — | 已注册的音效事件 ID（如 `"minecraft:entity.skeleton.shoot"`）。未注册时播放跳过并记 WARN |
| `volume` | 浮点数 | 否 | `1.0` | 播放音量 |
| `pitch` | 浮点数 | 否 | `1.0` | 播放音调 |

**createSnapshot 语义**（`ShooterDefinition.createSnapshot(LivingEntity source, RegistryAccess registryAccess)`）：

- 以 `stats` 模板为起点，按声明顺序逐项处理 `attribute_binds`：**读取到值就覆盖**模板条目（或引入新键），**读不到就保留模板值**
- 读取失败的三种情形（均保留模板值）：`source` 为 `null`（无源实体）；`attribute_meta` 中无该逻辑属性条目（记 WARN）；源实体类型不在该条目 `entity_types` 白名单内
- 产物快照遵循独立发射约定（`gunId`/`gunInstanceUuid`/`shooter` 均 `null`），伤害类型留空（`null`）——由 `ModularShootAPI.fireBullet` 门面在发射时补默认
- 音效**不随发射自动播放**（`fireBullet` 不播音效）：需要时由内容模组调用 `playShootSound(Level, Vec3)` 在发射位置播放（未声明 `shoot_sound` 则静默跳过）

**冲突与降级口径**：

- 与 `registerShooter`（Java API）同名 → Java API 优先，数据包条目忽略并 WARN（与 `registerGun` 同一条注册冲突机制）
- `attribute_binds` 中的 ID 未注册（`attribute_meta` 无条目）→ WARN，**保留模板值**
- `shoot_sound.id` 未在 `SOUND_EVENT` 注册表 → WARN，跳过播放
- 空 `stats` → 整个条目加载失败（作者错误，非降级）

**路径**：`data/modularshoot/modularshoot/shooters/example_bone_shooter.json`（框架随包示例：骷髅发射者——数值模板 + 独立视觉）

```json
{
  "stats": {
    "modularshoot:hit_damage": 6.0,
    "modularshoot:bullet_speed": 2.5,
    "modularshoot:range": 48.0,
    "modularshoot:bullet_size": 0.25
  },
  "bullet_style": {
    "base": {
      "render_mode": "billboard",
      "texture": "modularshoot:textures/bullet/default.png"
    }
  }
}
```

**完整字段示例**（`data/examplemod/modularshoot/shooters/boss_turret.json`）：

```json
{
  "stats": {
    "modularshoot:hit_damage": 12.0,
    "modularshoot:bullet_speed": 40.0,
    "modularshoot:range": 96.0,
    "modularshoot:bullet_size": 0.4
  },
  "traits": {
    "examplemod:ignite": true
  },
  "bullet_style": {
    "base": {
      "render_mode": "billboard",
      "texture": "examplemod:textures/bullet/boss_fireball.png"
    },
    "modifiers": [
      { "type": "scale", "value": 1.5 },
      { "type": "tint", "color": [1.0, 0.4, 0.1] }
    ]
  },
  "shoot_sound": {
    "id": "minecraft:entity.blaze.shoot",
    "volume": 0.8,
    "pitch": 1.2
  },
  "attribute_binds": [
    "examplemod:boss_power"
  ]
}
```

> 上例中 `examplemod:boss_power` 须先在 `attribute_meta` 中登记（含 `entity_types` 白名单）；Boss 实体发射时若其类型在白名单内，快照的 `modularshoot:hit_damage` 会被 Boss 的 `boss_power` 实时属性值覆盖，否则保留模板值 `12.0`。

## 变体 JSON

**路径**：`data/<命名空间>/modularshoot/variants/<变体id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `base_weight` | 浮点数 | 否 | `0.0` | 基础权重兜底。仅当枪械/插件都未声明该变体时使用（典型场景：仅由 `registerVariantContributor` 引入的变体）；已被枪械/插件声明的变体以声明权重为权威 |
| `traits` | 特性ID→布尔值对象 | 否 | `{}` | 选中后**合并**进快照：声明的特性值写入，未声明键保留原值 |
| `stats` | 属性ID→数值对象 | 否 | `{}` | 选中后**只覆盖声明键**（不整体替换快照属性表） |
| `damage_type` | 资源路径字符串 | 否 | 无 | 选中后覆盖 `ammo_damage_type` 预设（变体优先） |
| `bullet_style_override` | 对象 | 否 | 无 | 视觉覆盖，格式同 `bullet_style`（base + modifiers）。base 以最高优先级参与视觉组合选举（胜过枪械/插件/特性/状态条件），modifiers 照常叠加；仅服务端 compose 读取，不序列化到客户端 |

**权重来源（每发射击实时组装，不持久化）**：

| 来源 | 位置 | 合并规则 |
|------|------|---------|
| 枪械声明 | 枪械 JSON `variants` | 基础权重 |
| 插件声明 | 插件 JSON `adds_variants` | 与枪械同变体**求和** |
| 贡献者修饰符 | `registerVariantContributor` 经 `sink.add` 声明的 `AttributeModifier` | 原版三阶段：`ADD_VALUE` 加算 → `ADD_MULTIPLIED_BASE` 乘「基础 + ADD_VALUE」 → `ADD_MULTIPLIED_TOTAL` 乘整体 |
| 默认普通弹兜底 | 隐式（不写入任何 JSON） | 枪械**未声明** `variants` 时，池中默认存在权重 `1.0` 的"普通子弹"候选，参与概率计算 |

> 零基础且无加值时权重恒为 0——"火元素饰品对非火枪无效"。最终权重 ≤ 0 的变体不参与选举。

> **兜底原因**：若无兜底，"普通枪 + 50% 火球插件"（`adds_variants: 1.0`）会因池中只有火球一个候选而恒 100% 触发——插件概率语义失真；兜底后该场景池 = {火球 1.0, 普通弹 1.0} → 火球恰 50%。**声明了 `variants` 的枪械无兜底**，概率严格按声明权重计算。

**概率换算（开发者速查）**：权重是**相对比例**，没有固定的"多少权重 = 50%"——实际概率取决于整池总权重：

- `P(变体X) = X 的最终权重 ÷ 池总权重`。池总权重 = 所有正权重候选的最终权重之和（枪械未声明 `variants` 时含普通弹兜底 `1.0`）
- 单候选池恒 100%（无论权重多少）；两候选池权重相等（如 `1 : 1`）时各 50%
- 某变体概率 50% ⟺ 其权重 = 其余所有候选权重之和

示例：普通枪（未声明 `variants`）+ 火球插件 `adds_variants: 1.0` → 池 {火球 1.0, 普通弹 1.0} → 火球恰 50%；若枪械声明 `"variants": { "modularshoot:example_fireball": 0.5, "modularshoot:example_heavy_blade": 1.5 }` → 池总权重 2.0 → 火球 25%。最终权重 = 基础权重经三阶段计算（`ADD_VALUE` 加算 → `ADD_MULTIPLIED_BASE` 乘「基础 + ADD_VALUE」→ `ADD_MULTIPLIED_TOTAL` 乘整体），受 `registerVariantContributor` 修饰符影响。

> **插件描述规范**：插件 JSON 的 `description`（玩家 tooltip 可见）不要写裸权重数值，应写算好的概率或定性描述（如"火球出现概率大幅提升"）。随包插件 `modularshoot:fragment_fire` 已示范（其 `description` 经 `lang:` 解析为"子弹染上烈焰，火球出现概率大幅提升"）。

**逐弹丸语义**：变体对每颗弹丸**独立 roll**（一次选举只作用于本颗），霰弹中可混合出现不同变体或普通弹；权重全 0 或空池时本颗静默退化为普通弹。互斥单值字段（`damage_type` / 视觉 `base`）必须走变体池；可叠加效果走 `registerShootEffect`。

> **随包多弹丸演示**：枪械 `modularshoot:blood_sword` 的 `stats` 含 `"modularshoot:pellet_count": 5.0`（单发射 5 颗弹丸，每颗独立 roll）；火球插件 `modularshoot:fragment_fire` 通过 `adds_variants` 向变体池追加 `"modularshoot:example_fireball": 0.5`——装在未声明 `variants` 的 `blood_sword` 上时池 = {火球 0.5, 普通弹 1.0} → 火球 ≈ 33%；`modularshoot:composite_cane` 则直接声明 `"variants": { "modularshoot:example_fireball": 0.5 }`（声明即权威、无普通弹兜底，单候选池恒 100%）。

**路径**：`data/modularshoot/modularshoot/variants/example_fireball.json`（框架随包演示：高伤害 + 火焰伤害类型 + 火球视觉）

```json
{
  "base_weight": 0.0,
  "stats": { "modularshoot:hit_damage": 15.0 },
  "damage_type": "minecraft:in_fire",
  "bullet_style_override": {
    "base": { "render_mode": "billboard", "texture": "modularshoot:textures/bullet/default.png" },
    "modifiers": [
      { "type": "tint", "color": [1.0, 0.4, 0.1, 1.0] },
      { "type": "scale", "value": 1.3 }
    ]
  }
}
```

**路径**：`data/modularshoot/modularshoot/variants/example_heavy_blade.json`（随包演示：重刃——覆盖伤害与弹体尺寸，带暗红视觉）

```json
{
  "base_weight": 0.0,
  "stats": { "modularshoot:hit_damage": 18.0, "modularshoot:bullet_size": 0.75 },
  "bullet_style_override": {
    "base": { "render_mode": "billboard", "texture": "modularshoot:textures/bullet/default.png" },
    "modifiers": [
      { "type": "tint", "color": [0.75, 0.1, 0.1, 1.0] },
      { "type": "scale", "value": 1.5 }
    ]
  }
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
| `visual_modifiers` | 对象数组 | 否 | `[]` | 条件视觉修饰符（见下表）。**条件成立时**这些修饰符在子弹创建瞬间叠加进视觉组合 |

### visual_modifiers 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `condition` | 对象 | **是** | — | 启用条件（见下） |
| `modifiers` | 对象数组 | **是** | — | 条件成立时应用的修饰符（格式同 `bullet_style.modifiers`） |

### condition 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `state` | 资源路径字符串 | **是** | — | 要检查的状态 ID（须带命名空间，如 `"modularshoot:killstreak"`） |
| `domain` | 字符串 | 否 | 自动解析 | 显式指定取值来源：`"bullet"`（子弹状态）或 `"gun"`（枪械状态）。省略时先查子弹状态、再查枪械状态。`"player"` 不支持 |
| `op` | 字符串 | **是** | — | 比较操作符：`">="` / `"<="` / `"=="` / `">"` / `"<"`。布尔/字符串状态仅支持 `"=="` |
| `value` | 对应类型 | **是** | — | 阈值（数字/布尔/字符串）。UUID 状态不支持条件判定 |

### display 子字段

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | **是** | — | tooltip 中状态名称。支持 `§` 和 `lang:` |
| `color` | 字符串 | 否 | `""` | 名称颜色（如 `"#FFAA00"`）。可选，省略时使用默认 tooltip 颜色 |
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
  },
  "visual_modifiers": [
    {
      "condition": {
        "state": "modularshoot:killstreak",
        "domain": "bullet",
        "op": ">=",
        "value": 3
      },
      "modifiers": [
        { "type": "tint", "color": [1.0, 0.2, 0.2] },
        { "type": "scale", "value": 1.2 }
      ]
    }
  ]
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

## 物品绑定 JSON（gun_items / plugin_items）

**路径**：`data/<命名空间>/modularshoot/gun_items/<任意条目id>.json` / `modularshoot/plugin_items/<任意条目id>.json`

把**其他模组的物品**绑定为框架枪械/插件——绑定后该物品 ID 的所有实例被框架识别为枪械/插件，**原物品保留**（模型/纹理/获取途径不变）。条目键为任意文件 id，内容声明绑定目标；两个字段均必填。

| JSON 键 | 类型 | 必需 | 说明 |
|---------|------|------|------|
| `item` | 资源路径 | **是** | 被绑定的物品 ID（如 `minecraft:diamond_sword`） |
| `gun` | 资源路径 | **是**（gun_items） | 目标枪械定义 ID（`modularshoot:guns` 注册表条目） |
| `plugin` | 资源路径 | **是**（plugin_items） | 目标插件定义 ID（`modularshoot:plugins` 注册表条目） |

**路径**：`data/examplemod/modularshoot/gun_items/diamond_sword_rifle.json`

```json
{
  "item": "minecraft:diamond_sword",
  "gun": "examplemod:sword_rifle"
}
```

**路径**：`data/examplemod/modularshoot/plugin_items/life_amulet.json`

```json
{
  "item": "examplemod:life_amulet",
  "plugin": "examplemod:life_amulet_plugin"
}
```

**加载后校验**（WARN 降级，条目保留）：

- `item` 必须存在于物品注册表，缺失 → WARN
- `gun`/`plugin` 必须存在于对应定义表，缺失 → WARN（枪械定义缺失时表现为"无法射击" + 降级提示）
- 同一物品 ID 出现多个绑定 → 字典序最小条目键胜出，其余 WARN
- 与 Java API 绑定冲突（`registerGunItem`/`registerPluginItem`）→ Java API 优先，数据包条目 WARN

**行为要点**：

- **进背包即生效**：绑定枪械进入玩家背包 1 tick 内由服务端自动附加 `gun_data` 组件（含实例 UUID 与基础属性修饰符），附加后与原生枪械运行时完全同构——装插件、锁定、状态持久化、弹道回溯全部一致；无需持握
- **插件不附加组件**：绑定插件安装即消耗，pluginId 直接经绑定表解析
- **完全改造**：绑定枪械左键近战由射击替代、附魔无效化、射击不损耗耐久；副手限制、换弹键、调试命令、tooltip 全部自动生效
- **身份提示**：未转化的绑定枪械 tooltip 显示 `枪械: <id>` 标识行 + 定义中注册的基础属性/插槽预览；已转化的显示完整运行时四栏
- **主菜单限制**：数据包绑定在主菜单创造物品栏无提示（注册表未加载）；Java API 绑定无此限制
- **视觉**：保持原物品模型渲染；动态贴图管线（调色/叠加/描边/射击纹理切换）仅服务原生枪械

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
