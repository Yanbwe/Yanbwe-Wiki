# Item Component Matching Configuration Document

**Item component matching is only supported in RarityCore versions after a specific version.**

## Overview

The item component matching system allows dynamically setting rarity through item data components, providing a more flexible and precise configuration method compared to traditional ID matching. The system supports fuzzy matching mode to meet different configuration needs. This system fully supports Minecraft 1.21.1 data component format and can access all data components and custom data of items.

## Configuration File Locations

The mod reads item component matching configurations from two locations:
1. Configuration folder: `config/raritycore/item_data_matches/`
2. Datapack: `data/[modid]/item_data_matches/`

Configurations in the folder have higher priority than those in datapacks.

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
    // Conditions
  ]
}
```

## Core Configuration Parameters

### Rule-Level Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| item_id | String | Yes | Item ID in format `modid:item_name` |
| fuzzy_match | Boolean | Yes | Matching mode: true for fuzzy matching |
| priority | Integer | Yes | Priority, higher values mean higher priority |
| rarity | Integer | Yes | Rarity level (1-7) |
| enabled | Boolean | No | Whether to enable this rule, default true |
| description | String | No | Rule description |

## Matching Mode Details

### Fuzzy Matching (fuzzy_match: true)

Fuzzy matching allows an item to have additional components beyond the required ones.

For example, when configuration requires fuzzy matching of components A and B:
- If an item has components A, B, and C, it will match successfully and will not fail because of the extra component C
- However, if the item only has A and C, it will not match successfully
- An item with only A will also not match successfully

**Example**:
```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 100,
  "rarity": 5,
  "description": "Enchanted Weapon",
  "conditions": [
    {
      "path": "components.minecraft:enchantments",
      "type": "exists",
      "description": "Has enchantments"
    }
  ]
}
```

### Exact Matching (fuzzy_match: false)

**⚠️This matching mode is not yet implemented, actual behavior is the same as fuzzy matching**

Exact matching requires that an item, while satisfying all required item components, must NOT have any other item components.

## Condition Type Details

### 1. Existence Check (exists)

Checks if the specified item component path exists.

```json
{
  "path": "tag.Yanbwe",
  "type": "exists",
  "description": "Check if the item has custom data called Yanbwe"
}
```

### 2. Equality Check (equals)

Checks if the item component value equals the specified value, applicable to numbers, strings, and booleans.

```json
{
  "path": "tag.Yanbwe",
  "type": "equals",
  "value": "apple",
  "description": "Check if the value of custom data called Yanbwe is 'apple'"
}
```

#### Writing numeric and boolean values

Resolved item data can be several Java types: legacy NBT numeric tags are normalized to numbers (e.g. `1` becomes `1.0`), while boolean components are `true`/`false`. `equals` therefore matches leniently:

| Value you write | What it matches | Notes |
|-----------------|-----------------|-------|
| `1` or `true` | numeric `1`, `1.0`, boolean `true` | Booleans and numeric 1/0 are interchangeable |
| `0` or `false` | numeric `0`, `0.0`, boolean `false` | Same as above |
| `5` | numeric `5`, `5.0`, etc. | Numbers always compare numerically (0.001 tolerance) |
| `"apple"` | string `"apple"` | Strings compare by exact content |
| `5` | string `"5"` | **No match**: a numeric value only compares against numbers, never against text |

In other words, **write scalar data as numbers**: even when the flag shows as `1b` in game or is backed by a boolean component, both `"value": 1` and `"value": true` will match.

**Example: match items whose HideFlags is 1**

```json
{
  "path": "HideFlags",
  "type": "equals",
  "value": 1,
  "description": "Flags are usually stored as 1b; 1 and true both work"
}
```

> **Version note**: 1211.14.7 (1.21.1) and 2601.14.1 / 2602.14.1 (26.x) fixed numeric/boolean conditions failing to match flags, which previously compared as text where `1.0` and `true` could never be equal. On these versions you can rely on the table above.

### 3. Range Check (range)

Checks if a numeric value is within the specified range.

```json
{
  "path": "components.minecraft:damage",
  "type": "range",
  "min": 0,
  "max": 1000,
  "description": "Check if the item's durability loss is between 0 and 1000"
}
```

### 4. Contains Check (contains)

Checks if a string contains the specified substring.

```json
{
  "path": "tag.Yanbwe",
  "type": "contains",
  "substring": "apple",
  "description": "Check if the custom data called Yanbwe contains 'apple'"
}
```

## Item Component Path Syntax

### Root-Level Path Access

Parse from the root level of the item to access all components:
- `id` - Access item ID
- `Count` - Access item count
- `tag` - Access custom data tag
- `components` - Access data components

### Data Component Access

Access item data components (supports Minecraft 1.21.1 format):
- `components.minecraft:enchantments` - Access item enchantments
- `components.minecraft:stored_enchantments` - Access enchantments stored in enchanted books
- `components.minecraft:damage` - Access item durability
- `components.minecraft:custom_data` - Access custom components
- `components.minecraft:custom_name` - Access custom name
- `components.minecraft:lore` - Access item lore

### Custom Data Access

Access item custom data (tag):
- `tag.Yanbwe` - Access Yanbwe field within tag
- `tag.Damage` - Access custom durability data

### Array Access Syntax

- `tag.Enchantments[0]` - Access the first element of the array
- `tag.Enchantments[*]` - Access all elements of the array (wildcard matching)
- `tag.Enchantments[0].id` - Access sub-element of array element

### Complex Nested Access

- `tag.AttributeModifiers[0].AttributeName`
- `tag.CustomPotionEffects[0].Amplifier`
- `components.minecraft:enchantments.levels.minecraft:sharpness`

## Practical Application Examples

### Example 1: Check if an item has enchantments

```json
{
  "item_id": "minecraft:diamond_sword",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "Enchanted Diamond Sword",
  "conditions": [
    {
      "path": "components.minecraft:enchantments",
      "type": "exists",
      "description": "Has enchantments"
    }
  ]
}
```

### Example 2: Check if an enchanted book has high-level enchantments

```json
{
  "item_id": "minecraft:enchanted_book",
  "fuzzy_match": true,
  "priority": 200,
  "rarity": 6,
  "description": "Enchanted book with high-level enchantments",
  "conditions": [
    {
      "path": "components.minecraft:stored_enchantments.levels.minecraft:sharpness",
      "type": "range",
      "min": 3,
      "max": 999,
      "description": "Sharpness level greater than or equal to 3"
    }
  ]
}
```

## Notes

1. Please ensure configuration files strictly comply with JSON format specifications. If the format is incorrect, reading will be skipped.
2. Item component matching rarity has higher priority than other rarity configurations.
3. You can use `/raritycore reload` command to reload configurations at any time.
4. You can use `/raritycore details item_data` command to view item component matching configuration details.
5. Paths are case-sensitive. Please ensure path names match the actual data component names.
6. Data component names usually require full namespace format, such as `minecraft:enchantments`.