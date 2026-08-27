# 注册表参考

ModularShoot 通过 10 张动态注册表（DataPackRegistry）存储所有定义。全部支持 `/reload` 热重载和客户端同步。


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
| `modularshoot:shooters` | 发射者定义（独立发射配置模板） | `ShooterDefinition` |
| `modularshoot:gun_items` | 物品→枪械绑定 | `GunItemBinding` |
| `modularshoot:plugin_items` | 物品→插件绑定 | `PluginItemBinding` |

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
| `attributeMount` | 枚举 | 否 | `ITEM` | 属性挂载点（JSON 键 `attribute_mount`）：`ITEM`（默认，物品侧，框架照常写入主手属性修饰符组件）/ `PLAYER`（玩家侧，框架不向物品写入属性修饰符组件，挂载责任转移给声明方，如将修饰符挂在玩家实体上） |
| `stats` | 属性ID→浮点数映射 | 否 | 空映射 | 属性基础值。键为 attribute_meta 已登记条目的逻辑 id；裸键自动补 `modularshoot` 命名空间（如 `hit_damage` ≡ `modularshoot:hit_damage`），显式 `minecraft:` 前缀同样归一为 `modularshoot`，其他显式命名空间原样保留。未声明的属性使用元数据表的默认值。**支持任意已登记条目**（不限于框架预置的 10 个）：数据包新增 attribute_meta 条目后，`stats` 自动支持该键 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 枪械固有特性覆盖。枪械声明的特性始终覆盖所有插件 |
| `variants` | 变体ID→浮点数映射 | 否 | 空映射 | 变体池基础权重：变体 ID → 基础权重。每发射击实时组装变体池，与插件 `addsVariants` 同变体求和，并经贡献者权重修饰符调整后加权随机选举（详见「变体定义（VariantDefinition）」） |
| `extraValues` | 命名空间数字映射 | 否 | 空映射 | 扩展数值字段：键为 ResourceLocation（须带命名空间）、值为数字。框架只承载与按 key 求和、不解释语义；`getExtraValueSums` / `getExtraValue` 返回时与已安装插件累加值相加（枪械定义为基础值） |
| `slots` | 种类ID→整数映射 | 否 | 空映射 | 插件插槽配置，键为插件种类 ID，值为插槽数量 |
| `sounds` | 字符串→资源路径映射 | 否 | 空映射 | 音效绑定。预置槽位 `shoot`（射击声），可自定义槽位名称 |
| `soundRange` | 可选浮点数 | 否 | 无（使用音效事件自带范围，默认 16 格） | 射击音效可听半径（格）覆盖。JSON 键 `sound_range`；缺省时使用音效事件自带范围（默认 16 格） |
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

