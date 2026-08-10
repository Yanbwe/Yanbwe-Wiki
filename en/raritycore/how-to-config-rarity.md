# **Rarity Explanation**

Before assigning rarities to items, you need to understand what rarity means in this mod.

As the name suggests, rarity is a characteristic of an item that represents how rare the item is. The harder an item is to obtain, the higher its rarity should be.

Many people misunderstand rarity as representing item quality, which is wrong! **Rarity ≠ Quality**!

An item deserves a high rarity if it requires great effort or good luck to obtain, even if the item has no practical use.

On the other hand, an item that can be crafted from dirt but has effects stronger than golden apples does not deserve a high rarity.

# Regular Rarity Configuration

The main rarity configuration in RarityCore is based on item IDs. First, prepare some JSON files with the following format:

```json
{
  "minecraft:item_id": rarity_value,
  "another_mod:item_id": rarity_value,
  ...
}
```

List item rarities one by one.

RarityCore reads rarity data from the following locations:

1. `config\raritycore\auto\auto_rarity.json`
2. (Datapack) `data\<namespace>\rarity\*.json`
3. `config\raritycore\FinalRarityConfig\*.json`
4. `config\raritycore\FinalRarity.json`

Place your rarity data in these JSON files and RarityCore will load them.

> **Loading Priority:**
>
> RarityCore loads rarity configurations in the order above. Later-loaded configs override earlier ones for the same item.

## 0. Auto Rarity Calculation

RarityCore's signature feature — automatically evaluates item rarity based on crafting recipes.

Run `/raritycore recalculate-auto` to start auto calculation.

Results are stored in `config\raritycore\auto\auto_rarity.json`.

If `auto_rarity.json` doesn't exist on server startup, auto calculation runs automatically.

Limitation: only supports crafting table, furnace, and smithing table recipes — not all items can be calculated, especially in tech modpacks. More recipe types will be supported in the future.

## 1. Using Game Commands

1. `/raritycore sethand <rarity>` — Set held item rarity
2. `/raritycore removehand` — Remove held item rarity
3. `/raritycore setrarity <item> <rarity>` — Set specified item rarity
4. `/raritycore removerarity <item>` — Remove specified item rarity

Changes are saved to `config/raritycore/FinalRarity.json`.

## 2. Using Edit Mode

For quick and controllable rarity editing, use edit mode.

> **Ver.13 Update**: Edit mode has been refactored with Normal and FullMatch modes.

### Edit Mode Commands

```
/raritycore edit toggle <true|false>
/raritycore edit mode <normal|fullmatch>
/raritycore edit parameter rarity <value>
/raritycore edit parameter autoReload <true|false>
/raritycore edit parameter stringContains <true|false>
/raritycore edit parameter ignore "<aa|bb|cc>"
```

### Normal Mode

Writes item rarity to `FinalRarity.json`, same as before.

- `rarity=0` means "no rarity" (equivalent to delete)
- Shortcuts: `Ctrl+1`~`Ctrl+7` select level, `Ctrl+0` clear rarity

### FullMatch Mode

Creates **NBT match config files** using all of the item's current NBT tags as match conditions.

**Use case**: distinguishing items with the same ID but different NBT sub-tags (potion types, enchantment levels, etc.)

**Behavior**:
- Clicking an item generates `edit_<itemId>_<N>.json` in `config/raritycore/nbt_matches/`
- String-type tags use **contains** matching by default; set `stringContains=false` for exact matching
- Other tag types use exact (equals) matching
- Tags specified in `ignore` are excluded from matching
- Default does not auto-reload; set `autoReload=true` for immediate effect

**Parameters:**

| Parameter | Default | Description |
|-----------|---------|-------------|
| `rarity` | 1 | Rarity level to assign (≥0) |
| `autoReload` | false | Auto-reload config after generation |
| `stringContains` | true | Use contains matching for string-type NBT |
| `ignore` | (empty) | NBT tags to exclude, separated by `\|` |

### GUI Panel

When edit mode is active, a floating panel appears in the top-left corner of all GUIs (drag the empty area of the panel to reposition it; it cannot be dragged off-screen. The position is memory-only and resets to the top-left on restart):

- **Current mode** (Normal/FullMatch) — click to toggle
- **Rarity level** — `[-]` `[+]` buttons for quick adjustment
- **FullMatch extra params**: AutoReload, StrContains, Ignore (display only)
- `Ctrl+H` to collapse/expand the panel
- Drag the empty area of the panel to move it

## 3. Tag-Based Batch Rarity Assignment

For modpacks with many mods, configuring each item individually is time-consuming. The TagRarity feature allows batch assignment via Minecraft's Tag system.

Config file: `config/raritycore/TagRarity.json`

Format:
```json
{
  "tag_rules": [
    { "tag": "forge:ingots/netherite", "rarity": 5 },
    { "tag": "forge:gems/diamond", "rarity": 4 },
    { "tag": "minecraft:swords", "rarity": 2 }
  ]
}
```

**Rules:**
- `tag`: Minecraft TagKey, e.g. `forge:ingots/netherite`, `minecraft:swords`
- `rarity`: level 1-7
- Items matching multiple tags get the **highest rarity**
- Items from any mod automatically inherit rarity if they have the matching tag
- **Priority**: above auto rarity, below manual config (FinalRarity.json)

## 999. Item Data-Based Configuration

For rarity configuration based on NBT tags/item components, see [NBT Matching](/raritycore/matching-config/NBTMatching) and [Item Component Matching](/raritycore/matching-config/ItemComponentMatching).
