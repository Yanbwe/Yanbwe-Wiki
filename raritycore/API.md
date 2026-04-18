# RarityCore API 文档

**为 RarityCore 1201.9.2 编写**

## 主要API类

### 1. RarityRegistry (核心注册类)

包路径: `org.yanbwe.raritycore.registry.RarityRegistry`

#### 稀有度注册与管理

```java
// 注册物品稀有度(默认同步到客户端)
public static void register(@Nullable Item item, int rarity)

// 注册物品稀有度(可指定是否同步到客户端)
public static void register(@Nullable Item item, int rarity, boolean syncToClients)

// 删除物品稀有度注册
public static void unregister(@Nullable Item item, boolean syncToClients)

// 获取物品堆的稀有度等级(传入NBT数据,在id匹配的基础上进行nbt匹配)
public static @NotNull Integer getRarity(@Nullable ItemStack itemStack)

// 获取物品的稀有度等级(不传入NBT数据,只获取id匹配)
public static @NotNull Integer getRarity(@Nullable Item item)

// 获取标准化的物品稀有度(不传入NBT数据,只获取id匹配)
// 标准化是指:null的视为1,小于1的视为1,大于7的视为7.推荐使用这个方法来获取稀有度,以便简化代码.
public static @NotNull Integer getNormalizedRarity(@Nullable Item item)

// 获取标准化的物品稀有度(传入NBT数据,在id匹配的基础上进行nbt匹配)
public static @NotNull Integer getNormalizedRarity(@Nullable ItemStack itemStack)

// 获取物品的完整稀有度工具提示字符串(支持本地化)
public static @NotNull String getLocalizedRarityTooltip(@Nullable Item item)
```

#### 网络同步

```java
// 将所有稀有度数据同步到客户端(全量同步)
public static void syncRarityToClients()

// 使用重试机制将所有稀有度数据同步到客户端(全量同步)
public static void syncRarityToClientsWithRetry()

// 将增量变更同步到客户端
public static void syncIncrementalChangesToClients()

// 使用重试机制将增量变更同步到客户端
public static void syncIncrementalChangesToClientsWithRetry()

// 获取当前变更缓冲区中的操作数量
public static int getPendingChangeCount()

// 清空变更缓冲区
public static void clearChangeBuffer()
```

### 2. RarityColorUtil (颜色工具类)

**包路径**: `org.yanbwe.raritycore.util.RarityColorUtil`

```java
// 根据稀有度获取聊天格式颜色
public static ChatFormatting getRarityChatColor(int rarity)

// 根据稀有度获取ARGB颜色值
public static int getRarityArgbColor(int rarity)
```

**稀有度对应颜色表**:
- 1 (普通): 白色 (WHITE) - 0xFFA0A0A0
- 2 (稀有): 绿色 (GREEN) - 0xFF00AA00
- 3 (罕见): 深青色 (DARK_AQUA) - 0xFF00AAAA
- 4 (史诗): 浅紫色 (LIGHT_PURPLE) - 0xFFC870FF
- 5 (传说): 金色 (GOLD) - 0xFFFFAA00
- 6 (神话): 红色 (RED) - 0xFFFF5555
- 7 (唯一): 深红色 (DARK_RED) - 0xFFAA0000

### 3. RarityValidator (验证工具类)

**包路径**: `org.yanbwe.raritycore.util.RarityValidator`

```java
// 验证稀有度值是否有效 (1-7)
public static boolean isValidRarity(int rarity)

// 标准化稀有度值 (小于1视为1,大于7视为7)
public static int normalizeRarity(int rarity)

// 验证物品是否有效
public static boolean isValidItem(Item item)

// 获取物品的资源位置标识符
public static ResourceLocation getItemId(Item item)

// 验证边框样式是否有效 (0或1)
public static boolean isValidBorderStyle(int borderStyle)

// 验证并返回有效的边框样式
public static int validateBorderStyle(int borderStyle)
```

### 4. ClientConfigManager (客户端配置管理类)

**包路径**: `org.yanbwe.raritycore.config.ClientConfigManager`

