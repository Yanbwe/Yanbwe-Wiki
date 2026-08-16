# 稀有度核心 API 文档（26.X）

**适用于 26.1 / 26.2 版本（V14）**

> 26.X 的 API 表面已与 1.21.1 对齐。由于 MC 版本差异，资源位置类型使用 `Identifier` 而非 1.21.1 的 `ResourceLocation`。
> 26.X 没有 KubeJS 绑定，KubeJS 相关文档仅适用于 1.21.1。

**Maven 依赖**

**推荐：Modrinth Maven（无需身份验证）**

```gradle
repositories {
    mavenCentral()
    maven {
        name = "Modrinth"
        url = "https://api.modrinth.com/maven"
        content {
            includeGroup "maven.modrinth"
        }
    }
}

dependencies {
    // 26.1 版本
    implementation "maven.modrinth:raritycore:2601.<version>"
    // 26.2 版本
    // implementation "maven.modrinth:raritycore:2602.<version>"
}
```

<details>
<summary>备选：GitHub Packages（需要 Token）</summary>

```gradle
repositories {
    mavenCentral()
    maven {
        url = "https://maven.pkg.github.com/Yanbwe/RarityCore"
        credentials {
            username = "你的GitHub用户名"
            password = "你的GitHub Personal Access Token"
        }
    }
}

dependencies {
    implementation "org.yanbwe:raritycore:2601.<version>"
    // 26.2 版本
    // implementation "org.yanbwe:raritycore:2602.<version>"
}
```

Token 需要 `read:packages` 权限，可在 `~/.gradle/gradle.properties` 中配置：

```properties
gpr.user=你的GitHub用户名
gpr.key=你的Personal Access Token
```

</details>

RarityCore 提供统一的正式 API 入口 `RarityCoreAPI`，供其他模组直接调用。视觉表现配置由 `RarityStyle.json` 统一管理。[配置详情 →](/raritycore/RarityStyleConfiguration)

## 正式 API: RarityCoreAPI

**包路径**: `org.yanbwe.raritycore.api.RarityCoreAPI`

### 核心 API

以下接口覆盖稀有度的注册、查询、验证与颜色纹理获取，满足大部分日常调用需求。

#### 稀有度注册与查询

```java
// 注册物品稀有度 (1+，同步到客户端)
RarityCoreAPI.registerRarity(item, 5);

// 注册物品稀有度 (可选是否同步)
RarityCoreAPI.registerRarity(item, 5, true);

// 删除物品稀有度
RarityCoreAPI.unregisterRarity(item);

// 获取 ItemStack 的稀有度 (按完整优先级链解析)
int rarity = RarityCoreAPI.getRarity(itemStack);

// 获取 Item 的稀有度
int rarity = RarityCoreAPI.getRarity(item);

// 获取标准化稀有度 (仅钳制 <1)
int r = RarityCoreAPI.getNormalizedRarity(itemStack);
int r2 = RarityCoreAPI.getNormalizedRarity(item);

// 获取本地化工具提示
String tip = RarityCoreAPI.getLocalizedTooltip(itemStack);
String tip2 = RarityCoreAPI.getLocalizedTooltip(item);

// 获取所有已注册的稀有度映射 (只读)
Map<Identifier, Integer> map = RarityCoreAPI.getRegistryMap();

// 检查物品是否有已配置的稀有度
boolean has1 = RarityCoreAPI.hasConfiguredRarity(item);
boolean has2 = RarityCoreAPI.hasConfiguredRarity(item, itemStack);  // 含组件检查

// 清理无效条目
int removed = RarityCoreAPI.pruneInvalidEntries();
```

#### 批量注册

```java
// 批量注册 (不逐条同步，注册结束后统一同步一次，并发布 RarityRegistryChangedEvent)
Map<Item, Integer> entries = new HashMap<>();
entries.put(Items.DIAMOND_SWORD, 5);
entries.put(Items.NETHERITE_INGOT, 5);
RarityCoreAPI.registerRarities(entries);
```

#### 验证

```java
RarityCoreAPI.isValidRarity(5);   // true (仅检查 ≥1)
RarityCoreAPI.isValidRarity(9);   // true (无上限限制)
RarityCoreAPI.normalizeRarity(10); // 10 (不钳制)
RarityCoreAPI.normalizeRarity(0);  // 1
RarityCoreAPI.validateRarity(5);   // 校验并标准化稀有度 (同 normalizeRarity)
```

#### 颜色与纹理

