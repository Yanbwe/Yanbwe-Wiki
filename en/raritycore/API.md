# RarityCore API Documentation

**Written for RarityCore 1201.9.2**

## Main API Classes

### 1. RarityRegistry (Core Registration Class)

Package path: `org.yanbwe.raritycore.registry.RarityRegistry`

#### Rarity Registration and Management

```java
// Register item rarity (sync to clients by default)
public static void register(@Nullable Item item, int rarity)

// Register item rarity (can specify whether to sync to clients)
public static void register(@Nullable Item item, int rarity, boolean syncToClients)

// Unregister item rarity registration
public static void unregister(@Nullable Item item, boolean syncToClients)

// Get item stack rarity level (pass NBT data, match based on ID and then NBT)
public static @NotNull Integer getRarity(@Nullable ItemStack itemStack)

// Get item rarity level (without NBT data, only ID matching)
public static @NotNull Integer getRarity(@Nullable Item item)

// Get standardized item rarity (without NBT data, only ID matching)
// Standardization means: null is treated as 1, less than 1 is treated as 1, greater than 7 is treated as 7
public static @NotNull Integer getNormalizedRarity(@Nullable Item item)

// Get standardized item rarity (pass NBT data, match based on ID and then NBT)
public static @NotNull Integer getNormalizedRarity(@Nullable ItemStack itemStack)

// Get complete localized rarity tooltip string for items (supports localization)
public static @NotNull String getLocalizedRarityTooltip(@Nullable Item item)
```

#### Network Synchronization

```java
// Synchronize all rarity data to clients (full synchronization)
public static void syncRarityToClients()

// Synchronize all rarity data to clients with retry mechanism (full synchronization)
public static void syncRarityToClientsWithRetry()

// Synchronize incremental changes to clients
public static void syncIncrementalChangesToClients()

// Synchronize incremental changes to clients with retry mechanism
public static void syncIncrementalChangesToClientsWithRetry()

// Get the number of operations in current change buffer
public static int getPendingChangeCount()

// Clear change buffer
public static void clearChangeBuffer()
```

### 2. RarityColorUtil (Color Utility Class)

**Package path**: `org.yanbwe.raritycore.util.RarityColorUtil`

```java
// Get chat format color based on rarity
public static ChatFormatting getRarityChatColor(int rarity)

// Get ARGB color value based on rarity
public static int getRarityArgbColor(int rarity)
```

**Rarity Color Mapping**:
- 1 (Common): White (WHITE) - 0xFFA0A0A0
- 2 (Rare): Green (GREEN) - 0xFF00AA00
- 3 (Uncommon): Dark Aqua (DARK_AQUA) - 0xFF00AAAA
- 4 (Epic): Light Purple (LIGHT_PURPLE) - 0xFFC870FF
- 5 (Legendary): Gold (GOLD) - 0xFFFFAA00
- 6 (Mythic): Red (RED) - 0xFFFF5555
- 7 (Unique): Dark Red (DARK_RED) - 0xFFAA0000

### 3. RarityValidator (Validation Utility Class)

**Package path**: `org.yanbwe.raritycore.util.RarityValidator`

```java
// Validate if rarity value is valid (1-7)
public static boolean isValidRarity(int rarity)

// Normalize rarity value (less than 1 becomes 1, greater than 7 becomes 7)
public static int normalizeRarity(int rarity)

// Validate if item is valid
public static boolean isValidItem(Item item)

// Get resource location identifier for item
public static ResourceLocation getItemId(Item item)

// Validate if border style is valid (0 or 1)
public static boolean isValidBorderStyle(int borderStyle)

// Validate and return valid border style
public static int validateBorderStyle(int borderStyle)
```

### 4. ClientConfigManager (Client Configuration Management Class)

**Package path**: `org.yanbwe.raritycore.config.ClientConfigManager`