```java
// 物品边框渲染
public static boolean isEnableItemBorderRendering()
public static void setEnableItemBorderRendering(boolean enable)

// 物品边框样式 (0:空心, 1:实心)
public static int getItemBorderStyle()
public static void setItemBorderStyle(int style)

// 纹理边框
public static boolean isUseTextureBorder()
public static void setUseTextureBorder(boolean useTexture)

// 物品名称变色
public static boolean isEnableItemNameColor()
public static void setEnableItemNameColor(boolean enable)

// 工具提示插入
public static boolean isEnableTooltipInsert()
public static void setEnableTooltipInsert(boolean enable)

// 跳过未配置物品
public static boolean isSkipUnconfiguredItems()
public static void setSkipUnconfiguredItems(boolean skip)

// 缓存系统
public static boolean isEnableCacheSystem()
public static void setEnableCacheSystem(boolean enable)
```

### 5. ServerConfigManager (服务端配置管理类)

**包路径**: `org.yanbwe.raritycore.config.ServerConfigManager`

```java
// 检查原版稀有度
public static boolean isCheckVanillaRarity()
public static void setCheckVanillaRarity(boolean check)

// 检查神化模组稀有度
public static boolean isCheckApotheosisRarity()
public static void setCheckApotheosisRarity(boolean check)

// 启用getRarity()警告
public static boolean isEnableGetRarityWarning()
public static void setEnableGetRarityWarning(boolean enable)
```

### 6. StarDisplayConfigManager (星星显示配置管理类)

**包路径**: `org.yanbwe.raritycore.config.StarDisplayConfigManager`

```java
// 星星显示总开关
public static boolean isEnableStarDisplay()
public static void setEnableStarDisplay(boolean enable)

// 星星显示模式
public static String getStarMode()
public static void setStarMode(String mode)

// 重复模式字符
public static String getRepeatCharacter()
public static void setRepeatCharacter(String character)

// 自定义模式字符串映射
public static Map<Integer, String> getCustomStarStrings()
public static void setCustomStarStrings(Map<Integer, String> strings)

// 获取指定稀有度的自定义字符串
public static String getCustomStarString(int rarity)
public static void setCustomStarString(int rarity, String string)

// 获取特殊稀有度文本映射(大于 7 级)
public static Map<Integer, String> getCustomSpecialRarityTexts()

// 获取指定稀有度的自定义特殊文本
public static String getCustomSpecialRarityText(int rarity)
```

## 使用示例

### 1. 基本稀有度查询

```java
import org.yanbwe.raritycore.registry.RarityRegistry;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;

// 获取物品稀有度(支持NBT匹配)
ItemStack diamondStack = new ItemStack(Items.DIAMOND);

Integer rarity = RarityRegistry.getRarity(diamondStack);
// 稀有度获取遵循优先级:NBT匹配 > 神化模组 > 本模组配置 > 原版映射
System.out.println("Diamond rarity: " + rarity);

// 获取标准化稀有度(推荐使用)
Integer normalizedRarity = RarityRegistry.getNormalizedRarity(diamondStack);
// 标准化稀有度始终在1-7范围内,无需额外处理
System.out.println("Normalized rarity: " + normalizedRarity);
```

### 2. 稀有度注册与管理

```java
import org.yanbwe.raritycore.registry.RarityRegistry;
import net.minecraft.world.item.Items;

// 注册物品稀有度
RarityRegistry.register(Items.DIAMOND, 4); // 钻石设为史诗级别

// 删除物品稀有度
RarityRegistry.unregister(Items.DIAMOND, true); // 删除并同步到客户端

// 获取本地化工具提示
String tooltip = RarityRegistry.getLocalizedRarityTooltip(Items.DIAMOND);
System.out.println(tooltip); // 输出类似:"史诗 ⭐⭐⭐⭐"
```

### 3. 颜色工具使用

```java
import org.yanbwe.raritycore.util.RarityColorUtil;
import net.minecraft.ChatFormatting;

// 根据稀有度获取颜色
ChatFormatting color = RarityColorUtil.getRarityChatColor(5); // 获取传说级颜色
int argb = RarityColorUtil.getRarityArgbColor(5); // 获取ARGB颜色值
```