```java
// 获取 RarityStyle.json 中定义的逐级 RGB 颜色（含继承解析）
int rgb = RarityCoreAPI.getRarityColor(5);

// 获取逐级纹理路径
String tex = RarityCoreAPI.getRarityTexture(5);

// 获取内置色表的 RGB 颜色（不含 RarityStyle 继承解析）
int builtin = RarityCoreAPI.getRarityRgbColor(5);

// 解析 "#RRGGBB" 字符串为 RGB int
int rgb = RarityCoreAPI.parseColor("#FFAA00");

// RGB int 格式化为 "#RRGGBB"
String hex = RarityCoreAPI.formatColor(0xFFAA00);
```

### 进阶 API

以下接口面向 Tag 规则、遍历查询、开关控制、DataComponent 控制、样式读写与网络同步等特定场景。

#### Tag 稀有度

```java
// 获取物品匹配的 Tag 规则最高稀有度 (0=无匹配)
int r = RarityCoreAPI.getTagRarity(item);

// 已加载的 Tag 规则数量
int count = RarityCoreAPI.getTagRuleCount();
```

#### 遍历查询

```java
// 所有被解析为指定稀有度等级的物品 / 物品 ID
List<Item> items = RarityCoreAPI.getItemsByRarity(5);
List<Identifier> ids = RarityCoreAPI.getItemIdsByRarity(5);

// 当前出现过的稀有度等级集合 (手动 ∪ 自动 ∪ 无稀有度兜底等级)
Set<Integer> rarities = RarityCoreAPI.getConfiguredRarities();

// 匹配任一指定等级的物品 / 物品 ID
List<Item> items2 = RarityCoreAPI.getItemsByRarities(Set.of(5, 6));
List<Identifier> ids2 = RarityCoreAPI.getItemIdsByRarities(Set.of(5, 6));

// 指定等级的物品数量
int count = RarityCoreAPI.getRarityCount(5);

// 全部已解析稀有度快照 (自动 ∪ 手动，手动覆盖自动)
Map<Identifier, Integer> all = RarityCoreAPI.getAllRarityEntries();
```

#### 全局开关

```java
// 全局边框渲染总开关
RarityCoreAPI.isBorderEnabled();

// 全局工具提示总开关
RarityCoreAPI.isTooltipEnabled();

// 全局工具提示染色开关
RarityCoreAPI.isTooltipColorEnabled();
```

#### 逐级开关

```java
// 逐级边框开关
RarityCoreAPI.isLevelRendererEnabled(5);

// 逐级工具提示开关
RarityCoreAPI.isLevelTooltipEnabled(5);

// 逐级名称颜色开关
RarityCoreAPI.isLevelNameColorEnabled(5);

// 名称颜色主开关 (查询 1 级)
RarityCoreAPI.isNameColorEnabled();
```

#### 无稀有度回退

```java
// 无稀有度物品是否跳过渲染
RarityCoreAPI.isNoRaritySkip();

// 无稀有度物品兜底等级 (默认 1)
RarityCoreAPI.getNoRarityDefaultRarity();
```

#### 组件稀有度控制 (DataComponent)

```java
// 检查是否开启了 DataComponent (CUSTOM_DATA) 稀有度控制
RarityCoreAPI.isNbtRarityControlEnabled();

// 从物品的 CUSTOM_DATA 中读取 raritycore 稀有度 (Level=0 时返回0)
int level = RarityCoreAPI.getComponentRarity(itemStack);

// 写入/移除组件稀有度后调用，立即失效该物品的缓存（ID 缓存 + 组件缓存），
// 避免类型级 ID 缓存快速路径返回旧值导致视觉延迟（最长约 30-60 分钟）
RarityCoreAPI.invalidateItem(itemStack);
```

#### 样式查询

```java
RarityCoreAPI.getTooltipContent(5);        // 该等级工具提示内容
RarityCoreAPI.getLevelTranslationKey(5);   // 该等级 level 段翻译键
RarityCoreAPI.getLevelFallbackKey(5);      // 该等级 level 段回退键
RarityCoreAPI.getStarConfig(5);            // 该等级星星配置 (StarSegmentConfig)
RarityCoreAPI.isBorderUseTexture(5);       // 该等级边框是否使用纹理
RarityCoreAPI.getBorderStyle(5);           // 该等级边框样式 (1=实心, 0=空心)
RarityCoreAPI.getBorderFallback();         // 边框回退纹理
```

#### 样式写入

所有写入方法会即时保存至 `RarityStyle.json`。

