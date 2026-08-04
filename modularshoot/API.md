# API 参考

ModularShootAPI 所有公开静态方法速查。方法按功能分组。


## 物品判断

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `isGun(ItemStack stack)` | `stack` — 要检查的物品堆叠 | `boolean` | 判断物品是否为框架枪械（`modularshoot:gun`），仅检查物品类型 |
| `isPlugin(ItemStack stack)` | `stack` — 要检查的物品堆叠 | `boolean` | 判断物品是否为框架插件（`modularshoot:plugin`），仅检查物品类型 |

## 数据查询

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getGunId(ItemStack gun)` | `gun` — 枪械物品堆叠 | `ResourceLocation`（可空） | 获取枪械定义 ID。非枪械物品或无 gun_data 组件时返回 `null` |
| `getGunData(ItemStack gun)` | `gun` — 枪械物品堆叠 | `Optional<GunData>` | 获取枪械完整 Data Component（含 gunId、实例 UUID、已安装插件列表、modifierVersion、per-gun state） |
| `getPluginId(ItemStack stack)` | `stack` — 插件物品堆叠 | `Optional<ResourceLocation>` | 获取插件定义 ID。非插件物品或无 plugin_data 组件时返回空 |
| `getPluginData(ItemStack stack)` | `stack` — 插件物品堆叠 | `Optional<PluginData>` | 获取插件完整 Data Component（含 pluginId） |
| `getInstalledPlugins(ItemStack gun)` | `gun` — 枪械物品堆叠 | `List<PluginInstance>`（不可变） | 查询枪械已安装的插件列表。非枪械或无已安装插件时返回空列表 |

## 拆卸 API

所有拆卸方法在成功后自动刷新 `ATTRIBUTE_MODIFIERS` 组件。`RegistryAccess` 通过 `player.level().registryAccess()` 内部获取，调用方无需手动传入。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `uninstallPlugin(ItemStack gun, UUID instanceUuid, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械（会被修改）；`instanceUuid` — 要拆卸的插件实例 UUID；`player` — 玩家上下文；`force` — 是否忽略锁定标记；`returnItems` — 是否返还拆卸的插件物品 | `UninstallResult` | 按实例 UUID 拆卸指定插件 |
| `uninstallRandomPlugin(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `UninstallResult` | 随机拆卸一个可拆卸的插件 |
| `uninstallPluginsByType(ItemStack gun, Player player, ResourceLocation pluginTypeId, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`pluginTypeId` — 要拆卸的插件种类 ID；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `List<UninstallResult>` | 拆卸所有属于指定种类的插件。无匹配时返回空列表 |
| `uninstallAllPlugins(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `List<UninstallResult>` | 拆卸所有已安装插件。无插件时返回空列表 |

> **向后兼容**：上述方法保留了含 `RegistryAccess` 参数的旧签名（`@Deprecated`），旧签名仍可用但不推荐。新签名降低了调用门槛，`RegistryAccess` 从 `player.level().registryAccess()` 自动获取。

参数说明：
- **`player`**：拆卸操作的玩家上下文。`returnItems` 为 `true` 时，返还到玩家物品栏（满则掉落）；否则直接删除
- **`force`**：`true` 强制拆卸（忽略 `locked` 标记）；`false` 跳过锁定插件
- **`returnItems`**：`true` 返还拆卸的插件物品给玩家；`false` 直接销毁

## 锁定 API

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `setPluginLocked(ItemStack gun, UUID instanceUuid, boolean locked)` | `gun` — 枪械物品；`instanceUuid` — 插件实例 UUID；`locked` — `true` 锁定 / `false` 解锁 | `void` | 锁定或解锁指定已安装插件。锁定后普通拆卸（`force=false`）跳过该插件 |
| `isPluginLocked(ItemStack gun, UUID instanceUuid)` | `gun` — 枪械物品；`instanceUuid` — 插件实例 UUID | `boolean` | 查询指定插件是否已锁定。插件不存在或未锁定时返回 `false` |

## 注册 API

以下方法应在模组初始化阶段（构造函数或 `FMLCommonSetupEvent`）调用。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `registerGun(ResourceLocation gunId, GunDefinition definition)` | `gunId` — 枪械定义 ID（如 `modularshoot:sniper_rifle`）；`definition` — 枪械定义对象 | `void` | 通过 Java API 注册一把枪械。调用后自动标记该 ID 为 API 注册，后续数据包 JSON 同名注册会被拒绝 |
| `registerPluginValidator(PluginValidator validator)` | `validator` — 自定义安装校验器（函数式接口：`(ItemStack, ResourceLocation) → ValidationResult`） | `void` | 注册自定义插件安装校验器。在框架默认校验通过后执行，返回失败则安装中止 |
| `registerShootPredicate(ShootPredicate predicate)` | `predicate` — 射击条件判断器（函数式接口：`(Player, ItemStack) → ShootPredicateResult`） | `void` | 注册射击条件判断器。射速控制通过后执行，返回失败阻止射击并显示原因。框架默认注册 0 个 |
| `registerTraitHook(ResourceLocation traitId, TraitHookType type, T callback)` | `traitId` — 特性 ID；`type` — 钩子类型枚举（`ON_TICK`/`ON_HIT`/`ON_BLOCK_HIT`/`ON_EXPIRE`/`ON_REMOVE`/`ON_VISUAL_TICK`）；`callback` — 回调实现，类型须与 `type` 匹配 | `void` | 为指定特性注册运行时钩子回调。同一特性可注册多个回调，按注册顺序执行 |
| `registerDamageHandler(DamageHandler handler)` | `handler` — 伤害后处理器（函数式接口：`(BulletRecord, Entity, double) → double`） | `void` | 注册全局伤害处理器，在子弹命中后、应用伤害前执行。按注册顺序链式调用，前一返回值作为后一输入 |
| `markJavaApiRegistered(ResourceKey<Registry<T>> registryKey, ResourceLocation id)` | `registryKey` — 注册表键（如 `ModularShootRegistries.GUNS_KEY`）；`id` — 条目标识符 | `void` | 标记某 ID 已由 Java API 注册（防止数据包 JSON 冲突覆盖）。通常在 `registerGun` 等 API 内部自动调用 |

**TraitHookType 枚举值**：

| 枚举值 | 对应钩子 | 回调参数 | 执行端 |
|--------|---------|---------|--------|
| `ON_TICK` | onTick | `(BulletRecord, BulletSnapshot)` | 服务端 |
| `ON_HIT` | onHit | `(BulletRecord, BulletSnapshot, Entity)` | 服务端 |
| `ON_BLOCK_HIT` | onBlockHit | `(BulletRecord, BulletSnapshot, BlockPos, Direction)` | 服务端 |
| `ON_EXPIRE` | onExpire | `(BulletRecord, BulletSnapshot)` | 服务端 |
| `ON_REMOVE` | onRemove | `(BulletRecord, BulletSnapshot, RemoveReason)` | 服务端 |
| `ON_VISUAL_TICK` | onVisualTick | 客户端渲染对象（`BulletRenderObject`） | 仅客户端 |

> **onVisualTick 契约（修饰符叠加系统）**：子弹的视觉组合（base / scale / tint / 附加层）在**创建瞬间冻结**并缓存于 `BulletRecord.composedStyle`（服务端）→ 经 `BulletS2CPacket` 传给客户端 `BulletRenderObject`。飞行中的 `onVisualTick` 钩子要改视觉，应**直接修改 `BulletRenderObject`**（`setScale` / `setComposedTint` / `setLayers` / 换纹理等），不要试图改 `BulletSnapshot` 期望触发重新组合——组合不会在飞行中重算。

## 注册表查询

需要 `RegistryAccess` 参数（从已加载世界获取，主菜单阶段注册表为空）。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getGunDefinition(RegistryAccess registryAccess, ResourceLocation gunId)` | `registryAccess` — 运行时注册表视图；`gunId` — 枪械定义 ID | `Optional<GunDefinition>` | 查询枪械定义 |
| `getPluginDefinition(RegistryAccess registryAccess, ResourceLocation pluginId)` | `registryAccess` — 运行时注册表视图；`pluginId` — 插件定义 ID | `Optional<PluginDefinition>` | 查询插件定义 |
| `getPluginTypeDefinition(RegistryAccess registryAccess, ResourceLocation pluginTypeId)` | `registryAccess` — 运行时注册表视图；`pluginTypeId` — 插件种类 ID | `Optional<PluginTypeDefinition>` | 查询插件种类定义 |

## 状态访问

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getState(ItemStack gun, Player player)` | `gun` — 枪械物品堆叠；`player` — 玩家上下文（用于解析运行时注册表） | `GunState`（可空） | 获取枪械实例的 per-gun 状态读写视图。非枪械返回 `null`。提供 `getInt`/`setInt`/`getDouble`/`setDouble`/`getBoolean`/`setBoolean`/`getString`/`setString`/`getUuid`/`setUuid`/`hasState`/`clearState` 等类型化方法 |
| `getPlayerState(Player player)` | `player` — 玩家 | `PlayerState` | 获取玩家 per-player 状态读写视图。API 与 `GunState` 一致，仅归属对象不同 |
| `resolveGunFromSnapshot(BulletSnapshot snapshot, Level level)` | `snapshot` — 子弹快照；`level` — 世界实例（可空） | `ItemStack`（可空） | 从子弹快照回溯发射时所用枪械的 ItemStack。通过 gunInstanceUuid + shooter UUID 在玩家背包中查找。独立发射（炮塔等）、玩家离线、枪已丢弃时返回 `null` |

**状态读写方法速查**（`GunState` / `PlayerState` 通用）：

| 方法 | 说明 |
|------|------|
| `getInt(stateId)` / `setInt(stateId, value)` | 读写整数 |
| `getLong(stateId)` / `setLong(stateId, value)` | 读写长整数 |
| `getDouble(stateId)` / `setDouble(stateId, value)` | 读写双精度浮点数 |
| `getFloat(stateId)` / `setFloat(stateId, value)` | 读写单精度浮点数 |
| `getBoolean(stateId)` / `setBoolean(stateId, value)` | 读写布尔值 |
| `getString(stateId)` / `setString(stateId, value)` | 读写字符串 |
| `getUuid(stateId)` / `setUuid(stateId, value)` | 读写 UUID |
| `hasState(stateId)` | 判断状态是否已写入（非默认值） |
| `clearState(stateId)` | 清除状态（恢复默认值） |

> 访问未注册的状态 ID 返回零值（int→0, string→""等），并输出 WARN 日志。类型不匹配同理。
