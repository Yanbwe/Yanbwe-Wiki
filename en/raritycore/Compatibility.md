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