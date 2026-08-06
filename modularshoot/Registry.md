# 注册表参考

ModularShoot 通过 7 张动态注册表（DataPackRegistry）存储所有定义。全部支持 `/reload` 热重载和客户端同步。


## 注册表概览

| 注册表 ID | 用途 | 值类型 |
|-----------|------|--------|
| `modularshoot:guns` | 枪械定义 | `GunDefinition` |
| `modularshoot:plugins` | 插件定义 | `PluginDefinition` |
| `modularshoot:plugin_types` | 插件种类定义 | `PluginTypeDefinition` |
| `modularshoot:traits` | 布尔特性定义 | `Trait` |
| `modularshoot:attribute_meta` | 属性元数据 | `AttributeMeta` |
| `modularshoot:states` | 持久状态定义 | `StateDefinition` |
| `modularshoot:variants` | 随机变体定义 | `VariantDefinition` |

> 属性**本体**（`Attribute` 实例）不在上述动态注册表中——须用原版 `DeferredRegister` 注册到 `BuiltInRegistries.ATTRIBUTE`。元数据表仅存储默认值、显示信息和绑定关系。

## 枪械定义（GunDefinition）

注册表：`modularshoot:guns`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | 可选字符串 | 否 | 无（回退到枪械 ID 路径部分） | 显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `texture` | 资源路径 | **是** | — | 枪械基础纹理路径，原版物品渲染管线立体化处理 |
| `shootTexture` | 可选资源路径 | 否 | 无（始终使用基础纹理） | 射击时切换的纹理路径 |
| `shootTextureMode` | 枚举 | 否 | `PER_SHOT` | 射击纹理切换模式。仅在指定了 `shootTexture` 时生效 |
| `textureScale` | 枚举 | 否 | `AUTO` | 渲染几何是否随纹理分辨率缩放。`AUTO`（16 像素 = 1 格，32×32 纹理渲染为 2 倍大）/ `FIXED`（固定 16×16 单位网格）。基础纹理与射击纹理分别按各自尺寸缩放 |
| `stats` | 属性ID→浮点数映射 | 否 | 空映射 | 属性基础值。键必须带完整命名空间（如 `modularshoot:hit_damage`）。未声明的属性使用元数据表的默认值 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 枪械固有特性覆盖。枪械声明的特性始终覆盖所有插件 |
| `variants` | 变体ID→浮点数映射 | 否 | 空映射 | 变体池基础权重：变体 ID → 基础权重。每发射击实时组装变体池，与插件 `addsVariants` 同变体求和，并经贡献者权重修饰符调整后加权随机选举（详见「变体定义（VariantDefinition）」） |
| `slots` | 种类ID→整数映射 | 否 | 空映射 | 插件插槽配置，键为插件种类 ID，值为插槽数量 |
| `sounds` | 字符串→资源路径映射 | 否 | 空映射 | 音效绑定。预置槽位 `shoot`（射击声），可自定义槽位名称 |
| `bulletStyle` | 可选子弹样式 | 否 | 无（回退框架默认外观 `ComposedBulletStyle.FALLBACK_BASE`，billboard + 默认纹理） | 子弹视觉外观配置 |

### 子弹样式（BulletStyle）

> **v2 结构（修饰符叠加）**：旧版的 `model` 对象 + `render_mode` 已废弃，替换为 `base` + `modifiers`。多个来源（枪械 / 插件 / 特性 / 状态条件）的修饰符会**叠加组合**而非整体覆盖。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `base` | 可选对象 | 否 | 无 | 基础外观（见下）。缺失时回退框架默认外观（billboard + 默认纹理） |
| `modifiers` | 可选列表 | 否 | 空列表 | 叠加修饰符（见下），按 `"type"` 分发；未知 type 容忍解码为 `UnsupportedModifier` 哨兵，不导致整个列表解析失败 |

`base` 子字段：

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `render_mode` | 枚举 | **是** | — | 渲染模式：`BILLBOARD`（始终面向玩家的 2D 精灵）或 `THREE_D`（原版静态 3D 模型） |
| `texture` | 可选资源路径 | 否 | 无 | billboard 模式纹理路径（3d 模式不填） |
| `model` | 可选资源路径 | 否 | 无 | 3d 模式模型路径（billboard 模式不填）。`texture` / `model` 二选一 |

`modifiers` 修饰符类型表：