```java
// 主开关
RarityCoreAPI.setBorderEnabled(true);
RarityCoreAPI.setTooltipEnabled(true);
RarityCoreAPI.setTooltipColorEnabled(true);

// 无稀有度回退
RarityCoreAPI.setNoRaritySkip(false);
RarityCoreAPI.setNoRarityDefaultRarity(1);

// 逐级边框 / 工具提示 / 星星
RarityCoreAPI.setBorderUseTexture(5, true);
RarityCoreAPI.setBorderStyle(5, 1);
RarityCoreAPI.setTooltipContent(5, "[@{level}] @{star}");
RarityCoreAPI.setStarMode(5, "repeat");
RarityCoreAPI.setStarRepeatChar(5, "★");
```

#### 样式批量写入

```java
// 批量写入期间 setter 不逐条写盘，endStyleBatch 归零时统一保存
RarityCoreAPI.beginStyleBatch();
RarityCoreAPI.setStarMode(5, "custom");
RarityCoreAPI.setStarRepeatChar(5, "♥");
RarityCoreAPI.endStyleBatch();

// 以补丁方式整体写入 (null 字段保留现有值)
RarityStyleConfigManager.StylePatch patch = new RarityStyleConfigManager.StylePatch(5);
patch.starMode = "custom";
RarityCoreAPI.setStyle(patch);

// 获取某等级生效视觉表现的不可变快照 (border/tooltip/star 合并结果)
RarityStyleConfigManager.StyleSnapshot snap = RarityCoreAPI.getStyleSnapshot(5);
```

#### 网络同步

```java
// 全量同步
RarityCoreAPI.syncToClients();

// 带重试的全量同步
RarityCoreAPI.syncToClientsWithRetry();

// 增量同步
RarityCoreAPI.syncIncrementalChangesToClients();

// 待同步变更数
int pending = RarityCoreAPI.getPendingChangeCount();
```

#### 常量与版本探测

```java
RarityCoreAPI.MIN_RARITY;          // 1
RarityCoreAPI.MAX_RARITY;          // 7 (内置预置档位数，非稀有度上限)
RarityCoreAPI.DEFAULT_RGB_COLOR;   // 默认 RGB 颜色
RarityCoreAPI.API_VERSION;         // 1400 (特性探测用，与模组版本解耦)

RarityCoreAPI.isAvailable();       // 模组是否可用
String ver = RarityCoreAPI.getModVersion();     // 模组版本号
int cfgVer = RarityCoreAPI.getConfigVersion();  // 配置版本号 (每次配置重载 +1)
```

#### 配置重载

```java
// 触发完整配置重载 (程序化触发)
RarityCoreAPI.reloadConfigs();
```

### 已废弃别名

以下旧名已标记 `@Deprecated`，仍可调用（内部转发到正式方法）：

| 旧名 | 正式名 |
|------|--------|
| `getColor(int)` | `getRarityColor(int)` |
| `getTexture(int)` | `getRarityTexture(int)` |
| `isBorderEnabled(int)` | `isLevelRendererEnabled(int)` |
| `isTooltipEnabled(int)` | `isLevelTooltipEnabled(int)` |
| `isNameColorEnabled(int)` | `isLevelNameColorEnabled(int)` |
| `isComponentRarityControlEnabled()` | `isNbtRarityControlEnabled()` |
| `isBorderRenderingEnabled()` | `isBorderEnabled()` |
| `isTooltipInsertEnabled()` | `isTooltipEnabled()` |

### 26.X 保留兼容别名

以下方法在 1.21.1 没有，属于 26.X 早期 API，已标记 `@Deprecated`，仅用于兼容：

| 旧方法 | 建议替代 |
|--------|----------|
| `getItemRarityMap()` | `getRegistryMap()` |
| `getAutoRarityMap()` | `getAllRarityEntries()` |
| `register(item, rarity)` | `registerRarity(item, rarity)` |
| `unregister(item)` | `unregisterRarity(item)` |
| `setAllBorderUseTexture(boolean)` | `setBorderUseTexture(level, boolean)` |

### 稀有度解析优先级（26.X）

```
组件控制 (CUSTOM_DATA.raritycore.Level>0)  ← 最高
  ↓
RarityQueryEvent 覆盖
  ↓
Item Data 匹配规则
  ↓
ITEM_RARITY_MAP (FinalRarity.json + 数据包)
  ↓
TagRarity (TagRarity.json)
  ↓
AUTO_RARITY_MAP (自动计算)
  ↓
原版 getRarity()
  ↓
无稀有度兜底等级 (默认 1)
```

> 26.X 没有 1.21.1 的 Apotheosis / Iron's Spells 适配器，因此优先级链中不包含这两项。

## 旧版 API 类 (仍可用)

