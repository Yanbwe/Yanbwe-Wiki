# 物品组件匹配配置文档

**仅在1.21.1版本后的稀有度核心支持物品组件匹配.**

## 概述

物品数据匹配系统允许通过物品的数据组件来动态设置稀有度,提供了比传统ID匹配更灵活和精确的配置方式.系统支持模糊匹配模式,满足不同的配置需求.该系统完全支持Minecraft 1.21.1的数据组件格式,可以访问物品的所有数据组件和自定义数据.

## 配置文件位置

模组会在两个位置读取物品数据匹配配置:
1. 配置文件夹:`config/raritycore/item_data_matches/`
2. 数据包:`data/[modid]/item_data_matches/`

配置文件夹里的物品数据匹配配置优先级大于数据包里的.

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

模糊匹配允许物品在满足所有要求的物品组件情况下,还可以拥有其它的物品组件.

例如,配置要求模糊匹配组件A和B时:

- 如果物品含A、B、C三个组件,则该物品会被匹配成功,不会因为多了一个组件C就匹配失败
- 但如果物品仅含A、C两个组件,那就无法匹配成功
- 物品仅含A一个组件也是无法匹配成功的

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
      "path": "components.minecraft:enchantments",
      "type": "exists",
      "description": "有附魔"
    }
  ]
}
```

### 精确匹配 (fuzzy_match: false)

**⚠️该匹配模式暂未实现,实际表现与模糊匹配相同**

精准匹配要求物品在满足所有要求的物品组件情况下,**不允许**拥有其它的物品组件.

## 条件类型详解

### 1. 存在性检查 (exists)

检查指定物品组件路径是否存在.

```json
{
  "path": "tag.Yanbwe",
  "type": "exists",
  "description": "检查物品是否具有叫Yanbwe的自定义数据"
}
```

### 2. 相等检查 (equals)

检查物品组件值是否等于指定值,适用于数值、字符串、布尔值.

```json
{
  "path": "tag.Yanbwe",
  "type": "equals",
  "value": "apple",
  "description": "检查叫Yanbwe的自定义数据的值是否为apple"
}
```

### 3. 范围检查 (range)

检查数值是否在指定范围内.

```json
{
  "path": "components.minecraft:damage",
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
  "path": "tag.Yanbwe",
  "type": "contains",
  "substring": "apple",
  "description": "检查叫Yanbwe的自定义数据是否包含'apple'字样"
}
```

## 物品组件路径语法

### 根级路径访问

从物品的根级开始解析,可以访问所有物品组件:
- `id` - 访问物品ID
- `Count` - 访问物品数量
- `tag` - 访问自定义数据标签
- `components` - 访问数据组件

### 数据组件访问

访问物品的数据组件(支持Minecraft 1.21.1格式):
- `components.minecraft:enchantments` - 访问物品附魔
- `components.minecraft:stored_enchantments` - 访问附魔书存储的附魔
- `components.minecraft:damage` - 访问物品耐久度
- `components.minecraft:custom_data` - 访问自定义组件
- `components.minecraft:custom_name` - 访问自定义名称
- `components.minecraft:lore` - 访问物品描述

### 自定义数据访问

访问物品的自定义数据(tag):
- `tag.Yanbwe` - 访问tag内的Yanbwe字段
- `tag.Damage` - 访问自定义耐久度数据

### 数组访问语法

- `tag.Enchantments[0]` - 访问数组第一个元素
- `tag.Enchantments[*]` - 访问数组所有元素(通配符匹配)
- `tag.Enchantments[0].id` - 访问数组元素的子元素

### 复杂嵌套访问

- `tag.AttributeModifiers[0].AttributeName`
- `tag.CustomPotionEffects[0].Amplifier`
- `components.minecraft:enchantments.levels.minecraft:sharpness`

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
      "path": "components.minecraft:enchantments",
      "type": "exists",
      "description": "含有附魔"
    }
  ]
}
```

### 示例2:检测附魔书是否有高等级附魔

```json
{
  "item_id": "minecraft:enchanted_book",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "有高等级附魔的附魔书",
  "conditions": [
    {
      "path": "components.minecraft:stored_enchantments.levels.minecraft:sharpness",
      "type": "range",
      "min": 3,
      "max": 999,
      "description": "锋利等级大于等于3"
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
      "path": "components.minecraft:item_name",
      "type": "contains",
      "substring": "\"translate\":\"block.minecraft.ominous_banner\"",
      "description": "根据不详旗帜的名字包含本地化键的特点来匹配，应该使用包含模式，使用相等模式会有神秘bug"
    }
  ]
}
```

## 注意事项

1. 请让配置文件严格遵守JSON格式规范,如果格式错误则会跳过读取
2. 物品数据匹配的稀有度优先级大于其它稀有度配置
3. 可以用`/raritycore reload`指令随时重载配置
4. 可以用`/raritycore details item_data`指令查看物品数据匹配配置详情
5. 路径区分大小写,请确保路径名与实际数据组件名一致
6. 数据组件名通常需要使用完整的命名空间格式,如`minecraft:enchantments`