| `type` | 字段 | 合并规则 |
|--------|------|---------|
| `scale` | `value`（浮点数，>0） | **连乘**：所有来源的 scale 值相乘为最终视觉缩放。NaN/≤0 跳过并告警 |
| `tint` | `color`（数组 `[r,g,b]` 或 `[r,g,b,a]`，各通道 0~1） | **逐通道连乘**：所有来源的 tint 逐通道相乘。负/NaN 通道跳过并告警；>1 clamp 到 1 |
| `attach_layer` | `render_mode`/`texture`/`model`/`follow_rotation`/`follow_scale`/`offset`/`scale`/`tint` | **并行绘制**：独立层叠加在 base 之上，不参与 scale/tint 连乘；自身 scale/tint 只作用于本层 |

### 射击纹理模式（ShootTextureMode）

| 枚举值 | 说明 |
|--------|------|
| `PER_SHOT` | 每次射击瞬间切换到射击纹理，之后立即切回基础纹理。高速射击时纹理高频闪烁 |
| `WHILE_FIRING` | 按住左键射击期间持续显示射击纹理，松开后切回。适合连发枪械，避免闪烁 |

## 插件定义（PluginDefinition）

注册表：`modularshoot:plugins`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tags` | 资源路径列表 | 否 | 空列表 | 匹配用标签。与种类 tags 存在交集即可安装。空列表时无法安装（输出 WARN） |
| `priority` | 整数 | 否 | `0` | 特性冲突优先级，越大越优先。不继承种类优先级 |
| `itemIcon` | 资源路径 | **是** | — | 插件在背包/快捷栏中的图标纹理路径 |
| `textureScale` | 枚举 | 否 | `AUTO` | 图标渲染几何是否随纹理分辨率缩放，语义同枪械的 `textureScale`（`AUTO` / `FIXED`） |
| `modifiers` | 修饰符列表 | 否 | 空列表 | 属性修饰符数组，安装后叠加到枪械属性 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 安装后提供的特性覆盖 |
| `addsVariants` | 变体ID→浮点数映射 | 否 | 空映射 | 追加进枪械变体池的基础权重。安装后与枪械声明的同变体权重求和（详见「变体定义（VariantDefinition）」） |
| `exclusiveGroup` | 可选字符串 | 否 | 无 | 互斥组 ID。同一枪上不能安装两个互斥组 ID 相同的插件 |
| `bulletStyle` | 可选子弹样式 | 否 | 无 | 子弹样式叠加。安装后与枪械的样式**叠加组合**：base 按 priority 选举（同 priority 后装赢，无候选回退框架默认外观），modifiers 全部叠加（scale 连乘、tint 逐通道连乘、attach_layer 全部保留） |
| `textureOverlay` | 可选纹理叠加 | 否 | 无 | 纹理叠加信息。安装后在枪械纹理上叠加图层 |
| `gunOutline` | 可选描边规格 | 否 | 无 | 整枪描边规格（见下文「描边规格（OutlineSpec）」）。安装后围绕枪械合成纹理的最终轮廓描边，多插件按宽度从宽到窄同心嵌套 |
| `extraValues` | 命名空间数字映射 | 否 | 空映射 | 扩展数值字段：键为 ResourceLocation、值为数字。框架只承载与按 key 求和（经 `ModularShootAPI.getExtraValueSums` / `getExtraValue` 读取），不解释语义，供集成模组携带自定义数值（如稀有度值）并在插件安装/拆卸事件中累加到枪械上 |
| `name` | 可选字符串 | 否 | 无 | 插件显示名称，支持 `§` 颜色代码 |
| `brief` | 可选字符串 | 否 | 无 | 一行简介，tooltip 默认层级显示 |
| `description` | 可选字符串 | 否 | 无 | 多行详细描述，tooltip Shift 层级显示 |
| `color` | 可选字符串 | 否 | 无 | 插件名称颜色（如 `#FF4444`） |

### 修饰符（PluginModifier）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `attribute` | 字符串 | **是** | — | 目标属性名。若不带命名空间，自动使用 `modularshoot` 命名空间 |
| `operation` | 枚举 | **是** | — | 运算类型。`ADD`（加算）、`MULTIPLY`（普通乘算）、`MULTIPLY_TOTAL`（最终乘算） |
| `value` | 浮点数 | **是** | — | 修饰数值 |