```java
// Item border rendering
public static boolean isEnableItemBorderRendering()
public static void setEnableItemBorderRendering(boolean enable)

// Item border style (0: hollow, 1: solid)
public static int getItemBorderStyle()
public static void setItemBorderStyle(int style)

// Texture border
public static boolean isUseTextureBorder()
public static void setUseTextureBorder(boolean useTexture)

// Item name coloring
public static boolean isEnableItemNameColor()
public static void setEnableItemNameColor(boolean enable)

// Tooltip insertion
public static boolean isEnableTooltipInsert()
public static void setEnableTooltipInsert(boolean enable)

// Skip unconfigured items
public static boolean isSkipUnconfiguredItems()
public static void setSkipUnconfiguredItems(boolean skip)

// Cache system
public static boolean isEnableCacheSystem()
public static void setEnableCacheSystem(boolean enable)
```

### 5. ServerConfigManager (Server Configuration Management Class)

**Package path**: `org.yanbwe.raritycore.config.ServerConfigManager`

```java
// Check vanilla rarity
public static boolean isCheckVanillaRarity()
public static void setCheckVanillaRarity(boolean check)

// Check Apotheosis mod rarity
public static boolean isCheckApotheosisRarity()
public static void setCheckApotheosisRarity(boolean check)

// Enable getRarity() warning
public static boolean isEnableGetRarityWarning()
public static void setEnableGetRarityWarning(boolean enable)
```

### 6. StarDisplayConfigManager (Star Display Configuration Management Class)

**Package path**: `org.yanbwe.raritycore.config.StarDisplayConfigManager`

```java
// Star display master switch
public static boolean isEnableStarDisplay()
public static void setEnableStarDisplay(boolean enable)

// Star display mode
public static String getStarMode()
public static void setStarMode(String mode)

// Repeat mode character
public static String getRepeatCharacter()
public static void setRepeatCharacter(String character)

// Custom mode string mapping
public static Map<Integer, String> getCustomStarStrings()
public static void setCustomStarStrings(Map<Integer, String> strings)

// Get custom string for specified rarity
public static String getCustomStarString(int rarity)
public static void setCustomStarString(int rarity, String string)

// Get special rarity text mapping (greater than 7)
public static Map<Integer, String> getCustomSpecialRarityTexts()

// Get custom special text for specified rarity
public static String getCustomSpecialRarityText(int rarity)
```

## Usage Examples

### 1. Basic Rarity Query

```java
import org.yanbwe.raritycore.registry.RarityRegistry;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;

// Get item rarity (supports NBT matching)
ItemStack diamondStack = new ItemStack(Items.DIAMOND);

Integer rarity = RarityRegistry.getRarity(diamondStack);
// Rarity follows priority: NBT matching > Apotheosis mod > This mod's config > Vanilla mapping
System.out.println("Diamond rarity: " + rarity);

// Get standardized rarity (recommended)
Integer normalizedRarity = RarityRegistry.getNormalizedRarity(diamondStack);
// Standardized rarity is always in range 1-7, no additional handling needed
System.out.println("Normalized rarity: " + normalizedRarity);
```

### 2. Rarity Registration and Management

```java
import org.yanbwe.raritycore.registry.RarityRegistry;
import net.minecraft.world.item.Items;

// Register item rarity
RarityRegistry.register(Items.DIAMOND, 4); // Set diamond to Epic level

// Remove item rarity
RarityRegistry.unregister(Items.DIAMOND, true); // Remove and sync to clients

// Get localized tooltip
String tooltip = RarityRegistry.getLocalizedRarityTooltip(Items.DIAMOND);
System.out.println(tooltip); // Output similar to: "Epic ⭐⭐⭐⭐"
```

### 3. Color Utility Usage

```java
import org.yanbwe.raritycore.util.RarityColorUtil;
import net.minecraft.ChatFormatting;

// Get color based on rarity
ChatFormatting color = RarityColorUtil.getRarityChatColor(5); // Get Legendary color
int argb = RarityColorUtil.getRarityArgbColor(5); // Get ARGB color value
```