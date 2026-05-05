# Component Rarity Control (1.21.1)

**New in Ver.13 — 1.21.1+ exclusive**

> **Difference from 1.20.1**: In Minecraft 1.21.1 NeoForge, custom data is no longer stored directly on the item's top-level NBT tag. Instead, it is wrapped in the `DataComponents.CUSTOM_DATA` component. Therefore, 1.21.1 uses **DataComponent Control** instead of the old NBT tag control.

Items with `raritycore` data stored in `DataComponents.CUSTOM_DATA` can directly control their rarity display. Controlled by `server.json` → `enableComponentRarityControl` (**off by default**).

## Enabling

In `config/raritycore/server.json`:

```json
{
  "enableComponentRarityControl": true
}
```

Then `/raritycore reload`.

## Data Storage (1.21.1)

```
ItemStack
└── DataComponents.CUSTOM_DATA (CompoundTag)
    └── "raritycore" (CompoundTag)
        ├── Level (int)          — Rarity level
        ├── Color (string)       — RGB color, e.g. "#FFAA00"
        ├── Tooltips (bool)      — Show tooltip
        ├── Renderer (bool)      — Render border
        ├── NameColor (bool)     — Recolor name
        └── TextureBorder (string) — Texture path
```

**All fields are optional** — missing fields fall back to regular config.

## Examples

### /give command (1.21.1 component syntax)

```
/give @p minecraft:diamond_sword[minecraft:custom_data={raritycore:{Level:6,Color:"#FF6666"}}]
```

### Java code

```java
import net.minecraft.core.component.DataComponents;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.world.item.ItemStack;

CompoundTag customData = itemStack.getOrDefault(DataComponents.CUSTOM_DATA, CompoundTag.EMPTY).copy();
CompoundTag rarityCoreTag = new CompoundTag();
rarityCoreTag.putInt("Level", 6);
rarityCoreTag.putString("Color", "#FF6666");
rarityCoreTag.putBoolean("Tooltips", true);
rarityCoreTag.putBoolean("Renderer", true);
rarityCoreTag.putBoolean("NameColor", true);
customData.put("raritycore", rarityCoreTag);
itemStack.set(DataComponents.CUSTOM_DATA, customData);
```

### KubeJS

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

## Rules

| Condition | Behavior |
|-----------|----------|
| `Level` not set | No effect, falls back to regular query |
| `Level` = 0 | No rarity (treated as default 1) |
| `Level` > 0 | **Highest priority** (overrides everything) |
| `Color` not set | Uses RarityClientConfig or default color |
| `Tooltips` etc. not set | Default enabled |

## Priority

Component control has the **highest priority**:

```
Component Control (this feature)     ← Highest
  ↓
Item Data Matching
  ↓
Apotheosis Adapter
  ↓
Iron's Spells Adapter
  ↓
ITEM_RARITY_MAP (FinalRarity.json)
  ↓
TagRarity (TagRarity.json)
  ↓
AUTO_RARITY_MAP (auto-calculated)
  ↓
Vanilla Rarity
```

## Performance Notes

- Off by default for performance — each item stack requires `CUSTOM_DATA` inspection
- Uses a dedicated **component cache** (`ComponentCacheManager`) based on DataComponent hashes, preventing pollution of same-item-ID caches
- Only enable when dynamic rarity control is actually needed

## Version Migration (1.20.1 → 1.21.1)

| 1.20.1 | 1.21.1 |
|--------|--------|
| `enableNbtRarityControl` | `enableComponentRarityControl` |
| `{raritycore:{Level:6}}` | `[minecraft:custom_data={raritycore:{Level:6}}]` |
| `tag.getCompound("raritycore:data")` | `stack.get(DataComponents.CUSTOM_DATA).copyTag().getCompound("raritycore")` |