### 纹理叠加（TextureOverlay）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `texture` | 资源路径 | **是** | — | 叠加到枪械纹理上的图层纹理路径 |
| `layer` | 整数 | **是** | — | 层级，越大越靠上。同层级按安装顺序（后装覆盖先装） |
| `alignment` | 枚举 | 否 | `TOP_LEFT` | 九宫格对齐：`TOP_LEFT` / `TOP_CENTER` / `TOP_RIGHT` / `CENTER_LEFT` / `CENTER` / `CENTER_RIGHT` / `BOTTOM_LEFT` / `BOTTOM_CENTER` / `BOTTOM_RIGHT`。仅 `fit` 为 `NONE` 时生效 |
| `fit` | 枚举 | 否 | `NONE` | 适配模式：`NONE`（不缩放，按对齐混合，超出画布的部分被裁剪并输出 WARN）/ `FILL`（双线性插值拉伸铺满画布，宽高比不同会变形）/ `CONTAIN`（等比缩放至完整可见，居中留透明边） |

### 描边规格（OutlineSpec）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `color` | RGB 浮点数组 | **是** | — | 描边颜色，三元素 0-1 浮点数组（如 `[1.0, 0.2, 0.1]`） |
| `alpha` | 浮点数 | 否 | `1.0` | 描边透明度 |
| `width` | 整数 | 否 | `1` | 描边宽度（像素）。多插件描边按宽度从宽到窄同心嵌套，同宽后安装覆盖先安装 |

**动态描边（逐帧变色）**：描边颜色默认在合成时烘焙为静态色。集成模组若需逐帧变色，可在**客户端初始化**时向 `DynamicOutlineTintRegistry` 以插件 id 为键注册 `GunOutlineTintProvider`（函数式接口 `(ItemStack, float partialTick) → Vector4f RGBA`）：

```java
// 客户端初始化（如 @Mod(Dist.CLIENT) 构造函数）
DynamicOutlineTintRegistry.register(
    ResourceLocation.parse("examplemod:prismatic_core"),
    (stack, partialTick) -> /* 每帧颜色，如色相随时间旋转的彩虹 */);
```

渲染时凡安装该插件的枪械，其描边逐帧取 provider 颜色（白色描边遮罩 × 每帧 tint，缓存纹理无需重建）；未注册 provider 的描边保持静态烘焙色。框架内置演示插件 `modularshoot:visual_gun_prism`（彩虹描边）。

## 插件种类定义（PluginTypeDefinition）

注册表：`modularshoot:plugin_types`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tags` | 资源路径列表 | 否 | 空列表 | 匹配用标签。与插件 tags 存在交集即可安装。空列表时无法匹配任何插件（输出 WARN） |
| `priority` | 整数 | 否 | `0` | 显示优先级（tooltip 中种类排序）+ 安装自动选择的二级排序键。**不影响插件特性冲突优先级** |
| `name` | 可选字符串 | 否 | 无 | 种类显示名称 |
| `color` | 可选字符串 | 否 | 无 | 种类名称颜色（如 `#FFAA00`） |

## 特性定义（Trait）

注册表：`modularshoot:traits`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `defaultValue` | 布尔值 | **是** | — | 特性默认值，枪械未声明该特性时使用 |
| `description` | 字符串 | 否 | `""`（空字符串） | 说明文本 |
| `name` | 可选字符串 | 否 | 无（回退到特性 ID 路径部分） | 特性显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `color` | 可选字符串 | 否 | 无 | 特性名称颜色（如 `#FF8800`） |
| `brief` | 可选字符串 | 否 | 无 | 一行简介，tooltip Alt 层级显示 |
| `forceShow` | 布尔值 | 否 | `false` | 是否强制展示。`true` 时无论特性值为何都在 tooltip 显示 |
| `priority` | 整数 | 否 | `0` | 显示优先级，越大越靠前 |
| `visual_modifiers` | Modifier 列表 | 否 | 空列表 | 视觉修饰符列表（格式同 `bullet_style.modifiers`）。**特性激活时**这些修饰符叠加进子弹视觉组合；未激活不生效 |

> 运行时行为（钩子回调）不存储在 Trait 定义中，需通过 `registerTraitHook` API 单独注册。

## 属性元数据（AttributeMeta）

