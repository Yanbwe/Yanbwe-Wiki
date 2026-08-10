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

RarityCore provides rendering compatibility for the FTB mod family (FTB Quests and its dependency FTB Library):

- Item icons in the quest interface — task icons, reward icons, quest map, emergency items, reward notifications, and completion toasts — will now display rarity borders correctly
- Item name colors and rarity info (level, stars) in item tooltips also work in FTB interfaces
- Border display follows the global "Item Border Rendering" toggle and per-level style configuration, consistent with other interfaces
- When FTB Library is not installed, this compatibility is automatically disabled with no impact on the game