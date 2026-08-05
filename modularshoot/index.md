# ModularShoot（模块化射击）

ModularShoot 是一个基于属性驱动、模块化组装的枪械系统**框架模组**，运行于 NeoForge 1.21.1。

> **框架定位**：本模组定位为**纯框架与 API**（注册 API、属性计算管线、射击引擎），不提供生产内容。但随包数据包附带测试/视觉演示内容（4 把 test 枪械、9 个演示插件、2 个插件种类 barrel/accessory、演示特性 visual_bloodlust、演示状态 visual_killstreak），用于功能演示与调试，可被外部数据包覆盖；生产内容由其他模组通过 API 或数据包添加。

## 核心特点

| 特点 | 说明 |
|------|------|
| **单 ID + Data Component** | 所有枪械共用一个物品 ID（`modularshoot:gun`），通过 Data Component 区分枪型；插件同理（`modularshoot:plugin`） |
| **纯框架 + 演示包** | 4 把演示枪械、9 个演示插件、2 个插件种类、1 个演示特性、1 个演示状态（全部可被数据包覆盖）——提供 API 和引擎 |
| **属性驱动** | 枪械行为完全由属性 + 特性决定，无硬编码特殊逻辑。`ADD_VALUE → ADD_MULTIPLIED_BASE → ADD_MULTIPLIED_TOTAL` 三阶段叠加 |
| **双路注册** | 支持 Java API 注册和数据包 JSON 注册，共享同一注册表。`/reload` 热重载 JSON，API 注册不受影响 |
| **非实体子弹** | 子弹为轻量数据记录，由 BulletManager 管理，支持数千发同时飞行（每 tick 每区块实体候选缓存 + 胶囊体碰撞检测） |
| **完全事件化** | 所有扩展点通过事件 + 回调 API 暴露：射击事件、安装/拆卸事件、特性钩子、伤害处理器、右键/换弹事件 |
| **服务端权威** | 射击、子弹飞行、命中判定均由服务端执行，客户端仅渲染，防作弊 |

## 快速导航

| 文档 | 适合人群 | 内容 |
|------|---------|------|
| [API 参考](./API.md) | 想用代码调用框架功能的开发者 | ModularShootAPI 所有公开方法速查表 |
| [注册表参考](./Registry.md) | 想了解定义字段含义的开发者 | 6 张动态注册表及每种定义的字段详解 |
| [数据包注册](./DataPack.md) | 想用 JSON 注册内容的开发者 | 数据包 JSON 文件路径、字段与格式说明 |
| [命令参考](./CommandReference.md) | 想用调试命令的开发者 | `/modularshoot` 子命令速查 |
| [示例集](./Examples.md) | 想直接看代码的开发者 | Java API 和 JSON 的所有集中示例 |

## 6 张框架注册表

| 注册表 ID | 用途 | 注册方式 |
|-----------|------|---------|
| `modularshoot:guns` | 枪械定义 | Java API / 数据包 JSON |
| `modularshoot:plugins` | 插件定义 | Java API / 数据包 JSON |
| `modularshoot:plugin_types` | 插件种类定义 | Java API / 数据包 JSON |
| `modularshoot:traits` | 布尔特性定义 | Java API / 数据包 JSON |
| `modularshoot:states` | 持久状态定义 | Java API / 数据包 JSON |
| `modularshoot:attribute_meta` | 属性元数据（默认值、显示信息、绑定） | 数据包 JSON |

> 属性**本体**（`Attribute` 实例）需用原版 `DeferredRegister` 注册到 `BuiltInRegistries.ATTRIBUTE`，不在上述动态注册表中。

## 预置属性

框架预注册 9 个数值属性（`modularshoot` 命名空间）：

| 属性 ID | 说明 | 默认值 |
|---------|------|--------|
| `hit_damage` | 每次命中伤害 | 1.0 |
| `fire_rate` | 每秒射击次数（上限 20，≤0 时禁止射击） | 1.0 |
| `range` | 子弹最大飞行距离（格） | 50.0 |
| `accuracy_yaw` | 水平散布角度（度） | 10.0 |
| `accuracy_pitch` | 垂直散布角度（度） | 10.0 |
| `entity_penetration` | 穿透实体数（0 不穿透） | 0 |
| `bullet_speed` | 子弹飞行速度（格/秒） | 20.0 |
| `bullet_size` | 子弹碰撞球半径（0 为射线） | 0.5 |
| `block_penetration` | 穿透方块数（0 不穿透） | 0 |

## 关键事件一览

| 事件 | 触发时机 | 可取消 |
|------|---------|--------|
| `PreShootEvent` | 射击条件判断通过后 | 是 |
| `PostShootEvent` | 子弹注册后 | 否 |
| `GunRightClickEvent` | 非 GUI 中右键枪械 | 是 |
| `ReloadEvent` | 按下换弹键（默认 R） | 是 |
| `PrePluginInstallEvent` | 插件安装校验通过后 | 是 |
| `PostPluginInstallEvent` | 插件写入组件后 | 否 |
| `PrePluginUninstallEvent` | 插件拆卸前 | 是 |
| `PostPluginUninstallEvent` | 插件拆卸后 | 否 |
| `ClientBulletHitEvent` | 客户端收到命中包、播放默认特效前（仅客户端，NeoForge.EVENT_BUS） | 是 |

> **命中特效钩子**：`ClientBulletHitEvent` 在客户端播放命中特效前触发，字段含 `soundId`（服务端从枪械 `sounds` 槽位解析的命中音效 ID——实体 `hit_entity`/方块 `hit_block`/穿透 `hit_pierce`，未配置为 null）；取消则跳过默认粒子与音效，未取消时可在监听逻辑中追加自定义音效/粒子。
