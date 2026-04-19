# **Rarity Explanation**

Before assigning rarities to items, you need to understand what rarity means in this mod.

As the name suggests, rarity is a characteristic of an item that represents how rare the item is. The harder an item is to obtain, the higher its rarity should be.

Many people misunderstand rarity as representing item quality, which is wrong! **Rarity ≠ Quality**!

An item deserves a high rarity if it requires great effort or good luck to obtain, even if the item has no practical use.

On the other hand, an item that can be crafted with just dirt but has effects superior to a golden apple does not deserve a high rarity despite its utility.

# Regular Rarity Configuration

The most important rarity configuration in RarityCore is based on item ID. First, we need to prepare some JSON files, and in these files, we should write:

```json
{
  "minecraft:item_id": rarity_value,
  "another_mod:item_id": rarity_value,
  ...
}
```

List the item rarities one by one like this.

After that, RarityCore will read rarity information from the following locations:

1. `config\raritycore\auto\auto_rarity.json`
2. (Datapack) `data\<namespace>\rarity\*.json`
3. `config\raritycore\FinalRarityConfig\*.json`
4. `config\raritycore\FinalRarity.json`

Write your rarity information in these JSON files, and RarityCore will read them.

> **Loading Priority Note:**
>
> Note that RarityCore loads rarity configurations in the order above, and later-loaded configurations will override earlier-loaded configurations for the same items.

Manually typing item IDs is too tedious. Is there a faster way? Yes, there is!

## 0. Auto Rarity Calculation Feature

The most distinctive feature of RarityCore - automatically calculates item rarity based on crafting recipes without manual operation.

Simply run the command `/raritycore recalculate-auto` to start the auto rarity calculation.

The calculated rarity is stored in `config\raritycore\auto\auto_rarity.json`.

If the `auto_rarity.json` file does not exist after the server starts, the auto rarity calculation will run automatically.

The disadvantage is that it only supports crafting table, furnace, and smithing table recipes, which means not all item rarities can be calculated. This is particularly noticeable in tech integration packs. More recipe types will be supported in the future.

## 1. Adding via Game Commands

1. `/raritycore sethand <rarity>` Sets the rarity of the currently held item
2. `/raritycore removehand` Removes the rarity configuration of the currently held item
3. `/raritycore setrarity <item> <rarity>` Sets the rarity of a specified item
4. `/raritycore removerarity <item>` Removes the rarity configuration of a specified item

Rarities modified using the above methods will be stored in the `config\raritycore\FinalRarity.json` file.

## 2. Using Edit Mode

If you want to modify item rarity quickly and controllably, you can use edit mode.

`/raritycore edit enable/disable/toggle` Edit mode control

After that, you can modify item rarity as follows:

1. In any game interface (inventory, chest, crafting table, etc.)
2. Click on the item whose rarity you want to modify

Hold the `Ctrl` key and press the corresponding number key to switch to the specified rarity level. You can also enable delete mode to remove rarity.

- `Ctrl + 1` - Level 1
- `Ctrl + 2` - Level 2
- `Ctrl + 3` - Level 3
- `Ctrl + 4` - Level 4
- `Ctrl + 5` - Level 5
- `Ctrl + 6` - Level 6
- `Ctrl + 7` - Level 7
- `Ctrl + 0` - Delete Mode

- Modifications in edit mode will be applied immediately like commands and automatically saved to the `config/raritycore/FinalRarity.json` file;
- Remember to disable edit mode after completing edits~

## Item Data-Based Configuration

If you want to configure rarity based on item NBT data/item components, please refer to [NBT Matching](/raritycore/matching-config/NBTMatching) and [Item Component Matching](/raritycore/matching-config/ItemComponentMatching).