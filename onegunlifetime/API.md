# API 参考

`OneGunLifetimeAPI` 公开静态方法速查，供其他模组以编程方式使用灵魂绑定能力，无需依赖指令。方法按功能分组。

**通用约定**：变更类方法一律要求 `ServerPlayer`（服务端权威），返回结果对象而非抛出业务异常；查询类方法接受 `Player`。插件变更走 ModularShoot 安装/拆卸管线，灵魂数据回写、全服广播与属性刷新自动完成，无需额外调用。

## 查询

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `getSoulData(Player player)` | `player` — 目标玩家 | `Optional<SoulData>` | 玩家灵魂数据（模板枪、属性覆写、特性、插件、枪状态等），未绑定返回空 |
| `isBound(Player player)` | `player` — 目标玩家 | `boolean` | 玩家是否已绑定 |
| `getOwnerOf(ItemStack gunStack)` | `gunStack` — 任意物品堆 | `Optional<UUID>` | 若该物品堆是某玩家的投影枪，返回其主人 UUID；非投影枪返回空 |
| `getPlugins(Player player)` | `player` — 目标玩家 | `List<PluginInstance>` | 当前插件列表（有序），未绑定返回空列表 |
| `getGunState(Player player)` | `player` — 目标玩家 | `Optional<CompoundTag>` | 运行时枪状态 NBT，未绑定返回空 |
| `getEffectiveValues(ServerPlayer player)` | `player` — 目标玩家 | `Map<ResourceLocation, Double>` | 全部玩家可用逻辑属性的**最终数值**（基础值 + 覆写 + 特性 + 插件加成），未绑定返回空 Map。Map 按 `attribute_meta` 注册表顺序迭代。纯计算无实体访问，频繁调用请缓存结果 |

## 生命周期

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `bindAndGive(ServerPlayer player, ResourceLocation templateGunId)` | `player` — 目标玩家；`templateGunId` — 已注册枪械模板 id | `BindResult` | 一步式绑定：校验模板注册 → 绑定灵魂 → 发放投影枪（背包满则掉落脚下）→ 刷新属性 |
| `unbindAll(ServerPlayer player)` | `player` — 目标玩家 | `boolean` | 完整解绑：解绑 + 清除本模组挂载的全部属性修饰符 + 清空主背包/盔甲/副手中的本人投影枪。未绑定时返回 `false`（幂等安全） |
| `rescan(ServerPlayer player)` | `player` — 目标玩家 | `void` | 立即强制一次完整背包扫描（去重、同化异枪、补回投影、插件回填），未绑定玩家无效果 |

## 属性与特性

带注册表校验：属性 id 必须在 `modularshoot:attribute_meta` 注册表，特性 id 必须在 `modularshoot:traits` 注册表，数值必须为有限小数。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `setStatOverride(ServerPlayer player, ResourceLocation key, double value)` | `key` — 逻辑属性 id；`value` — 新数值 | `MutationResult` | 写入单条属性覆写并刷新 |
| `removeStatOverride(ServerPlayer player, ResourceLocation key)` | `key` — 逻辑属性 id | `MutationResult` | 删除单条属性覆写并刷新 |
| `clearStatOverrides(ServerPlayer player)` | — | `MutationResult` | 清空全部属性覆写并刷新 |
| `addTrait(ServerPlayer player, ResourceLocation traitId)` | `traitId` — 特性 id | `MutationResult` | 添加特性并刷新 |
| `removeTrait(ServerPlayer player, ResourceLocation traitId)` | `traitId` — 特性 id | `MutationResult` | 移除特性并刷新 |

## 插件与枪态

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `addPlugin(ServerPlayer player, ResourceLocation pluginId)` | `pluginId` — 插件定义 id | `PluginChangeResult` | 按插件 id 将插件安装到玩家投影枪上，复用框架完整安装校验（槽位类型、容量、锁定）。安装副本写回原槽位；失败原因见 `rejectionReason()`。**背包无投影枪时返回 `NO_PROJECTION` 而不是静默发新枪** |
| `removePlugin(ServerPlayer player, UUID pluginInstanceUuid)` | `pluginInstanceUuid` — 插件实例 UUID | `PluginChangeResult` | 按实例 UUID 从投影枪拆卸插件（不强制解锁），拆下的插件物品返还玩家背包（满则掉落脚下）。拒绝时结果携带结构化的 `uninstallReason()`（锁定 / UUID 未找到等） |
| `setGunState(ServerPlayer player, CompoundTag state)` | `state` — 新枪状态 NBT | `MutationResult` | 替换运行时枪状态。未绑定返回 `NOT_BOUND` |

## 结果类型

### BindResult（枚举）

| 值 | 含义 |
|----|------|
| `SUCCESS` | 绑定成功，玩家已获得投影枪 |
| `ALREADY_BOUND` | 玩家已有灵魂绑定 |
| `NOT_REGISTERED` | 模板枪械 id 未在 ModularShoot 注册 |

### MutationResult（枚举）

| 值 | 含义 |
|----|------|
| `SUCCESS` | 操作成功 |
| `NOT_BOUND` | 玩家未绑定 |
| `INVALID_ATTRIBUTE` | 属性 id 未注册 |
| `INVALID_VALUE` | 数值不是有限小数 |
| `INVALID_TRAIT` | 特性 id 未注册 |

### PluginChangeResult（record）

| 成员 | 说明 |
|------|------|
| `status()` | `SUCCESS` / `NOT_BOUND` / `NO_PROJECTION`（背包无投影枪）/ `UNKNOWN_PLUGIN`（插件 id 未注册）/ `NOT_INSTALLED`（框架拒绝） |
| `uninstallReason()` | 结构化拆卸拒绝原因（`UninstallResult.Reason` 枚举：锁定、UUID 未找到等），仅拆卸被框架拒绝时非空 |
| `rejectionReason()` | 可本地化的安装拒绝原因（框架安装错误信息），仅安装被框架拒绝时非空 |
| `success()` | 便捷判断：`status == SUCCESS` |

## 使用示例

```java
// 一步式绑定：绑定 + 发枪 + 刷新属性
BindResult result = OneGunLifetimeAPI.bindAndGive(
        player, ResourceLocation.fromNamespaceAndPath("modularshoot", "demo_pistol"));
if (result != BindResult.SUCCESS) {
    player.sendSystemMessage(Component.literal("bind failed: " + result));
}

// 读取玩家的最终数值面板
Map<ResourceLocation, Double> values = OneGunLifetimeAPI.getEffectiveValues(player);
double damage = values.getOrDefault(
        ResourceLocation.fromNamespaceAndPath("modularshoot", "bullet_damage"), 0.0);

// 编程式装卸插件
PluginChangeResult added = OneGunLifetimeAPI.addPlugin(
        player, ResourceLocation.fromNamespaceAndPath("modularshoot", "scope_basic"));
if (!added.success()) {
    player.sendSystemMessage(added.rejectionReason());
}
```
