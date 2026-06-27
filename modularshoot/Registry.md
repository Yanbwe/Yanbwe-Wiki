# 注册表参考

ModularShoot 通过 6 张动态注册表（DataPackRegistry）存储所有定义。全部支持 `/reload` 热重载和客户端同步。


## 注册表概览

| 注册表 ID | 用途 | 值类型 |
|-----------|------|--------|
| `modularshoot:guns` | 枪械定义 | `GunDefinition` |
| `modularshoot:plugins` | 插件定义 | `PluginDefinition` |
| `modularshoot:plugin_types` | 插件种类定义 | `PluginTypeDefinition` |
| `modularshoot:traits` | 布尔特性定义 | `Trait` |
| `modularshoot:attribute_meta` | 属性元数据 | `AttributeMeta` |
| `modularshoot:states` | 持久状态定义 | `StateDefinition` |

> 属性**本体**（`Attribute` 实例）不在上述动态注册表中——须用原版 `DeferredRegister` 注册到 `BuiltInRegistries.ATTRIBUTE`。元数据表仅存储默认值、显示信息和绑定关系。

## 枪械定义（GunDefinition）

注册表：`modularshoot:guns`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | 可选字符串 | 否 | 无（回退到枪械 ID 路径部分） | 显示名称，支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `texture` | 资源路径 | **是** | — | 枪械基础纹理路径，原版物品渲染管线立体化处理 |
| `shootTexture` | 可选资源路径 | 否 | 无（始终使用基础纹理） | 射击时切换的纹理路径 |
| `shootTextureMode` | 枚举 | 否 | `PER_SHOT` | 射击纹理切换模式。仅在指定了 `shootTexture` 时生效 |
| `stats` | 属性ID→浮点数映射 | 否 | 空映射 | 属性基础值。键必须带完整命名空间（如 `modularshoot:hit_damage`）。未声明的属性使用元数据表的默认值 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 枪械固有特性覆盖。枪械声明的特性始终覆盖所有插件 |
| `slots` | 种类ID→整数映射 | 否 | 空映射 | 插件插槽配置，键为插件种类 ID，值为插槽数量 |
| `sounds` | 字符串→资源路径映射 | 否 | 空映射 | 音效绑定。预置槽位 `shoot`（射击声），可自定义槽位名称 |
| `bulletStyle` | 可选子弹样式 | 否 | 无（纯碰撞体，无渲染对象） | 子弹视觉外观配置 |

### 子弹样式（BulletStyle）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `model` | 字符串→资源路径映射 | **是** | — | 渲染资源。惯例键：`"3d"`→原版静态 JSON 模型路径，`"billboard"`→纹理路径。建议两者都提供 |
| `renderMode` | 枚举 | **是** | — | 渲染模式：`BILLBOARD`（始终面向玩家的 2D 精灵）或 `THREE_D`（原版静态 3D 模型） |

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
| `modifiers` | 修饰符列表 | 否 | 空列表 | 属性修饰符数组，安装后叠加到枪械属性 |
| `traits` | 特性ID→布尔值映射 | 否 | 空映射 | 安装后提供的特性覆盖 |
| `exclusiveGroup` | 可选字符串 | 否 | 无 | 互斥组 ID。同一枪上不能安装两个互斥组 ID 相同的插件 |
| `bulletStyle` | 可选子弹样式 | 否 | 无 | 子弹样式覆盖。安装后替换枪械定义的子弹样式。**整体覆盖**，非字段级合并 |
| `textureOverlay` | 可选纹理叠加 | 否 | 无 | 纹理叠加信息。安装后在枪械纹理上叠加图层 |
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

## 状态定义（StateDefinition）

注册表：`modularshoot:states`

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `domain` | 枚举 | **是** | — | 归属域。`GUN`（per-gun，跟枪走，持久化在枪械 NBT）、`PLAYER`（per-player，跟玩家走，通过 AttachmentType 持久化）、`BULLET`（per-bullet，仅子弹生命周期内有效，不持久化） |
| `valueType` | 枚举 | **是** | — | 值类型。`INT` / `LONG` / `DOUBLE` / `FLOAT` / `BOOLEAN` / `STRING` / `UUID` |
| `defaultValue` | 对象 | 否 | 对应类型的零值 | 初始值，类型须与 `valueType` 匹配。per-gun / per-player 首次访问时按此初始化 |
| `display` | 状态显示 | **是** | — | 显示元数据对象 |

### 状态显示（StateDisplay）

| 字段 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | 字符串 | **是** | — | 状态在 tooltip 中的名称。支持 `§` 颜色代码和 `lang:` 翻译键前缀 |
| `color` | 字符串 | **是** | — | 名称颜色（如 `#FFAA00`） |
| `format` | 字符串 | 否 | `"{value}"` | 显示模板，`{value}` 占位。如 `"{value} 层"` → tooltip 显示 `击杀层数: 3 层` |
| `priority` | 整数 | 否 | `0` | tooltip 内排序，越大越靠前 |
| `hideDefault` | 布尔值 | 否 | `false` | 值为默认值时不显示该行 |
