# Config Guide

ColorTooltips uses JSON configuration files located at:

```
config/colortooltips/
├── common.json          ← Global settings + style selector
└── styles/
    ├── Vanilla.json      ← Default style
    ├── RarityCoreStyles.json
    ├── RGB.json
    └── VanillaRarity.json
```

**Hot reload**: After modifying configuration files, use the in-game chat command `/colortooltips reload` to apply changes instantly without restarting.

## common.json — Global Config

### smoothColor

- **Type**: Boolean
- **Default**: `true`
- **Description**: Whether color transitions smoothly (gradient) when switching items.

### tooltipLock

Tooltip locking feature. Hold `Shift + Mouse Scroll` to move the tooltip up/down.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Enable Shift+Scroll tooltip movement |
| `sensitivity` | Float | `10.0` | Scroll sensitivity, range 1.0~20.0 |

### onlyTextTooltips

Whether text-only tooltips (chat item links, achievement tooltips, etc.) also use ColorTooltips styling.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | When disabled, text-only tooltips use vanilla style |

### bypass — Opt-out List

Some mod authors heavily customize the vanilla tooltip (for example SlashBlade: Resharped appends
"Bewitched/Sealed", Proud Soul, kill count, refine count and SA lines in custom colors).
ColorTooltips taking over such tooltips breaks the author's information layout and color scheme.

Listing those items in `bypass` makes ColorTooltips behave **as if the mod were not installed** for them:
no name-line replacement, no extra line, no border/background override, no fade or switch animations.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | Boolean | `true` | Master switch; set to `false` to disable the whole list and take over everything again |
| `mods` | String array | `[]` | Namespace list; **every item** of a matching mod opts out |
| `items` | String array | `[]` | Item registry names (`namespace:path`); matching items opt out |

A hit in either `mods` or `items` is enough. With both lists empty the behavior is identical to before (full takeover).

```json
{
  "bypass": {
    "enabled": true,
    "mods": ["slashblade"],
    "items": ["minecraft:diamond_sword"]
  }
}
```

The example above makes every SlashBlade item and the vanilla diamond sword keep their original tooltip.

> **Tip**: to merely restyle an item, point `styleSelector.items` at `Vanilla`.
> `bypass` is the stronger "do not touch this tooltip at all" option.

#### Register with a single command

Instead of editing JSON by hand, you can register items in-game with client commands.
The list is written to `common.json` and takes effect **immediately**:

| Command | Effect |
|---------|--------|
| `/colortooltips bypass add hand` | Add the item you are holding |
| `/colortooltips bypass add hover` | Add the item under the mouse cursor |
| `/colortooltips bypass add <item id or mod id>` | Add by id; a bare mod id (e.g. `slashblade`) opts out the whole mod |
| `/colortooltips bypass remove hand` / `hover` / `<id>` | Remove an entry |
| `/colortooltips bypass list` | List every entry |
| `/colortooltips bypass check hand` / `hover` / `<id>` | Check whether an item opts out, and which entry matched |
| `/colortooltips bypass` | Show the master switch and entry counts |

Example: hover a SlashBlade weapon and run `/colortooltips bypass add hover` — that item instantly
returns to its original tooltip, and the entry is persisted for the next launch.

Other notes:

- Entries also accept raw JSON copied from logs (containing an `"id"` field); the registry name is extracted automatically.
- Adding a duplicate is idempotent and reports "already in the list".
- Entries are matched **exactly** against registry names (case-sensitive, lowercase); surrounding whitespace is trimmed.
- A failed write (locked or read-only file) is reported in red and never corrupts the existing file.

### styleSelector — Style Selector

Determines which style file is used for different items. Divided into two selector blocks:

- **`common`**: Used when RarityCore is not installed
- **`rarityCore`**: Used when RarityCore is installed

#### Matching Rules

Styles are matched in the following priority order (first match wins):

1. **`onlyText`** — Style name for text-only tooltips
2. **`items`** — Exact item registry name match (e.g. `"minecraft:diamond_sword": "RGB"`)
3. **Rarity number** — RarityCore rarity number match (e.g. `"3": "VanillaRarity"`, rarityCore block only)
4. **Vanilla rarity name** — `"Common"`, `"Uncommon"`, `"Rare"`, `"Epic"`
5. **`"*"` wildcard** — Default when none of the above match
6. **Final fallback** — Always `"Vanilla"`

#### Example

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {
        "minecraft:diamond_sword": "RGB"
      }
    }
  }
}
```

This config means:
- Text-only tooltips → use `Vanilla` style
- Common (white) items → use `Vanilla`
- Uncommon/Rare/Epic items → use `VanillaRarity`
- With RarityCore → all use `RarityCoreStyles`, except diamond swords use `RGB` rainbow style

## styles/*.json — Style Files

Each style file controls all visual aspects of the tooltip. See the [Style Guide](/en/colorTooltips/StyleGuide) for details.

## Default Config

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {}
    }
  },
  "tooltipLock": {
    "enabled": true,
    "sensitivity": 10.0
  },
  "onlyTextTooltips": {
    "enabled": true
  },
  "bypass": {
    "enabled": true,
    "mods": [],
    "items": []
  },
  "smoothColor": true
}
```

## Notes

1. After modifying any JSON file, run `/colortooltips reload` in-game for hot-reload. No restart needed.
2. In the `items` field of the style selector, the item registry name format is `"namespace:item_id"` (e.g. `"minecraft:diamond"`).
3. You can add your own `.json` files to the `styles/` folder. The filename (without `.json`) becomes the style name, which you can then reference in `styleSelector`.
4. If a JSON file is corrupted, the mod will safely fall back to default values without crashing. Loading warnings are logged.
5. `bypass` entries are matched **exactly** against registry names (case-sensitive; registry names are lowercase). Use namespaces in `mods` (e.g. `slashblade`) and full registry names in `items` (e.g. `slashblade:slashblade`). Surrounding whitespace is trimmed automatically.
