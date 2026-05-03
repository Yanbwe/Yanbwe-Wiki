# In-Game NBT Tag Rarity Control

**New in Ver.13**

Items with a `raritycore:data` NBT tag can directly control their rarity display. Controlled by `server.json` → `enableNbtRarityControl` (**off by default**).

## Enabling

In `config/raritycore/server.json`:

```json
{
  "enableNbtRarityControl": true
}
```

Then `/raritycore reload`.

## NBT Structure

```
raritycore:data
├── Level (int)           # Rarity level
├── Color (string)        # RGB color, e.g. "#FFAA00"
├── Tooltips (bool)       # Show tooltip
├── Renderer (bool)       # Render border
├── NameColor (bool)      # Recolor name
└── TextureBorder (string) # Texture path
```

**All fields are optional** — missing fields fall back to regular config.

## Example

```
/give @p minecraft:diamond_sword{raritycore:data:{Level:6,Color:"#FF6666"}}
```

## Rules

| Condition | Behavior |
|-----------|----------|
| `Level` not set | No effect, falls back to regular query |
| `Level` = 0 | No rarity, falls back |
| `Level` > 0 | **Highest priority** (overrides everything) |
| `Color` not set | Uses regular config |

## Priority

When `raritycore:data.Level` > 0, it has the **highest priority**, overriding:

- NBT match rules
- FinalRarity.json
- TagRarity
- Auto rarity calculation
- Vanilla rarity
- Apotheosis / Iron's Spellbooks adapters

## Notes

- Off by default for performance
- NBT-controlled rarity is not synced — each client checks independently
- Cache does not pollute original item ID rarity
