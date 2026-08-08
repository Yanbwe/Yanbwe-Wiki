# API 参考

`ModularAmmoAPI` 公开静态方法速查。方法按功能分组。

## 绑定与查询

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `bindGun(ResourceLocation gunId, ResourceLocation ammoTypeId)` | `gunId` — 枪械 id（`modularshoot:guns` 注册表）；`ammoTypeId` — 弹药类型 id（`modularshootammo:ammo_types` 注册表） | `void` | Java API 绑定枪械→弹药。Java 绑定**优先于数据包**且**跨 `/reload` 存活**，已发放的同 id 枪械立即生效 |
| `getAmmoTypeIdForGun(RegistryAccess ra, ResourceLocation gunId)` | `ra` — 运行时注册表视图；`gunId` — 枪械 id | `Optional<ResourceLocation>` | 查询枪械绑定的弹药类型 id（Java 优先 + 数据包兜底），未绑定返回空 |
| `getAmmoType(RegistryAccess ra, ResourceLocation ammoTypeId)` | `ra` — 运行时注册表视图；`ammoTypeId` — 弹药类型注册表 id | `Optional<AmmoType>` | 按 id 查询弹药类型定义 |

## 特性判断

特性为**最终合并值**（枪械基础值 + 插件贡献，经框架 `TraitMergeService` 合并），未声明一律返回 `false`。

| 方法签名 | 参数说明 | 返回值 | 说明 |
|---------|---------|--------|------|
| `isUsesAmmo(ItemStack gun, RegistryAccess ra)` | `gun` — 枪械物品；`ra` — 运行时注册表视图 | `boolean` | 枪械是否启用弹药系统（`uses_ammo` 特性） |
| `isInfiniteAmmo(ItemStack gun, RegistryAccess ra)` | 同上 | `boolean` | 枪械是否豁免扣弹（`infinite_ammo` 特性，HUD 显示 ∞） |

## 注册表 key

数据包动态注册表在 `ModularAmmoRegistries` 中声明（mod 总线 `DataPackRegistryEvent.NewRegistry` 注册，支持 `/reload`，网络同步客户端）：

| 常量 | 注册表 ID | 条目类型 | 用途 |
|------|----------|---------|------|
| `AMMO_TYPES_KEY` | `modularshootammo:ammo_types` | `AmmoType` | 弹药类型定义（名称、颜色、物品、备弹上限、每发消耗、换弹音效） |
| `GUN_AMMO_BINDINGS_KEY` | `modularshootammo:gun_ammo_bindings` | `GunAmmoBinding` | 枪械→弹药绑定表 |

## 数据类型

### AmmoType（record）

| 字段 | 类型 | 说明 |
|------|------|------|
| `name()` | `String` | 显示名，支持 `lang:` 前缀 |
| `color()` | `int` | 标识颜色 ARGB（JSON 中为 `"#RRGGBB"` 字符串） |
| `item()` | `ResourceLocation` | 弹药物品 id |
| `reserveLimit()` | `Integer`（可空） | 备弹上限，未声明为 `null` |
| `perShotCost()` | `int` | 每发消耗弹药数，默认 1 |
| `reloadSound()` | `ResourceLocation`（可空） | 换弹音效覆盖，未声明为 `null` |

### GunAmmoBinding（record）

| 字段 | 类型 | 说明 |
|------|------|------|
| `ammoType()` | `ResourceLocation` | 绑定的弹药类型 id |

## 使用示例

```java
// 代码绑定：把一把步枪绑定到 rifle_ammo
ModularAmmoAPI.bindGun(
        ResourceLocation.fromNamespaceAndPath("mymod", "assault_rifle"),
        ResourceLocation.fromNamespaceAndPath("modularshootammo", "rifle_ammo"));

// 查询主手枪械的弹药信息
ItemStack gun = player.getMainHandItem();
RegistryAccess ra = player.registryAccess();
if (ModularAmmoAPI.isUsesAmmo(gun, ra)) {
    Optional<AmmoType> type = ModularAmmoAPI.getAmmoTypeIdForGun(ra, ModularShootAPI.getGunId(gun))
            .flatMap(id -> ModularAmmoAPI.getAmmoType(ra, id));
    type.ifPresent(t -> System.out.println("ammo item: " + t.item()));
}
```
