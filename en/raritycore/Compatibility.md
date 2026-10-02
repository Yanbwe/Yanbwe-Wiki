# Compatibility Issues

## ImmediatelyFast

When this mod is installed alongside ImmediatelyFast, it causes the high-transparency parts of the item background textures rendered in the hotbar to disappear. This makes the item background textures on the hotbar appear only three-quarters of their original size when using default textures. However, the rendering of item backgrounds within the GUI remains unaffected.

Disabling the ImmediatelyFast HUD batching feature will restore normal functionality.

## EMI

When this mod is installed alongside EMI, the "Batch Processing" feature of EMI causes a large number of items in the EMI tab to not render their item backgrounds.

Disabling the "Batch Processing" feature of EMI will restore normal functionality.

## zeta (fixed after 1201.9.2-fix)

When this mod is installed alongside zeta, it causes the game to crash during the loading phase due to a null pointer exception.

This issue has been fixed in version 1201.9.2-fix. Upgrading RarityCore to version 1201.9.2-fix or later will resolve the issue.

## Sinytra Connector and certain Fabric mods (attempted fix after 1201.9.2-fix2)

It is currently known that when certain mods are installed alongside Sinytra Connector, they modify the API for obtaining vanilla item rarity, indirectly causing RarityCore to crash;

This mod has added a more comprehensive detection mechanism in version 1201.9.2-fix2. If the API is unavailable, the vanilla rarity conversion feature will be forcibly disabled to prevent crashes;

Currently, the author is unable to reproduce the issue. If you can identify which mods are causing the problem, please promptly provide feedback to the author.

## FTB Quests / FTB Library (Item Border Rendering Compatibility)

RarityCore provides rendering compatibility for the FTB mod family (FTB Quests and its dependency FTB Library). Supported in 1.20.1; in 1.21.1 since 1211.14.6:

- Item icons in the quest interface — task icons, reward icons, quest map, emergency items, reward notifications, and completion toasts — will now display rarity borders correctly
- Item name colors and rarity info (level, stars) in item tooltips also work in FTB interfaces
- Border display follows the global "Item Border Rendering" toggle and per-level style configuration, consistent with other interfaces
- 1.20.1 has no dedicated switch for this integration; border rendering simply follows the global "Item Border Rendering" toggle (`defaults.border` in `RarityStyle.json`)
- When FTB Library is not installed, this compatibility is automatically disabled with no impact on the game

## ColorTooltips

When ColorTooltips is installed alongside this mod, item tooltips and item names are handed over to ColorTooltips entirely, and RarityCore steps back:

- The rarity tooltip line (level name + stars) is no longer inserted by RarityCore; ColorTooltips displays it instead, so the same line is not rendered twice by two pipelines
- **Item names are no longer recolored by rarity either** (1.21.1 since 1211.14.9), so that ColorTooltips' own name coloring, the formatting codes the name itself carries (such as `§5…§r`), and any custom colors are not overridden

With this combination, an item name that does not follow the rarity color is therefore expected behavior, not a broken toggle:

- To have item names colored by rarity, simply remove ColorTooltips (RarityCore then handles name coloring), or adjust `itemNameColor` in `RarityStyle.json` (per level or under `defaults`, default `true`) to control RarityCore's own name coloring
- Rarity borders, edit mode, `/raritycore` commands, KubeJS and the API are unaffected

> 1.20.1 has behaved this way since 1201.14.1; before 1211.14.9, 1.21.1 only skipped tooltip line insertion and still rewrote the item name color, which showed up as an item name losing its own formatting codes/colors to the rarity color whenever ColorTooltips was installed.

## Multiplayer Version Requirement (1.20.1)

**Since 1201.14.2, the 1.20.1 build uses network protocol version `1.2.0`.**

Earlier builds stringified numeric and boolean values in `equals` conditions when syncing NBT matching rules to the client, which made scalar conditions fail silently on the client. The symptom was: **rules work right after entering a world, then stop working after leaving and re-entering or restarting the client**, and start working again after entering edit mode (which re-reads the rules from disk). Since 1201.14.2 the sync packet preserves the original value types (and still tolerates the old stringified format), so this is fixed.

Because the packet semantics changed, **both the server and the client need RarityCore 1201.14.2 or later**:

- Older client: the connection is rejected (protocol version mismatch)
- Older server: even an updated client receives rules in the old text form

> 1.21.1 and 26.x are unaffected: their protocol version did not change, so both sides do not have to be updated together.