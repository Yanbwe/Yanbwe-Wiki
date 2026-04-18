# NBT Matching Configuration Documentation

**RarityCore only supports NBT matching in versions after 1201.8.2.**

## Overview

The NBT matching system allows dynamically setting rarity through item NBT data, providing a more flexible and precise configuration method than traditional ID matching. The system supports fuzzy matching mode to meet different configuration needs.

## Configuration File Location

The mod reads NBT matching configurations from two locations:
1. Configuration folder: `config/raritycore/nbt_matches/`
2. Datapack: `data/[modid]/nbt_matches/`

NBT matching configurations in the configuration folder have higher priority than those in datapacks.

### Basic Configuration Structure
```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 5,
  "enabled": true,
  "description": "Description",
  "conditions": [
    // Condition groups
  ]
}
```

## Core Configuration Parameters

### Rule-Level Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| item_id | String | Yes | Item ID, format `modid:item_name` |
| fuzzy_match | Boolean | Yes | Matching mode: true for fuzzy matching |
| priority | Integer | Yes | Priority, higher values have higher priority |
| rarity | Integer | Yes | Rarity level (1-7) |
| enabled | Boolean | No | Whether to enable this rule, default true |
| description | String | No | Rule description information |

## Matching Mode Details

### Fuzzy Matching (fuzzy_match: true)

Fuzzy matching allows items to have additional NBT tags beyond those required while still matching successfully.

For example, when configuring fuzzy matching for tags A and B:

- If an item contains tags A, B, and C, it will match successfully and won't fail due to the extra tag C
- But if an item only contains tags A and C, it cannot match successfully
- An item with only tag A also cannot match successfully

**Example**:
```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 5,
  "description": "Enchanted weapon",
  "conditions": [
    {
      "path": "Enchantments",
      "type": "exists",
      "description": "Has enchantments"
    }
  ]
}
```

### Exact Matching (fuzzy_match: false)

**⚠️This matching mode is not yet implemented, actual behavior is the same as fuzzy matching**

Exact matching requires items to have exactly the specified NBT tags and **not** allow additional NBT tags.

## Condition Types Details

### 1. Existence Check (exists)

Checks whether the specified NBT path exists.

```json
{
  "path": "Yanbwe",
  "type": "exists",
  "description": "Check if the item has a tag called Yanbwe"
}
```

### 2. Equality Check (equals)

Checks whether the NBT value equals the specified value, applicable to numbers, strings, and booleans.

```json
{
  "path": "Yanbwe",
  "type": "equals",
  "value": "apple",
  "description": "Check if the value of tag Yanbwe is 'apple'"
}
```

### 3. Range Check (range)

Checks whether a numeric value is within the specified range.

```json
{
  "path": "Damage",
  "type": "range",
  "min": 0,
  "max": 1000,
  "description": "Check if the item's consumed durability is between 0 and 1000"
}
```

### 4. Containment Check (contains)

Checks whether a string contains the specified substring.

```json
{
  "path": "Yanbwe",
  "type": "contains",
  "substring": "apple",
  "description": "Check if tag Yanbwe contains the string 'apple'"
}
```

## NBT Path Syntax

### Relative Path Access

Parsing starts from within the item's tag:
- `Yanbwe` - Access Yanbwe field within tag
- `Damage` - Access durability
- `Enchantments[0]` - Access first element of enchantments array
- `Enchantments[*]` - Access all elements of enchantments array (wildcard matching)
- `Enchantments[0].id` - Access enchantment ID
- `Enchantments[0].lvl` - Access enchantment level

**⚠️Cannot access root-level paths**: Currently does not support accessing root-level NBT such as `Count`, `id`, etc.

### Array Access Syntax

- `Enchantments[0]` - Access first element of array
- `Enchantments[*]` - Access all elements of array (wildcard matching)
- `Enchantments[0].id` - Access sub-element of array element

### Complex Nested Access

- `AttributeModifiers[0].AttributeName`
- `CustomPotionEffects[0].Amplifier`
- `StoredEnchantments[0].id`

## Practical Application Examples

### Example 1: Detect items with enchantments

```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "Diamond sword with enchantments",
  "conditions": [
    {
      "path": "Enchantments",
      "type": "exists",
      "description": "Contains enchantments"
    }
  ]
}
```

### Example 2: Detect high-level enchantments

```json
{
  "item_id": "minecraft:enchanted_book",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "Enchanted book with high-level enchantments",
  "conditions": [
    {
      "path": "Enchantments[*].lvl",
      "type": "range",
      "min": 3,
      "max": 999,
      "description": "Contains any enchantment with level greater than 3"
    }
  ]
}
```

## Notes

1. Please ensure configuration files strictly comply with JSON format specifications. If the format is incorrect, reading will be skipped.
2. NBT matching rarity has higher priority than other rarity configurations.
3. You can use `/raritycore reload` command to reload configurations at any time.
4. You can use `/raritycore details nbt` command to view NBT matching configuration details.