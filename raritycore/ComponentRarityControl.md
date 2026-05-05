# 组件稀有度控制 (1.21.1)

**Ver.13 新增功能**

> **与 1.20.1 的区别**：Minecraft 1.21.1 NeoForge 中，自定义数据不再直接挂在物品的顶层 NBT 标签上，而是通过 `DataComponents.CUSTOM_DATA` 组件包裹。因此 1.21.1 版本使用 **DataComponent 控制** 替代旧的 NBT 标签控制。

通过物品的 `DataComponents.CUSTOM_DATA` 中存储 `raritycore` 数据，可以在游戏内直接控制该物品的稀有度表现。此功能由 `server.json` 中的 `enableComponentRarityControl` 开关控制（**默认关闭**）。

## 开启方式

在 `config/raritycore/server.json` 中设置：

```json
{
  "enableComponentRarityControl": true
}
```

执行 `/raritycore reload` 使其生效。

## 数据存储位置 (1.21.1)

```
ItemStack
└── DataComponents.CUSTOM_DATA (CompoundTag)
    └── "raritycore" (CompoundTag)
        ├── Level (int)          — 稀有度等级
        ├── Color (string)       — RGB 颜色，如 "#FFAA00"
        ├── Tooltips (bool)      — 是否显示工具提示
        ├── Renderer (bool)      — 是否渲染边框
        ├── NameColor (bool)     — 是否修改名称颜色
        └── TextureBorder (string) — 纹理路径
```

**所有字段均为可选**，未提供的字段走常规配置。

## 使用示例

### 通过 /give 命令 (1.21.1 组件语法)

```
/give @p minecraft:diamond_sword[minecraft:custom_data={raritycore:{Level:6,Color:"#FF6666"}}]
```

### 通过 Java 代码

```java
import net.minecraft.core.component.DataComponents;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.world.item.ItemStack;

// 获取或创建 CUSTOM_DATA 组件
CompoundTag customData = itemStack.getOrDefault(DataComponents.CUSTOM_DATA, CompoundTag.EMPTY).copy();

// 创建 raritycore 子标签
CompoundTag rarityCoreTag = new CompoundTag();
rarityCoreTag.putInt("Level", 6);
rarityCoreTag.putString("Color", "#FF6666");
rarityCoreTag.putBoolean("Tooltips", true);
rarityCoreTag.putBoolean("Renderer", true);
rarityCoreTag.putBoolean("NameColor", true);

// 写入并应用
customData.put("raritycore", rarityCoreTag);
itemStack.set(DataComponents.CUSTOM_DATA, customData);
```

### 通过 KubeJS

```javascript
PlayerEvents.tick(event => {
    let stack = event.player.mainHandItem;
    if (stack.id === "minecraft:diamond_sword") {
        let nbt = stack.nbt || {};
        nbt.raritycore = { Level: 6, Color: "#FF6666" };
        stack.nbt = nbt;
    }
});
```

## 规则

| 条件 | 行为 |
|------|------|
| `Level` 未设置 | 不生效，回退到常规稀有度查询 |
| `Level` = 0 | 视为无稀有度（等同于默认值 1） |
| `Level` > 0 | **优先级凌驾一切** — 最高优先级 |
| `Color` 未设置 | 走 RarityClientConfig 配置或默认颜色 |
| `Tooltips` 等未设置 | 默认启用 |

## 优先级

组件控制为**最高优先级**，覆盖：

```
组件控制 (本功能)                   ← 最高
  ↓
Item Data 匹配规则
  ↓
Apotheosis 神化适配器
  ↓
Iron's Spells 法术适配器
  ↓
ITEM_RARITY_MAP (FinalRarity.json)
  ↓
TagRarity (TagRarity.json)
  ↓
AUTO_RARITY_MAP (自动计算)
  ↓
原版稀有度
```

## 性能注意事项

- 此功能默认关闭，开启后每个物品栈在查询稀有度时都需要检查 `CUSTOM_DATA` 组件
- 使用独立的 **组件缓存**（`ComponentCacheManager`），基于物品 DataComponent 哈希存储，不会污染同一物品 ID 的普通物品缓存
- 仅在确实需要动态控制稀有度时开启

## 版本迁移 (1.20.1 → 1.21.1)

| 1.20.1 | 1.21.1 |
|--------|--------|
| `enableNbtRarityControl` | `enableComponentRarityControl` |
| `{raritycore:{Level:6}}` | `[minecraft:custom_data={raritycore:{Level:6}}]` |
| `tag.getCompound("raritycore:data")` | `stack.get(DataComponents.CUSTOM_DATA).copyTag().getCompound("raritycore")` |
