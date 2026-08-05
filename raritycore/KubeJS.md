# KubeJS 接口说明

**Ver.14.1 更新**：全局绑定直接暴露 Java 类 `RarityCoreAPI` 的静态方法与常量（无 JS 包装层），方法名与 Java API 完全一致。公共 API 已统一为 1.20.1 命名（`getRarityColor` / `getRarityTexture` / `isLevelTooltipEnabled` 等），旧名（`getColor` / `getTexture` 等）仍可用但已标记废弃。

RarityCore 提供了 KubeJS 集成,允许你通过 JavaScript 脚本控制稀有度。

## 前置条件

- 安装 KubeJS 模组
- KubeJS 为可选依赖,不影响模组正常运行

## 全局绑定

在 KubeJS 脚本中,`raritycore`（推荐）与 `RarityCore` 两个全局变量均可直接使用,它们暴露的是 Java 类 `org.yanbwe.raritycore.api.RarityCoreAPI` 的全部静态方法和常量。

**参数说明**：
- 方法参数为 `ItemStack` 时,用 `Item.of("minecraft:diamond")` 获取
- 方法参数为 `Item` 时,用 `Item.of("minecraft:diamond").item` 获取

```js
// 注册稀有度 (参数为 Item)
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5)

// 注册稀有度 (可选是否同步)
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5, true)

// 删除稀有度注册
RarityCore.unregisterRarity(Item.of("minecraft:stick").item)

// 查询稀有度 (参数为 ItemStack)
let rarity = RarityCore.getRarity(Item.of("minecraft:diamond"))

// 获取标准化稀有度
let r = RarityCore.getNormalizedRarity(Item.of("minecraft:netherite_ingot"))

// 检查是否有配置 (参数为 Item)
let has = RarityCore.hasConfiguredRarity(Item.of("minecraft:stone").item)

// 获取本地化工具提示
let tip = RarityCore.getLocalizedTooltip(Item.of("minecraft:diamond"))
```

## 颜色与纹理

```js
// 获取某等级的 RGB 颜色 (0xRRGGBB, 含继承解析)
let color = RarityCore.getRarityColor(5)  // 返回 0xFFCC00

// 获取内置色表的 RGB 颜色
let builtin = RarityCore.getRarityRgbColor(3)

// 获取某等级的纹理路径
let tex = RarityCore.getRarityTexture(5)
// 返回 "raritycore:textures/border/rarity_5.png"

// 解析 #RRGGBB 字符串
let rgb = RarityCore.parseColor("#FFAA00")

// RGB int 格式化为 #RRGGBB
let hex = RarityCore.formatColor(0xFFAA00)
```

## 验证

```js
RarityCore.isValidRarity(5)   // true
RarityCore.normalizeRarity(10) // 7
RarityCore.validateRarity(5)   // 同 normalizeRarity
```

## 配置开关

```js
// 全局主开关
RarityCore.isBorderEnabled()         // 是否渲染物品边框
RarityCore.isTooltipEnabled()        // 是否插入工具提示
RarityCore.isTooltipColorEnabled()   // 工具提示是否染色
RarityCore.isNameColorEnabled()      // 物品名称是否变色 (查询 1 级)

// 逐级表现开关
RarityCore.isLevelRendererEnabled(5)  // 该等级是否渲染边框
RarityCore.isLevelTooltipEnabled(5)   // 该等级是否显示工具提示
RarityCore.isLevelNameColorEnabled(5) // 该等级名称是否变色
```

## V14 视觉表现接口

### 查询

```js
// 无稀有度回退
RarityCore.isNoRaritySkip()          // 无稀有度物品是否跳过渲染
RarityCore.getNoRarityDefaultRarity() // 无稀有度物品兜底等级

// 逐级查询
RarityCore.getTooltipContent(5)       // 该等级工具提示内容
RarityCore.getLevelTranslationKey(5) // 该等级 level 段翻译键
RarityCore.getLevelFallbackKey(5)    // 该等级 level 段回退键
RarityCore.isBorderUseTexture(5)      // 该等级边框是否使用纹理
RarityCore.getBorderStyle(5)          // 该等级边框样式 (1=实心, 0=空心)
RarityCore.getBorderFallback()        // 边框回退纹理
```

### 写入 (即时保存至 RarityStyle.json)

