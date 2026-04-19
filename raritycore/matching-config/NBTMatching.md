# NBT匹配配置文档

**仅在1201.8.2版本后的稀有度核心支持nbt匹配.**

## 概述

NBT匹配系统允许通过物品的NBT数据来动态设置稀有度,提供了比传统ID匹配更灵活和精确的配置方式.系统支持模糊匹配模式,满足不同的配置需求.

## 配置文件位置

模组会在两个位置读取NBT匹配配置:
1. 配置文件夹:`config/raritycore/nbt_matches/`
2. 数据包:`data/[modid]/nbt_matches/`

配置文件夹里的NBT匹配配置优先级大于数据包里的.

### 基本配置结构
```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 5,
  "enabled": true,
  "description": "说明",
  "conditions": [
    // 条件组
  ]
}
```

## 核心配置参数

### 规则级别参数

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| item_id | String | 是 | 物品ID,格式为`modid:item_name` |
| fuzzy_match | Boolean | 是 | 匹配模式:true为模糊匹配 |
| priority | Integer | 是 | 优先级,数值越大优先级越高 |
| rarity | Integer | 是 | 稀有度等级(1-7) |
| enabled | Boolean | 否 | 是否启用该规则,默认true |
| description | String | 否 | 规则描述信息 |

## 匹配模式详解

### 模糊匹配 (fuzzy_match: true)

模糊匹配允许物品在满足所有要求的NBT标签情况下,还可以拥有其它的NBT标签.

例如,配置要求模糊匹配标签A和B时:

- 如果物品含A、B、C三个标签,则该物品会被匹配成功,不会因为多了一个标签C就匹配失败
- 但如果物品仅含A、C两个标签,那就无法匹配成功
- 物品仅含A一个标签也是无法匹配成功的

**示例**:
```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 5,
  "description": "附魔武器",
  "conditions": [
    {
      "path": "Enchantments",
      "type": "exists",
      "description": "有附魔"
    }
  ]
}
```
此配置会匹配所有带有附魔的钻石剑,无论有多少种附魔.

### 精确匹配 (fuzzy_match: false)

**⚠️该匹配模式暂未实现,实际表现与模糊匹配相同**

精准匹配要求物品在满足所有要求的nbt标签情况下,**不允许**拥有其它的nbt标签.

## 条件类型详解

### 1. 存在性检查 (exists)

检查指定NBT路径是否存在.

```json
{
  "path": "Yanbwe",
  "type": "exists",
  "description": "检查物品是否具有叫Yanbwe的tag"
}
```

### 2. 相等检查 (equals)

检查NBT值是否等于指定值,适用于数值、字符串、布尔值.

```json
{
  "path": "Yanbwe",
  "type": "equals",
  "value": "apple",
  "description": "检查叫Yanbwe的tag的值是否为apple"
}
```

### 3. 范围检查 (range)

检查数值是否在指定范围内.

```json
{
  "path": "Damage",
  "type": "range",
  "min": 0,
  "max": 1000,
  "description": "检测物品已损耗的耐久度是否在0到1000之间"
}
```

### 4. 包含检查 (contains)

检查字符串是否包含指定字符串.

```json
{
  "path": "Yanbwe",
  "type": "contains",
  "substring": "apple",
  "description": "检查叫Yanbwe的tag是否包含'apple'字样"
}
```

## NBT路径语法

### 相对路径访问

从物品的tag标签内部开始解析:
- `Yanbwe` - 访问tag内的Yanbwe字段
- `Damage` - 访问耐久度
- `Enchantments[0]` - 访问附魔数组第一个元素
- `Enchantments[*]` - 访问附魔数组所有元素(通配符匹配)
- `Enchantments[0].id` - 访问附魔ID
- `Enchantments[0].lvl` - 访问附魔等级

**⚠️无法访问根级路径**:目前不支持访问如`Count`、`id`等根级NBT.

### 数组访问语法

- `Enchantments[0]` - 访问数组第一个元素
- `Enchantments[*]` - 访问数组所有元素(通配符匹配)
- `Enchantments[0].id` - 访问数组元素的子元素

### 复杂嵌套访问

- `AttributeModifiers[0].AttributeName`
- `CustomPotionEffects[0].Amplifier`
- `StoredEnchantments[0].id`

## 实际应用示例

### 示例1:检测物品是否有附魔

```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "有附魔的钻石剑",
  "conditions": [
    {
      "path": "Enchantments",
      "type": "exists",
      "description": "含有附魔"
    }
  ]
}
```

### 示例2:检测是否有高等级附魔

```json
{
  "item_id": "minecraft:enchanted_book",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "有高等级附魔的附魔书",
  "conditions": [
    {
      "path": "Enchantments[*].lvl",
      "type": "range",
      "min": 3,
      "max": 999,
      "description": "含有任意等级大于3的附魔"
    }
  ]
}
```

### 示例3:匹配不详旗帜

```json
{
  "item_id": "minecraft:white_banner",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 4,
  "description": "不详旗帜",
  "conditions": [
    {
      "path": "display.Name",
      "type": "contains",
      "substring": "\"translate\":\"block.minecraft.ominous_banner\"",
      "description": "根据不详旗帜的名字包含本地化键的特点来匹配"
    }
  ]
}
```

## 注意事项

1. 请让配置文件严格遵守JSON格式规范,如果格式错误则会跳过读取
2. NBT匹配的稀有度优先级大于其它稀有度配置
3. 可以用`/raritycore reload`指令随时重载配置
4. 可以用`/raritycore details nbt`指令查看NBT匹配配置详情