> **注册方式（0.3.0 起）**：数据包 JSON（`data/<命名空间>/modularshoot/plugins/<id>.json`）或 Java API（`ModularShootAPI.registerPlugin`，优先于数据包同名条目且不受 `/reload` 影响），另支持动态定义提供者（`registerPluginDefinitionProvider`，查询时计算，适合随机战利品/动态词缀）。详见 [API 参考「注册 API」](./API.md#注册-api)。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `tags` | 资源路径列表 | 否 | 空列表 | 匹配用标签。与种类 tags 存在交集即可安装。空列表时无法安装（输出 WARN） |
| `priority` | 整数 | 否 | `0` | 特性冲突优先级，越大越优先。不继承种类优先级 |
| `visualPriority` | 可选整数 | 否 | 无（回退 `priority`） | 视觉 base 选举优先级（JSON 键 `visual_priority`）。仅在插件 bulletStyle 的 base 参与视觉组合选举时生效，不影响特性冲突裁决；缺省回退 `priority` |
| `itemIcon` | 资源路径 | **是** | — | 插件在背包/快捷栏中的图标纹理路径 |
| `textureScale` | 枚举 | 否 | `AUTO` | 图标渲染几何是否随纹理分辨率缩放，语义同枪械的 `textureScale`（`AUTO` / `FIXED`） |
| `modifiers` | 修饰符列表 | 否 | 空列表 | 属性修饰符数组，安装后叠加到枪械属性 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 安装后提供的特性覆盖 |
| `addsVariants` | 变体ID→浮点数映射 | 否 | 空映射 | 追加进枪械变体池的基础权重。安装后与枪械声明的同变体权重求和（详见「变体定义（VariantDefinition）」） |
| `addsSlots` | 种类ID→整数映射 | 否 | 空映射 | 槽位扩展（JSON 键 `adds_slots`）：安装后增加指定槽位数量，或**创造**枪械原本没有的槽位类型。有效键集 = 枪械 `slots` ∪ 已装插件 `adds_slots` 键；有效容量 = 枪械值 + Σ 已装插件贡献。值为任意整数（负数表示占用槽位，容量 ≤ 已装数量时该槽位不可再装）。键须引用 `plugin_types` 注册表；裸键自动补 `modularshoot` 命名空间（与枪械 `slots` 规则一致）。安装匹配与 tooltip 插件栏均按有效槽位计算；卸载超编预检见 API 文档「卸载超编预检」 |
| `exclusiveGroup` | 可选字符串 | 否 | 无 | 互斥组 ID。同一枪上不能安装两个互斥组 ID 相同的插件 |
| `bulletStyle` | 可选子弹样式 | 否 | 无 | 子弹样式叠加。安装后与枪械的样式**叠加组合**：base 按 visual_priority 选举（缺省回退 priority；同值后装赢，无候选回退框架默认外观），modifiers 全部叠加（scale 连乘、tint 逐通道连乘、attach_layer 全部保留） |
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
| `tint` | 4 元素浮点数组 | 否 | 白色 `[1,1,1,1]`（恒等） | 叠加层像素的逐通道 RGBA 乘数，混合前应用。白色恒等不变 |
| `blend` | 枚举 | 否 | `NORMAL` | 与底层像素的颜色混合模式：`NORMAL`（普通 source-over 合成：不透明处替换、半透明处混色）/ `MULTIPLY`（相乘，变暗）/ `SCREEN`（反相相乘，变亮）/ `ADD`（相加并 clamp 到 1，变亮）。仅影响颜色通道，alpha 始终用普通 over 合成 |
| `outline` | 可选描边规格 | 否 | 无 | 沿叠加层自身 alpha 轮廓描边，格式同描边规格（OutlineSpec）。描边在 tint 之后绘制，不受 tint 影响 |

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

渲染时凡安装该插件的枪械，其描边逐帧取 provider 颜色（白色描边遮罩 × 每帧 tint，缓存纹理无需重建）；未注册 provider 的描边保持静态烘焙色。框架内置带 `gun_outline` 的演示插件为 `modularshoot:fragment_guard`（守护蓝光）与 `modularshoot:fragment_shining`（金色圣光），均为静态烘焙色；不内置动态描边演示，逐帧变色须由集成模组按上述方式经 `DynamicOutlineTintRegistry` 注册。

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
| `binds` | 资源路径 | **是** | — | 指向已注册的原版 `Attribute` ID。框架通过此字段定位 `Attribute` holder 参与修饰符挂载。**三路径共用**（挂载 / 结算 / 显示均经 `binds` 解析），可重绑到任意已注册原版属性。预置属性的逻辑 ID 与本体 ID 一致，`binds` 指向自身 |
| `defaultValue` | 浮点数 | **是** | — | 枪械未声明该属性时的基础值（参与 ADD_VALUE 计算）。可热重载。**非原版 Attribute 的 base 值**（后者恒为 0） |
| `entityTypes` | 实体类型 ID 列表 | 否 | `[PLAYER]`（仅玩家） | 读取生效白名单（JSON 键 `entity_types`，默认 `["minecraft:player"]`）：仅列表内实体类型的属性值被框架读取，白名单外读取 `0.0`。挂载侧已把框架 10 个预置属性预挂载到**全部**实体类型（懒实例化），本字段只控制"谁的属性值生效"——纯数据包改动即可切换生效范围。`shooters` 的 `attribute_binds` 同受此约束 |
| `description` | 字符串 | 否 | `""`（空字符串） | 说明文本 |
| `color` | 字符串 | 否 | `""`（空字符串） | 属性名称颜色（如 `#FF4444`） |
| `priority` | 整数 | 否 | `0` | 显示优先级，越大越靠前 |
| `forceShow` | 布尔值 | 否 | `false` | 是否强制展示。`true` 时即使值与默认值相同也在 tooltip 显示 |
| `unit` | 可选字符串 | 否 | 无（不显示单位） | 数值显示单位的翻译键（如 `modularshoot.unit.per_second`），渲染在 tooltip 数值之后；缺省不显示单位 |

> `binds` 指向的属性未注册时：元数据条目保留，但修饰符不挂载、tooltip 不显示、读取返回 0。

> 数据包可将 `binds` 重绑到任意已注册原版属性（含 `minecraft:*`），如将 `modularshoot:hit_damage` 重绑到 `minecraft:attack_damage`。三路径（挂载/结算/显示）语义、base 偏移与 syncable 等约定见[数据包格式文档](DataPack.md#属性元数据-json)。

## 发射者定义（ShooterDefinition）

注册表：`modularshoot:shooters`

独立发射（炮塔、陷阱、Boss 攻击、脚本场景等非玩家发射源）的**配置模板**：给定数值模板，发射时从源实体实时读取属性值覆盖生成快照，交给 `ModularShootAPI.fireBullet`。注册表键（发射者 ID，如 `modularshoot:bone_shooter`）由注册表自身提供，不是 record 字段。

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `stats` | 属性ID→浮点数映射 | **是** | —（非空） | 快照数值模板。JSON 键须带完整命名空间（如 `"modularshoot:hit_damage"`），**不**自动补 `modularshoot`；空模板使条目加载失败 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 快照固有特性标志 |
| `bulletStyle` | 可选子弹样式 | 否 | 无 | 独立发射视觉样式（JSON 键 `bullet_style`，结构同枪械）；缺失时用框架默认外观 |
| `shootSound` | 可选发射音效 | 否 | 无 | 发射音效（JSON 键 `shoot_sound`：`id` 必填、`volume`/`pitch` 默认 `1.0`）；缺失时静音 |
| `attributeBinds` | 资源路径列表 | 否 | 空列表 | 属性绑定（JSON 键 `attribute_binds`）：快照生成时从源实体实时读取并覆盖模板条目（可引入新键）；读不到（源为 null / 未注册 WARN / 白名单未命中）保留模板值 |

> `createSnapshot(LivingEntity source, RegistryAccess registryAccess)` 生成的快照遵循独立发射约定（`gunId`/`gunInstanceUuid`/`shooter` 均 `null`），伤害类型留空由 `fireBullet` 门面补默认；音效不随发射自动播放，需调用 `playShootSound(Level, Vec3)`。Java API 经 `registerShooter` 注册的条目优先于数据包同名条目。JSON 字段完整说明见[数据包格式文档](DataPack.md#发射者-jsonshooters)。

## 变体定义（VariantDefinition）

注册表：`modularshoot:variants`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `baseWeight` | 浮点数 | 否 | `0.0` | 基础权重兜底（JSON 键 `base_weight`）。仅当枪械/插件都未声明该变体时使用（典型场景：仅由 `registerVariantContributor` 引入的变体）；已被枪械/插件声明的变体以声明权重为权威 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 选中后**合并**进快照：声明的特性值写入，未声明键保留原值 |
| `stats` | 属性ID→数值映射 | 否 | 空映射 | 选中后**只覆盖声明键**（不整体替换快照属性表） |
| `damageType` | 可选资源路径 | 否 | 无 | 选中后覆盖 `ammo_damage_type` 预设（变体优先） |
| `bulletStyleOverride` | 可选子弹样式 | 否 | 无 | 视觉覆盖，格式同 `bulletStyle`（base + modifiers）。base 以最高优先级参与视觉组合选举（胜过枪械/插件/特性/状态条件），modifiers 照常叠加；仅服务端 compose 读取，不序列化到客户端 |

**权重语义（三来源）**：变体池每发射击**实时组装**（不持久化），三种来源合并后按加权随机选举：

1. 枪械定义 `variants` 声明的基础权重
2. 已安装插件的 `addsVariants`——同变体与枪械权重**求和**
3. `registerVariantContributor` 贡献的 `AttributeModifier` 权重修饰符——复用原版三阶段语义：`ADD_VALUE` 加算 → `ADD_MULTIPLIED_BASE` 只乘基础权重 → `ADD_MULTIPLIED_TOTAL` 乘整体。**零基础且无加值时结果恒 0**（"火元素饰品对非火枪无效"）

**普通弹兜底**：枪械**未声明** `variants` 时，池中默认存在权重 `1.0` 的"普通子弹"候选（隐式，不写入任何 JSON）；**声明了 `variants` 的枪械无兜底**。概率换算：`P(变体X) = X 的最终权重 ÷ 池总权重`（池总权重 = 所有正权重候选的最终权重之和，含兜底 `1.0`）；两候选权重相等时各 50%，某变体 50% ⟺ 其权重 = 其余候选权重之和。示例：普通枪 + 火球插件 `adds_variants: 1.0` → 池 {火球 1.0, 普通弹 1.0} → 火球恰 50%。

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

## 物品绑定定义（GunItemBinding / PluginItemBinding）

注册表：`modularshoot:gun_items` / `modularshoot:plugin_items`

把**其他模组的物品**绑定为枪械/插件——绑定后该物品 ID 的所有实例被视为框架枪械/插件，**无需替换原物品**（模型/纹理/获取途径全部保留，无"盗版"问题）。条目键（JSON 文件名）为任意 id，内容声明绑定目标。

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `item` | 资源路径 | **是** | 被绑定的物品 ID（如 `minecraft:diamond_sword`） |
| `gun` | 资源路径 | **是**（gun_items） | 目标枪械定义 ID（`modularshoot:guns` 注册表中的条目） |
| `plugin` | 资源路径 | **是**（plugin_items） | 目标插件定义 ID（`modularshoot:plugins` 注册表中的条目） |

**行为语义**：

- **进背包即生效**：绑定物品进入玩家背包（36 主格 + 副手）1 tick 内，服务端自动附加 `gun_data` 组件（含实例 UUID、基础属性修饰符），附加后与原生枪械**运行时完全同构**——可装插件、锁定、状态持久化、弹道回溯、反作弊版本号全部一致。
- **插件绑定不附加组件**：插件安装即消耗，pluginId 直接经绑定表解析。
- **完全改造**：绑定枪械左键近战由射击替代、原版附魔无效化、射击不损耗耐久。
- **视觉 Tier 1**：绑定物品保持原物品模型渲染；框架动态贴图管线（调色/叠加/描边/射击纹理切换）仅服务原生枪械。
- **身份提示**：未转化（无组件）的绑定枪械 tooltip 显示灰色标识行 `枪械: <id>` 与枪械定义中注册的基础属性/插槽预览；JEI、创造物品栏、背包悬停均可见。
- **加载后校验**（WARN 降级不拒收）：`item` 必须存在于物品注册表；`gun`/`plugin` 必须存在于对应定义表；同一物品 ID 重复绑定 → 字典序最小条目键胜出，其余 WARN。
- **Java API 优先**：`registerGunItem`/`registerPluginItem` 注册的绑定优先于数据包条目；数据包中与 Java API 冲突的条目加载时 WARN。
- **主菜单限制**：数据包绑定在主菜单创造物品栏无提示（注册表未加载）；Java API 绑定无此限制。