以下类仍可使用，但推荐迁移到 `RarityCoreAPI`：

| 旧类 | 新替代 |
|------|--------|
| `RarityRegistry.register()` | `RarityCoreAPI.registerRarity()` |
| `RarityRegistry.getRarity()` | `RarityCoreAPI.getRarity()` |
| `RarityColorUtil.getRarityChatColor()` | `RarityCoreAPI.getRarityColor()` |
| `RarityValidator.normalizeRarity()` | `RarityCoreAPI.normalizeRarity()` |
| `ClientConfigManager.isEnable*()` | `RarityCoreAPI.is*()` |

`ClientConfigManager` 的旧委托方法仍作为内部桥接保留，公共调用请使用 `RarityCoreAPI`。

## 事件

RarityCore 提供以下 NeoForge 事件，其他模组可通过 `NeoForge.EVENT_BUS` 监听：

### RarityChangeEvent

物品稀有度被注册/更新/删除时触发。

```java
@SubscribeEvent
public void onRarityChange(RarityChangeEvent event) {
    Item item = event.getItem();
    Integer oldRarity = event.getOldRarity();
    Integer newRarity = event.getNewRarity();
    RarityChangeEvent.ChangeType type = event.getChangeType(); // REGISTER / UPDATE / REMOVE
}
```

### RarityQueryEvent

查询物品稀有度时触发，可修改返回值。实现 `ICancellableEvent`。

```java
@SubscribeEvent
public void onRarityQuery(RarityQueryEvent event) {
    ItemStack stack = event.getItemStack();
    int rarity = event.getOriginalRarity(); // 当前结果
    event.setOverriddenRarity(5);            // 覆盖为 5
    event.setCanceled(true);                 // 必须取消事件才生效
    String source = event.getSource();        // component/itemdata/itemmap/tag/autorarity/vanilla/default
}
```

### RarityTooltipEvent

工具提示构建时触发，可追加自定义文本。

```java
@SubscribeEvent
public void onRarityTooltip(RarityTooltipEvent event) {
    event.getTooltipComponents().add(Component.literal("自定义信息"));
    int rarity = event.getRarity();
}
```

### RarityConfigReloadEvent

配置整体重载完成后触发，分为客户端侧重载与服务端重载。

```java
@SubscribeEvent
public void onClientReload(RarityConfigReloadEvent.Client event) {
    // 客户端侧配置重载完成
}

@SubscribeEvent
public void onServerReload(RarityConfigReloadEvent.Server event) {
    // 全部配置重载完成
}
```

### RarityStyleChangedEvent

通过 API 写入并持久化某项视觉表现配置后触发，便于监听方刷新缓存与渲染。

```java
@SubscribeEvent
public void onStyleChanged(RarityStyleChangedEvent event) {
    int rarity = event.getRarity();                              // 受影响等级（0=全局/无稀有度回退）
    RarityStyleChangedEvent.ChangeTarget t = event.getTarget();  // BORDER_ENABLED / BORDER_STYLE 等
}
```

### RarityStyleReloadEvent

RarityStyle 配置被文件改动并重新加载后触发（区别于 API 写入触发的 RarityStyleChangedEvent）。

```java
@SubscribeEvent
public void onStyleReload(RarityStyleReloadEvent event) {
    int rarity = event.getRarity();   // 受影响等级（负数=全等级）
    boolean ext = event.isExternal(); // 是否由文件外部改动触发
}
```

### RarityRegistryChangedEvent

调用 `RarityCoreAPI.registerRarities()` 批量注册后一次性发布本次全部变更。

```java
@SubscribeEvent
public void onRegistryChanged(RarityRegistryChangedEvent event) {
    Map<Identifier, Integer> changed = event.getChangedEntries(); // 新增或修改的条目
    Set<Identifier> removed = event.getRemovedEntries();           // 被移除的条目
}
```

## 使用示例

```java
import org.yanbwe.raritycore.api.RarityCoreAPI;
import net.minecraft.world.item.Items;
import net.minecraft.world.item.ItemStack;

// 注册
RarityCoreAPI.registerRarity(Items.DIAMOND_SWORD, 5);

// 查询
int r = RarityCoreAPI.getNormalizedRarity(new ItemStack(Items.DIAMOND_SWORD));
// r = 5

// 颜色
int rgb = RarityCoreAPI.getRarityColor(5); // 0xFFCC00 (亮金色)

// 注册 8 级以上稀有度
RarityCoreAPI.registerRarity(Items.NETHER_STAR, 8);
RarityCoreAPI.isValidRarity(8); // true
```