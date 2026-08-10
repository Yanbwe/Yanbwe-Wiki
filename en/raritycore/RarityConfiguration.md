# Rarity Configuration Guide

## **Rarity Explanation**

Before assigning rarities to items, you should understand what rarity means in this mod.

As the name suggests, rarity is a characteristic of an item that represents how rare the item is. The harder an item is to obtain, the higher its rarity should be.

Many people misunderstand rarity as representing item quality, which is wrong! **Rarity ≠ Quality**!

An item deserves a high rarity if it requires great effort or good luck to obtain, even if the item has no practical use.

On the other hand, an item that can be crafted with just dirt but has effects superior to a golden apple does not deserve a high rarity despite its utility.

## **Getting Started!**

After understanding the meaning of rarity, you can officially begin adding or modifying item rarities using the following methods:

### 1. Adding via Datapack

If you are a mod developer, you can add `data/<namespace>/rarity/any_name.json` files in your datapack, with the following format:
```json
{
  "minecraft:item_id": rarity_value,
  "another_mod:item_id": rarity_value,
  ...
}
```

If you want to quickly and intuitively write configuration files, you can use the commands introduced in method 4 below. First use commands to modify item rarities, then export the properly formatted rarity information using the export command.

If you need to override the built-in rarity information of this mod, add a dependency in your mods.toml to ensure it overrides the built-in rarity information:
```toml
[[dependencies.your_mod]]
   modId="raritycore"
   mandatory=false
   versionRange="[1.0,)"
   ordering="AFTER"
   side="BOTH"
```

### 2. Adding via Code

If you are a mod developer, you can directly register items by calling the public method `RarityRegistry.register(Item item, int rarity)`. This method can be used at any time after the raritycore mod is loaded, and is recommended for temporary in-world rarity modifications.

### 3. Adding via Game Config

If you are a regular player or modpack developer, you can register or modify rarities via two methods:

**Method 1: FinalRarityConfig Folder**

Place JSON configuration files in the `config\raritycore\FinalRarityConfig\` folder. File names can be arbitrary, and the format is consistent with datapack files. The mod will load all JSON files in alphabetical order by filename.

**Method 2: FinalRarity.json File**

Register or modify rarities via `config\raritycore\FinalRarity.json`. The format is consistent with datapack files mentioned above.

**Loading Priority:**

The mod loads rarity configurations in the following order, where later-loaded configurations will override earlier-loaded configurations for the same items:

1. Rarity configurations in datapacks
2. JSON files in the FinalRarityConfig folder (in alphabetical order by filename)
3. FinalRarity.json file

### 4. Adding via Game Commands

**OP Commands (`/raritycore`):**

1. `/raritycore sethand <rarity>` Sets the rarity of the currently held item
2. `/raritycore removehand` Removes the rarity configuration of the currently held item
3. `/raritycore setrarity <item> <rarity>` Sets the rarity of a specified item
4. `/raritycore removerarity <item>` Removes the rarity configuration of a specified item
5. `/raritycore reload` Reloads all rarity configurations
6. `/raritycore export all` Exports all rarity data to a single file
7. `/raritycore export mod <modid>` Exports rarity data for a specific mod
8. `/raritycore export all-mod` Exports rarity data for all mods to separate files
9. `/raritycore details` Shows current registered rarity statistics
10. `/raritycore details nbt` Shows NBT matching configuration details
11. `/raritycore perf stats` Shows performance statistics
12. `/raritycore perf optimize` Triggers manual optimization
13. `/raritycore edit enable/disable/toggle/status` Edit mode control
14. `/raritycore server reload` Reloads server configuration
15. `/raritycore server status` Shows server configuration status

**Client Commands (`/raritycore-client`):**

1. `/raritycore-client reload` Reloads client configuration
2. `/raritycore-client cache stats` Shows cache statistics
3. `/raritycore-client cache clear` Clears render cache
4. `/raritycore-client cache health` Shows cache health status
5. `/raritycore-client cache smart-optimize` Triggers smart cache optimization
6. `/raritycore-client texture toggle` Toggles texture border enable status

## **Detailed Edit Mode Usage Instructions**

### Enabling Edit Mode

1. **Enable Edit Mode**
   ```bash
   /raritycore edit enable
   ```

2. **Check Status**
   ```bash
   /raritycore edit status
   ```

### Using Edit Mode

After enabling edit mode, you can modify item rarities as follows:

#### Basic Operation Flow

1. In any game interface (inventory, chest, crafting table, etc.)
2. Click on the item whose rarity you want to modify
3. Hold `Ctrl` key and press the corresponding number key to switch rarity level, or enable delete mode to remove rarity.

#### Rarity Level Mapping

- `Ctrl + 1` - Level 1
- `Ctrl + 2` - Level 2
- `Ctrl + 3` - Level 3
- `Ctrl + 4` - Level 4
- `Ctrl + 5` - Level 5
- `Ctrl + 6` - Level 6
- `Ctrl + 7` - Level 7
- `Ctrl + 0` - Delete Mode

#### Additional Notes

- Modifications in edit mode will be applied immediately like commands and automatically saved to `config/raritycore/FinalRarity.json` file;
- Remember to disable edit mode after completing edits
   ```bash
   /raritycore edit disable
   ```

> **TACZ Integration**: When the TACZ (Timeless and Classics Zero) mod is installed, clicking a TACZ gun/attachment/ammo in Normal mode will **not** write to `FinalRarity.json`. Instead, RarityCore automatically generates a matching rule based on the sub-item ID (GunId/AttachmentId/AmmoId).
>
> This is because TACZ guns, attachments and ammo share the same base item ID (e.g. `tacz:modern_kinetic_gun`) and can only be distinguished by their sub-item ID.
>
> - Generated rules are saved to `config/raritycore/item_data_matches/editTacZ_*.json` and take effect immediately
> - Re-editing the same sub-item **overwrites** the corresponding rule instead of piling up files
> - Deleting rarity (`rarity=0`) is not supported for TACZ sub-items

## **Rarity Priority**

Item rarity retrieval follows this priority order (from highest to lowest):

1. NBT matching configuration
2. Apotheosis mod rarity
3. This mod's configuration (datapack, FinalRarityConfig, FinalRarity.json)
4. Vanilla rarity mapping