```js
// 主开关
RarityCore.setBorderEnabled(true)
RarityCore.setTooltipEnabled(true)
RarityCore.setTooltipColorEnabled(true)

// 无稀有度回退
RarityCore.setNoRaritySkip(false)
RarityCore.setNoRarityDefaultRarity(1)

// 逐级边框 / 工具提示 / 星星
RarityCore.setBorderUseTexture(5, true)
RarityCore.setBorderStyle(5, 1)
RarityCore.setTooltipContent(5, "[@{level}] @{star}")
RarityCore.setStarMode(5, "repeat")
RarityCore.setStarRepeatChar(5, "★")

// 批量写入 (期间不逐条写盘, endStyleBatch 统一保存)
RarityCore.beginStyleBatch()
RarityCore.setStarMode(5, "custom")
RarityCore.setStarRepeatChar(5, "♥")
RarityCore.endStyleBatch()
```

## 配置与查询

```js
// 触发完整配置重载
RarityCore.reloadConfigs()

// 返回该稀有度等级的全部物品 (遍历全注册表)
let items = RarityCore.getItemsByRarity(5)

// 返回该稀有度等级的全部物品 ID
let ids = RarityCore.getItemIdsByRarity(5)

// 返回当前出现过的稀有度等级集合
let rarities = RarityCore.getConfiguredRarities()

// 返回该等级的物品数量
let count = RarityCore.getRarityCount(5)

// 返回全部已解析稀有度等级快照
let all = RarityCore.getAllRarityEntries()

// 版本与可用性
RarityCore.API_VERSION        // API 版本号常量 (1400)
let ver = RarityCore.getModVersion()     // 模组版本号
let cfgVer = RarityCore.getConfigVersion() // 配置版本号 (每次重载 +1)
let ok = RarityCore.isAvailable()        // 模组是否可用
```

> `registerRarities` / `getItemsByRarities` 需要 `java.util.Map` / `java.util.Set` 参数,JS 中构造不便,建议分别改用逐条 `registerRarity` 与 `getItemsByRarity`。

## 常量

可直接访问以下常量：

```js
RarityCore.MIN_RARITY  // 1
RarityCore.MAX_RARITY  // 7 (内置预置档位数,非稀有度上限)
RarityCore.API_VERSION // 1400 (特性探测用)
```

稀有度等级为普通整数;最低档位为 `1`,内置预置档位数为 `7`(非稀有度上限)。

## 事件

RarityCore 暴露以下 KubeJS 事件:

### RarityCoreEvents.rarityChanged

物品稀有度被注册/更新/删除时触发。

```js
RarityCoreEvents.rarityChanged(event => {
    console.log(`稀有度变更: ${event.itemId}`)
    console.log(`旧稀有度: ${event.oldRarity}, 新稀有度: ${event.newRarity}`)
    console.log(`变更类型: ${event.changeType}`) // "register"/"update"/"remove"
})
```

### RarityCoreEvents.rarityQuery

查询物品稀有度时触发,**可修改返回值**。

```js
RarityCoreEvents.rarityQuery(event => {
    let source = event.source  // "component"/"itemdata"/"apotheosis"/"ironspells"/"itemmap"/"tag"/"autorarity"/"vanilla"/"default"
    if (event.itemId === "minecraft:diamond") {
        event.rarity = 6  // 强制设为神话 (桥接层自动回写)
    }
})
```

### RarityCoreEvents.rarityTooltip

工具提示构建时触发,可追加自定义文本。**仅客户端**。

```js
RarityCoreEvents.rarityTooltip(event => {
    event.addText("§6自定义工具提示文本")
    event.addText(`当前稀有度: ${event.rarity}`)
})
```

## 完整示例

```js
// startup_scripts/rarity_setup.js

// 注册稀有度
RarityCore.registerRarity(Item.of("minecraft:diamond_sword").item, 5)
RarityCore.registerRarity(Item.of("minecraft:netherite_ingot").item, 5)
RarityCore.registerRarity(Item.of("minecraft:elytra").item, 6)
RarityCore.registerRarity(Item.of("minecraft:nether_star").item, 7)

// 监听稀有度查询
RarityCoreEvents.rarityQuery(event => {
    // 给所有附魔金苹果额外提升一级
    if (event.itemId === "minecraft:enchanted_golden_apple") {
        event.rarity = Math.min(event.rarity + 1, 7)
    }
})
```
