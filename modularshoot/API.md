# API 参考

ModularShootAPI 所有公开静态方法速查。方法按功能分组。


## 物品判断

识别为**双通道**：组件通道（携带 `gun_data`/`plugin_data` 组件）优先，绑定通道（物品 ID 命中 `gun_items`/`plugin_items` 绑定表）兜底。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `isGun(ItemStack stack, RegistryAccess access)` | `stack` — 要检查的物品堆叠；`access` — 运行时注册表视图（如 `player.registryAccess()`） | `boolean` | 判断物品是否为枪械（原生 `modularshoot:gun` 或绑定表条目）。运行时请用此重载 |
| `isGun(ItemStack stack)` | `stack` — 要检查的物品堆叠 | `boolean` | 退化重载（无注册表视图时，如主菜单）：仅组件通道 + Java API 绑定通道，**不含数据包绑定** |
| `isPlugin(ItemStack stack, RegistryAccess access)` | 同上（插件版本） | `boolean` | 判断物品是否为插件（原生 `modularshoot:plugin` 或绑定表条目） |
| `isPlugin(ItemStack stack)` | `stack` — 要检查的物品堆叠 | `boolean` | 退化重载，语义同 `isGun(stack)` |

## 数据查询

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getGunId(ItemStack gun)` | `gun` — 枪械物品堆叠 | `Optional<ResourceLocation>` | 获取枪械定义 ID。无 gun_data 组件时返回空（0.3.0 起由可空改为 `Optional`） |
| `getGunData(ItemStack gun)` | `gun` — 枪械物品堆叠 | `Optional<GunData>` | 获取枪械完整 Data Component（含 gunId、实例 UUID、已安装插件列表、modifierVersion、per-gun state） |
| `getPluginId(ItemStack stack)` | `stack` — 插件物品堆叠 | `Optional<ResourceLocation>` | 获取插件定义 ID。无 plugin_data 组件时返回空 |
| `getPluginData(ItemStack stack)` | `stack` — 插件物品堆叠 | `Optional<PluginData>` | 获取插件完整 Data Component（含 pluginId） |
| `resolveGunId(ItemStack stack, RegistryAccess access)` | `stack` — 物品堆叠；`access` — 运行时注册表视图 | `Optional<ResourceLocation>` | 双通道解析枪械定义 ID：组件优先，绑定表兜底。绑定枪械未附加组件时经绑定表也能解析 |
| `resolvePluginId(ItemStack stack, RegistryAccess access)` | 同上（插件版本） | `Optional<ResourceLocation>` | 双通道解析插件定义 ID。绑定插件（无组件）的推荐读取方式 |
| `getInstalledPlugins(ItemStack gun)` | `gun` — 枪械物品堆叠 | `List<PluginInstance>`（不可变） | 查询枪械已安装的插件列表。非枪械或无已安装插件时返回空列表 |
| `getExtraValueSums(ItemStack gun, RegistryAccess registryAccess)` | `gun` — 枪械物品堆叠；`registryAccess` — 运行时注册表视图（需已加载世界） | `Map<ResourceLocation, Double>`（不可变） | 汇总枪械的 `extra_values` 总额：枪械定义**基础值** + 枪械上所有**有效**插件（定义仍存在者）的 `extra_values`，按命名空间键求和。失效插件与失效枪械定义均被过滤（与属性管线同一降级口径），未声明过的键不出现在结果中 |
| `getExtraValue(ItemStack gun, ResourceLocation key, RegistryAccess registryAccess)` | `gun` — 枪械物品堆叠；`key` — 要查询的扩展字段键；`registryAccess` — 运行时注册表视图 | `double` | 便捷单键查询：`key` 在枪械上的总额（枪械定义基础值 + 插件累加值），未声明时返回 `0.0` |
| `getEffectiveSlots(ItemStack gun, RegistryAccess access)` | `gun` — 枪械物品堆叠；`access` — 运行时注册表视图 | `Map<ResourceLocation, Integer>`（不可变） | 查询枪械当前**有效插槽**（种类 → 容量）：键集 = 枪械基础 slots ∪ 已装插件 adds_slots 键，容量 = 基础值 + Σ 已装插件贡献（负数保留原语义）。非枪械或定义缺失时返回空映射。与安装匹配 / 卸载预检共用同一聚合实现，UI 渲染安装区时无需自行拼装 |

## 安装 API

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `installPlugin(ItemStack gun, ItemStack pluginStack, Player player)` | `gun` — 目标枪械（不会被修改）；`pluginStack` — 插件物品堆叠（不会被修改）；`player` — 执行安装的玩家（不可为 null） | `PluginInstallService.InstallResult` | 程序化安装插件（自动化、管理工具、任务奖励等）。校验 tag 匹配、空槽、互斥组、自定义校验器与安装前事件，通过后在**副本**上写入并消耗 1 个插件，返回安装后的枪械副本与消耗后的插件副本，由调用方写回容器/背包 |
| `installPlugin(ItemStack gun, ItemStack pluginStack, Player player, @Nullable ResourceLocation preferredTypeId)` | 同上，另加 `preferredTypeId` — 优先种类提示（可空） | `PluginInstallService.InstallResult` | 带**优先种类提示**的安装（如 UI 把插件拖到某个种类安装区）。提示命中（该种类 tag 匹配且有空闲插槽）时直接装入该种类；未命中或传 `null` 时行为与三参版本完全一致。提示只是偏好、不能绕过任何校验；三参版本内部委托本版本 |

## 拆卸 API

所有拆卸方法在成功后自动刷新 `ATTRIBUTE_MODIFIERS` 组件。`RegistryAccess` 通过 `player.level().registryAccess()` 内部获取，调用方无需手动传入。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `uninstallPlugin(ItemStack gun, UUID instanceUuid, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械（会被修改）；`instanceUuid` — 要拆卸的插件实例 UUID；`player` — 玩家上下文；`force` — 是否忽略锁定标记；`returnItems` — 是否返还拆卸的插件物品 | `UninstallResult` | 按实例 UUID 拆卸指定插件 |
| `uninstallRandomPlugin(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `UninstallResult` | 随机拆卸一个可拆卸的插件 |
| `uninstallPluginsByType(ItemStack gun, Player player, ResourceLocation pluginTypeId, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`pluginTypeId` — 要拆卸的插件种类 ID；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `List<UninstallResult>` | 拆卸所有属于指定种类的插件。无匹配时返回空列表 |
| `uninstallAllPlugins(ItemStack gun, Player player, boolean force, boolean returnItems)` | `gun` — 目标枪械；`player` — 玩家上下文；`force` — 是否忽略锁定；`returnItems` — 是否返还物品 | `List<UninstallResult>` | 拆卸所有已安装插件。无插件时返回空列表 |

> 需要显式 `RegistryAccess` 或 `player` 为 `null` 时，请直接调用 `PluginUninstallService` 中对应方法。

参数说明：
- **`player`**：拆卸操作的玩家上下文。`returnItems` 为 `true` 时，返还到玩家物品栏（满则掉落；降级插件除外）；否则直接删除
- **`force`**：`true` 强制拆卸（忽略 `locked` 标记，且绕过超编预检）；`false` 跳过锁定插件，并拒绝会导致槽位超编的拆卸
- **`returnItems`**：`true` 返还拆卸的插件物品给玩家；`false` 直接销毁。例外：定义已失效（降级）的插件即使 `returnItems` 为 `true` 也不返还、直接销毁

## 卸载超编预检（`adds_slots`）

安装过 `adds_slots` 插件的枪械，其有效槽位容量 = 枪械基础值 + 全部已装插件的贡献（见 DataPack「插件 JSON」）。拆卸加槽插件会移除其容量贡献，可能导致某槽位类型超编：

- **非 `force`**：`uninstallPlugin` 在拆卸前模拟卸载后的容量，若任意槽位类型超编则**拒绝**拆卸，返回 `reason = WOULD_OVERFLOW`（插件未移除、不返还、不触发事件）；`uninstallRandomPlugin` 的候选会过滤掉会触发超编的插件；批量拆卸逐个执行，被拒的项记录 `WOULD_OVERFLOW`，其余照常
- **`force`**：绕过预检直接拆卸；超编的插件**滞留保留**（功能不受影响），但该槽位显示已满、无法再装入新插件
- `uninstallAllPlugins` 全部拆卸后无剩余插件，永不触发超编

## 锁定 API

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `setPluginLocked(ItemStack gun, UUID instanceUuid, boolean locked, RegistryAccess registryAccess)` | `gun` — 枪械物品；`instanceUuid` — 插件实例 UUID；`locked` — `true` 锁定 / `false` 解锁；`registryAccess` — 运行时注册表视图 | `void` | 锁定或解锁指定已安装插件，成功后自动刷新 `ATTRIBUTE_MODIFIERS` 组件。锁定后普通拆卸（`force=false`）跳过该插件 |
| `isPluginLocked(ItemStack gun, UUID instanceUuid)` | `gun` — 枪械物品；`instanceUuid` — 插件实例 UUID | `boolean` | 查询指定插件是否已锁定。插件不存在或未锁定时返回 `false` |

> 旧三参 `setPluginLocked` 已移除，请使用上面的 4 参版本。

## 注册 API

以下方法应在模组初始化阶段（构造函数或 `FMLCommonSetupEvent`）调用。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `registerGun(ResourceLocation gunId, GunDefinition definition)` | `gunId` — 枪械定义 ID（如 `modularshoot:sniper_rifle`）；`definition` — 枪械定义对象 | `void` | 通过 Java API 注册一把枪械。调用后自动标记该 ID 为 API 注册，后续数据包 JSON 同名注册会被拒绝 |
| `registerGunDefinitionProvider(GunDefinitionProvider provider)` | `provider` — 动态枪械定义提供者（函数式接口：`ResourceLocation → Optional<GunDefinition>`；返回空表示不处理该 ID） | `void` | 注册动态枪械定义提供者。`getGun` 查询顺序：Java API 注册 → 提供者（按注册顺序，首个非空结果胜出）→ 数据包注册表。支持 per-player / 运行时生成的动态定义（如“玩家即枪”类玩法，ID 可编码上下文如 `player:<uuid>`），框架内所有定义查询点零改动受益；未注册提供者时行为不变 |
| `registerPlugin(ResourceLocation pluginId, PluginDefinition definition)` | `pluginId` — 插件定义 ID（如 `mypack:rapid_affix`）；`definition` — 插件定义对象 | `void` | **（0.3.0 新增）** 通过 Java API 注册一个插件。语义与 `registerGun` 一致：自动标记 ID 为 API 注册、优先于数据包同名条目、不受 `/reload` 影响。适合程序化插件（随机战利品、动态词缀等） |
| `registerPluginDefinitionProvider(PluginDefinitionProvider provider)` | `provider` — 动态插件定义提供者（函数式接口：`ResourceLocation → Optional<PluginDefinition>`；返回空表示不处理该 ID） | `void` | **（0.3.0 新增）** 注册动态插件定义提供者。`getPlugin` 查询顺序：Java API 注册 → 提供者 → 数据包注册表。提供者定义的 ID 不被枚举接口列出（查询时计算）。双端各自运行同一提供者，定义须两端可确定性生成 |
| `registerShooter(ResourceLocation shooterId, ShooterDefinition definition)` | `shooterId` — 发射者定义 ID（如 `modularshoot:bone_shooter`）；`definition` — 发射者定义对象 | `void` | 通过 Java API 注册一个发射者定义（独立发射配置模板，`modularshoot:shooters` 注册表）。语义与 `registerGun` 一致：自动标记 ID 为 API 注册并优先于数据包同名条目，且不受 `/reload` 影响 |
| `registerGunItem(ItemLike item, ResourceLocation gunId)` | `item` — 要绑定的物品（如 `Items.DIAMOND_SWORD`）；`gunId` — 目标枪械定义 ID | `void` | 把指定物品绑定为枪械（等价于数据包 `gun_items` 条目，条目键 = 物品 ID）。Java API 绑定优先于数据包绑定；运行时识别需要 `RegistryAccess`（数据包注册表未加载时仅 Java API 绑定可见） |
| `registerPluginItem(ItemLike item, ResourceLocation pluginId)` | `item` — 要绑定的物品；`pluginId` — 目标插件定义 ID | `void` | 把指定物品绑定为插件（等价于数据包 `plugin_items` 条目） |
| `registerPluginValidator(PluginValidator validator)` | `validator` — 自定义安装校验器（函数式接口：`(Player player, ItemStack gun, ResourceLocation pluginId, RegistryAccess registryAccess) → ValidationResult`；`player` — 执行安装的玩家，`gun` — 目标枪械，`pluginId` — 候选插件定义 ID，`registryAccess` — 运行时注册表视图） | `void` | 注册自定义插件安装校验器。在框架默认校验通过后执行，返回失败则安装中止 |
| `registerShootPredicate(ShootPredicate predicate)` | `predicate` — 射击条件判断器（函数式接口：`(Player, ItemStack) → ShootPredicateResult`） | `void` | 注册射击条件判断器。射速控制通过后执行，返回失败阻止射击并显示原因。注册幂等：重复注册同一实例不叠加（0.3.0）。框架默认注册 0 个 |
| `registerShootEffect(ShootEffect effect)` | `effect` — 射击效果贡献者（函数式接口：`(Player player, ItemStack gun, BulletSnapshot snapshot, int pelletIndex, int totalPellets) → void`） | `void` | 注册逐弹丸射击效果贡献者。在每颗弹丸快照 `copy()` 之后、散布采样之前按注册顺序执行，后注册者可见前序修改（`pelletIndex` 可用作逐颗分化种子）。注册幂等：重复注册同一实例不叠加（0.3.0）。**使用红线**：推荐 `setTrait`（布尔可共存）/ `multiplyStat`（倍率乘算）/ `setStat`（确定性覆盖）；**禁止** `setDamageType` 与视觉 `base` 覆盖——单值互斥字段的互斥场景必须走变体池（技术上不阻止，但会产生字段级碎片化）。框架默认注册 0 个 |
| `registerVariantContributor(VariantContributor contributor)` | `contributor` — 变体权重贡献者（函数式接口：`(VariantContributionSink sink) → void`；经 `sink.add(ResourceLocation variantId, AttributeModifier modifier)` 声明"变体 ID → 权重修饰符"） | `void` | 注册变体权重贡献者，为每发射击实时组装的变体池注入权重修饰符（不持久化）。修饰符复用原版 `AttributeModifier` record + Operation 三阶段语义：`ADD_VALUE` 加算 → `ADD_MULTIPLIED_BASE` 只乘基础权重 → `ADD_MULTIPLIED_TOTAL` 乘整体（零基础且无加值时结果恒 0——"火元素饰品对非火枪无效"）。仅由贡献者引入的变体以自身 `base_weight` 作为基础权重（缺省 0.0），且与默认普通弹兜底（权重 `1.0`）按比例竞争——枪械未声明 `variants`（且该枪仅此一个贡献变体）时，该变体概率 = 最终权重 /（最终权重 + 1.0）；已被枪械/插件声明的变体以声明权重为权威。框架默认注册 0 个 |
| `registerTraitHook(ResourceLocation traitId, TraitHookType type, T callback)` | `traitId` — 特性 ID；`type` — 钩子类型枚举（`ON_TICK`/`ON_HIT`/`ON_BLOCK_HIT`/`ON_EXPIRE`/`ON_REMOVE`/`ON_VISUAL_TICK`）；`callback` — 回调实现，类型须与 `type` 匹配 | `void` | 为指定特性注册运行时钩子回调。同一特性可注册多个回调，按注册顺序执行。**（0.3.0 语义）** 服务端钩子只对**携带该特性**的子弹派发（无需再在回调内自查 `getTrait`）；抛异常的钩子被记录并跳过，不影响其余钩子 |
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
| `ON_VISUAL_TICK` | onVisualTick | 快照 `ClientBulletSnapshot` + 渲染对象 `BulletRenderObject`（均以 `Object` 传入，需强转） | 仅客户端 |

> **onVisualTick 契约（修饰符叠加系统）**：子弹的视觉组合（base / scale / tint / 附加层）在**创建瞬间冻结**并缓存于 `BulletRecord.composedStyle`（服务端）→ 经 `BulletS2CPacket` 传给客户端 `BulletRenderObject`。飞行中的 `onVisualTick` 钩子要改视觉，应**直接修改 `BulletRenderObject`**（`setScale` / `setComposedTint` / `setLayers` / 换纹理等），不要试图改 `BulletSnapshot` 期望触发重新组合——组合不会在飞行中重算。

## 客户端描边注册（仅客户端）

以下 API 位于 `org.yanbwe.modularshoot.client.render.DynamicOutlineTintRegistry`，仅在客户端可用，应在客户端初始化阶段（如 `@Mod(Dist.CLIENT)` 构造函数）调用。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `register(ResourceLocation pluginId, GunOutlineTintProvider provider)` | `pluginId` — 插件定义 ID；`provider` — 每帧描边颜色提供器（函数式接口：`(ItemStack, float partialTick) → Vector4f RGBA`） | `void` | 为指定插件注册**动态描边**：凡安装该插件的枪械，其 `gun_outline` 描边颜色在渲染时逐帧取 provider 返回值（白色描边遮罩 × 每帧 tint，缓存纹理无需重建）。未注册 provider 的插件描边保持静态烘焙色。后注册的同 id provider 覆盖前者 |

**集成示例（彩虹描边）**：

```java
// 客户端初始化
DynamicOutlineTintRegistry.register(
    ResourceLocation.parse("examplemod:prismatic_core"),
    (stack, partialTick) -> {
        long time = Minecraft.getInstance().level.getGameTime() + (long) partialTick;
        float hue = (time * 6.0F) % 360.0F;
        return /* HSV→RGB 转换后的 Vector4f */;
    });
```

第一人称、第三人称与背包 GUI 统一生效。插件数据包 JSON 无需任何改动（`gun_outline` 照常声明，颜色仅作静态回退）。框架不内置动态描边演示插件——内置带 `gun_outline` 的插件（如 `modularshoot:fragment_guard`、`modularshoot:fragment_shining`）均使用静态烘焙色；需要动态描边时，为任何声明了 `gun_outline` 的插件通过 `DynamicOutlineTintRegistry.register` 注册每帧颜色提供器即可。

## 子弹同步扩展通道（0.3.0 新增）

框架同步包只携带位置/方向/视觉样式。需要给子弹附带自定义运行时字段（转速、朝向角、自定义计时器等）的模组，可在 `org.yanbwe.modularshoot.network.BulletSyncExtraRegistry` 注册扩展提供者，无需自建网络：

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `BulletSyncExtraRegistry.register(BulletSyncExtraProvider provider)` | `provider` — 扩展字节提供者（函数式接口：`BulletRecord → byte[]`；返回 `null`/空数组表示该子弹无数据） | `int`（提供者线序索引） | 注册扩展提供者。重复注册同一实例幂等，返回索引不变 |
| `BulletSyncExtraRegistry.split(byte[] payload)` | `payload` — 客户端渲染对象上的扩展载荷 | `Map<Integer, byte[]>`（提供者索引 → 字节） | 拆分扩展载荷；损坏/截断载荷降级为空映射 |

**语义与约定**：

- 服务端在同步每颗子弹时按注册顺序收集全部提供者的输出，随全量与增量条目一同下发（无数据时仅多 1 字节开销）
- 客户端经 `BulletRenderManager.getRenderObject(bulletId).getExtra()` 读取，或在 `ON_VISUAL_TICK` 钩子里从渲染对象上直接取；用 `split` 按索引取回自己的字节
- 抛异常的提供者被记录并跳过；损坏载荷降级为空映射，不会击穿客户端渲染（与框架降级哲学一致）
- 两端必须以相同相对顺序注册提供者（索引即线路身份）——双端模组列表一致时天然满足；动态字节内容则不要求两端一致（服务端权威下发）

**示例（转速同步）**：

```java
// 模组初始化（双端）
public static final int SPIN_INDEX = BulletSyncExtraRegistry.register(bullet -> {
    ByteBuffer buf = ByteBuffer.allocate(4).order(ByteOrder.LITTLE_ENDIAN);
    buf.putFloat(MyMod.getSpinSpeed(bullet)); // 你的服务端数据源
    return buf.array();
});

// 客户端消费（如 ON_VISUAL_TICK 钩子内）
Map<Integer, byte[]> parts = BulletSyncExtraRegistry.split(renderObject.getExtra());
byte[] spin = parts.get(MyMod.SPIN_INDEX);
if (spin != null) {
    float speed = ByteBuffer.wrap(spin).order(ByteOrder.LITTLE_ENDIAN).getFloat();
    // 应用到渲染对象（如驱动自定义模型旋转）
}
```

## 注册表查询

需要 `RegistryAccess` 参数（从已加载世界获取，主菜单阶段注册表为空）。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getGunDefinition(RegistryAccess registryAccess, ResourceLocation gunId)` | `registryAccess` — 运行时注册表视图；`gunId` — 枪械定义 ID | `Optional<GunDefinition>` | 查询枪械定义 |
| `getPluginDefinition(RegistryAccess registryAccess, ResourceLocation pluginId)` | `registryAccess` — 运行时注册表视图；`pluginId` — 插件定义 ID | `Optional<PluginDefinition>` | 查询插件定义 |
| `getPluginTypeDefinition(RegistryAccess registryAccess, ResourceLocation pluginTypeId)` | `registryAccess` — 运行时注册表视图；`pluginTypeId` — 插件种类 ID | `Optional<PluginTypeDefinition>` | 查询插件种类定义 |
| `getShooterDefinition(RegistryAccess registryAccess, ResourceLocation shooterId)` | `registryAccess` — 运行时注册表视图；`shooterId` — 发射者定义 ID | `Optional<ShooterDefinition>` | 查询发射者定义（独立发射配置模板）。Java API 注册的条目优先于数据包同名条目 |

## 状态访问

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getState(ItemStack gun, Player player)` | `gun` — 枪械物品堆叠；`player` — 玩家上下文（用于解析运行时注册表） | `Optional<GunState>` | 获取枪械实例的 per-gun 状态读写视图。非枪械返回空（0.3.0 起由可空改为 `Optional`）。提供 `getInt`/`setInt`/`getLong`/`setLong`/`getDouble`/`setDouble`/`getFloat`/`setFloat`/`getBoolean`/`setBoolean`/`getString`/`setString`/`getUuid`/`setUuid`/`hasState`/`clearState` 等类型化方法 |
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

## 独立发射

**独立发射**指非玩家发射源（炮塔、陷阱、Boss 攻击、脚本场景等）发射子弹的路径：快照由调用方手工构建（或从 `modularshoot:shooters` 注册表的发射者定义生成），绕过玩家射击引擎——**没有射速控制、没有射击条件（ShootPredicate）检查、没有 PreShootEvent/PostShootEvent、没有音效播放**。子弹一经注册即进入正常的 tick 循环（飞行、碰撞、伤害、特性钩子）。

**快照字段约定**：独立发射快照的 `gunId` / `gunInstanceUuid` / `shooter` 三个引擎属主字段恒为 `null`（没有发射枪械；shooter 经 `fireBullet` 末参单独传入，`null` 表示无主发射源）。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `createBulletSnapshot()` | 无 | `BulletSnapshotBuilder` | 新建独立发射快照的链式 Builder（见下方速查表）。产物恒满足快照字段约定（gunId/gunInstanceUuid/shooter 均为 null） |
| `fireBullet(Level level, Vec3 position, Vec3 direction, BulletSnapshot snapshot, UUID shooter)` | `level` — 发射维度；`position` — 发射位置；`direction` — 初始飞行方向（应已归一化，按原样进入飞行模拟）；`snapshot` — 子弹快照（Builder 或手工构造）；`shooter` — 发射者 UUID（可空，`null` = 无主发射源，传玩家 UUID 可归属伤害） | `BulletRecord` | 从非玩家源发射一颗子弹。**无射速控制、无射击条件检查、无射击事件、无音效**。快照携带 `null` 伤害类型时自动补框架默认伤害类型（从 `level.registryAccess()` 解析，缺失时抛 `IllegalStateException`），调用方可以完全省略伤害类型 |

**BulletSnapshotBuilder 链式方法速查**（`org.yanbwe.modularshoot.bullet.BulletSnapshotBuilder`）：

| 方法 | 说明 |
|------|------|
| `stat(ResourceLocation id, double value)` | 设置（或覆盖）一个冻结属性值。同 ID 重复调用后写覆盖先写 |
| `trait(ResourceLocation id, boolean value)` | 设置（或覆盖）一个激活特性标志 |
| `state(ResourceLocation id, Object value)` | 设置子弹工作记忆状态（种子值，随 `BulletS2CPacket` 初始携带；UUID 类型状态允许 `null`） |
| `style(BulletStyle style)` | 设置独立发射视觉样式，经快照的 variant style override 通道写入——服务端 compose 在无发射枪械时将其作为视觉 base/叠加修饰符来源（缺失时用框架默认外观） |
| `damageType(Holder<DamageType> holder)` | 显式指定伤害类型 holder。可选：不设置也能成功构建 |
| `build()` | 构建快照，Builder 保持可复用（已构建快照防御拷贝，事后改动 Builder 不影响产物）。**damageType 可能为 `null`**（合法——`fireBullet` 门面会补默认） |
| `build(RegistryAccess registryAccess)` | 同 `build()`，但未显式设置伤害类型时自动补框架默认（`ModularShootDamageTypes.holderOrThrow`）。解析结果缓存于 Builder，后续 `build()` 复用。`registryAccess` 不含 `DAMAGE_TYPE` 注册表（如主菜单的 `RegistryAccess.EMPTY`）时抛 `IllegalStateException` |

> **build() 与 build(RegistryAccess) 的差异**：两者产出的快照在属性/特性/视觉上完全一致，唯一区别是伤害类型——`build()` 可能留空（由 `fireBullet` 门面在发射时补默认），`build(RegistryAccess)` 立即补上默认伤害类型。手头有运行时注册表视图（如 `level.registryAccess()`）时推荐后者，快照更早完整；没有（如纯脚本上下文）用 `build()` 即可。

> **独立发射不播音效**：`fireBullet` 不播放任何声音。需要射击音效时，用 `ShooterDefinition.playShootSound(Level, Vec3)` 在发射位置播放（见 DataPack 文档「发射者 JSON」）。