注册表：`modularshoot:attribute_meta`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `binds` | 资源路径 | **是** | — | 指向已注册的原版 `Attribute` ID。框架通过此字段定位 `Attribute` holder 参与修饰符挂载。预置属性的逻辑 ID 与本体 ID 一致，`binds` 指向自身 |
| `defaultValue` | 浮点数 | **是** | — | 枪械未声明该属性时的基础值（参与 ADD_VALUE 计算）。可热重载。**非原版 Attribute 的 base 值**（后者恒为 0） |
| `description` | 字符串 | 否 | `""`（空字符串） | 说明文本 |
| `color` | 字符串 | 否 | `""`（空字符串） | 属性名称颜色（如 `#FF4444`） |
| `priority` | 整数 | 否 | `0` | 显示优先级，越大越靠前 |
| `forceShow` | 布尔值 | 否 | `false` | 是否强制展示。`true` 时即使值与默认值相同也在 tooltip 显示 |

> `binds` 指向的属性未注册时：元数据条目保留，但修饰符不挂载、tooltip 不显示、读取返回 0。

## 变体定义（VariantDefinition）

注册表：`modularshoot:variants`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `weightHint` | 浮点数 | 否 | `0.0` | 基础权重兜底。仅当枪械/插件都未声明该变体时使用（典型场景：仅由 `registerVariantContributor` 引入的变体）；已被枪械/插件声明的变体以声明权重为权威 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 选中后**合并**进快照：声明的特性值写入，未声明键保留原值 |
| `stats` | 属性ID→数值映射 | 否 | 空映射 | 选中后**只覆盖声明键**（不整体替换快照属性表） |
| `damageType` | 可选资源路径 | 否 | 无 | 选中后覆盖 `ammo_damage_type` 预设（变体优先） |
| `bulletStyleOverride` | 可选子弹样式 | 否 | 无 | 视觉覆盖，格式同 `bulletStyle`（base + modifiers）。base 以最高优先级参与视觉组合选举（胜过枪械/插件/特性/状态条件），modifiers 照常叠加；仅服务端 compose 读取，不序列化到客户端 |

**权重语义（三来源）**：变体池每发射击**实时组装**（不持久化），三种来源合并后按加权随机选举：

1. 枪械定义 `variants` 声明的基础权重
2. 已安装插件的 `addsVariants`——同变体与枪械权重**求和**
3. `registerVariantContributor` 贡献的 `AttributeModifier` 权重修饰符——复用原版三阶段语义：`ADD_VALUE` 加算 → `ADD_MULTIPLIED_BASE` 只乘基础权重 → `ADD_MULTIPLIED_TOTAL` 乘整体。**零基础且无加值时结果恒 0**（"火元素饰品对非火枪无效"）

**逐弹丸语义**：变体对每颗弹丸**独立 roll**（一次选举只作用于本颗），霰弹中可混合出现不同变体或普通弹；权重全 0 或空池时本颗静默退化为普通弹。互斥单值字段（`damageType` / 视觉 `base`）必须走变体池；可叠加效果请走 `registerShootEffect`。

## 状态定义（StateDefinition）

注册表：`modularshoot:states`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `domain` | 枚举 | **是** | — | 归属域。`GUN`（per-gun，跟枪走，持久化在枪械 NBT）、`PLAYER`（per-player，跟玩家走，通过 AttachmentType 持久化）、`BULLET`（per-bullet，仅子弹生命周期内有效，不持久化） |
| `valueType` | 枚举 | **是** | — | 值类型。`INT` / `LONG` / `DOUBLE` / `FLOAT` / `BOOLEAN` / `STRING` / `UUID` |
| `defaultValue` | 对象 | 否 | 对应类型的零值 | 初始值，类型须与 `valueType` 匹配。per-gun / per-player 首次访问时按此初始化 |
| `display` | 状态显示 | **是** | — | 显示元数据对象 |
| `visual_modifiers` | 条件视觉修饰符批次列表 | 否 | 空列表 | 每批 = `condition`（`state` / `domain` / `op` / `value`）+ `modifiers` 列表（格式同 `bullet_style.modifiers`）。**条件成立时**这些修饰符在子弹创建瞬间叠加进视觉组合 |

### 状态显示（StateDisplay）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | 字符串 | **是** | — | 状态在 tooltip 中的名称。支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `color` | 字符串 | 否（可选） | 无 | 名称颜色（如 `#FFAA00`）。省略时用默认 tooltip 颜色 |
| `format` | 字符串 | 否 | `"{value}"` | 显示模板，`{value}` 占位。如 `"{value} 层"` → tooltip 显示 `击杀层数: 3 层` |
| `priority` | 整数 | 否 | `0` | tooltip 内排序，越大越靠前 |
| `hideDefault` | 布尔值 | 否 | `false` | 值为默认值时不显示该行 |
