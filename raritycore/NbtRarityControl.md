# 游戏内物品 NBT 标签控制稀有度

**Ver.13 新增功能**

通过给物品添加 `raritycore:data` NBT 标签,可以在游戏内直接控制该物品的稀有度表现。此功能由 `server.json` 中的 `enableNbtRarityControl` 开关控制(**默认关闭**)。

## 开启方式

在 `config/raritycore/server.json` 中设置:

```json
{
  "enableNbtRarityControl": true
}
```

然后执行 `/raritycore reload` 使其生效。

## NBT 标签结构

物品需要包含以下 NBT 标签:

```
raritycore:data
├── Level (int)           # 稀有度等级
├── Color (string)        # RGB 颜色,如 "#FFAA00"
├── Tooltips (bool)       # 是否显示工具提示
├── Renderer (bool)       # 是否渲染边框
├── NameColor (bool)      # 是否修改名称颜色
└── TextureBorder (string) # 纹理路径
```

**所有字段均为可选**,未提供的字段走常规配置。

## 使用示例

### 通过命令给物品添加 NBT 标签

使用 `/give` 命令:

```
/give @p minecraft:diamond_sword{raritycore:data:{Level:6,Color:"#FF6666"}}
```

### 通过其他模组添加

任何可以修改物品 NBT 的模组都可以设置此标签:

```java
// Java 代码示例
CompoundTag tag = itemStack.getOrCreateTag();
CompoundTag data = new CompoundTag();
data.putInt("Level", 6);
data.putString("Color", "#FF6666");
data.putBoolean("Tooltips", true);
data.putBoolean("Renderer", true);
data.putBoolean("NameColor", true);
tag.put("raritycore:data", data);
```

## 规则

| 条件 | 行为 |
|------|------|
| `Level` 未设置 | 不生效,视为无稀有度,回退到常规查询 |
| `Level` = 0 | 视为无稀有度,回退到常规查询 |
| `Level` > 0 | **优先级凌驾一切** (包括 NBT 匹配配置) |
| `Level` > 7 | 外观与等级 7 相同,但内部记录为实际值 |
| `Color` 未设置 | 走常规配置 (RarityClientConfig 或默认色) |
| `Tooltips` 等未设置 | 默认启用 |

## 优先级

物品的 `raritycore:data.Level` > 0 时具有**最高优先级**,覆盖:

- NBT 匹配规则
- FinalRarity.json
- TagRarity
- 自动稀有度计算
- 原版稀有度
- Apotheosis / Iron's Spellbooks 适配器

## 注意事项

- 此功能默认关闭,以免影响性能(每个物品都需要检查 NBT)
- NBT 控制的稀有度不参与网络同步——每个客户端独立检查物品 NBT
- 缓存不会污染原物品 ID 的稀有度
