# KubeJS 接口说明

**Ver.13 新增功能**

RarityCore 提供了 KubeJS 集成,允许你通过 JavaScript 脚本控制稀有度。

## 前置条件

- 安装 KubeJS 模组
- KubeJS 为可选依赖,不影响模组正常运行

## 全局绑定

在 KubeJS 脚本中,全局变量 `RarityCore` 可直接使用:

```js
// 注册稀有度
RarityCore.register("minecraft:diamond_sword", 5)

// 查询稀有度
let rarity = RarityCore.getRarity("minecraft:diamond")

// 获取标准化稀有度
let r = RarityCore.getNormalizedRarity("minecraft:netherite_ingot")

// 检查是否有配置
let has = RarityCore.hasRarity("minecraft:stone")

// 删除配置
RarityCore.unregister("minecraft:stick")
```

## 颜色

```js
// 获取某等级的 RGB 颜色 (0xRRGGBB)
let color = RarityCore.getColor(5)  // 返回 0xFFCC00

// 获取默认 RGB 颜色
let defColor = RarityCore.getDefaultColor(3)

// 解析 #RRGGBB 字符串
let rgb = RarityCore.parseColor("#FFAA00")
```

## 纹理

```js
// 获取某等级的纹理路径
let tex = RarityCore.getTexture(5)
// 返回 "raritycore:textures/border/rarity_5.png"
```

## 验证

```js
RarityCore.isValidRarity(5)   // true
RarityCore.normalizeRarity(10) // 7
```

## 配置开关

```js
// 逐级表现开关
RarityCore.isRendererEnabled(5)  // 该等级是否渲染边框
RarityCore.isTooltipEnabled(5)   // 该等级是否显示工具提示
```

## V14 视觉表现接口

### 查询

```js
// 主开关
RarityCore.isTooltipColorEnabled()  // 工具提示是否染色
RarityCore.isBorderEnabled()        // 是否渲染物品边框
RarityCore.isTooltipInsertEnabled() // 是否插入工具提示

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
```

## 配置与查询

```js
// 触发完整配置重载
RarityCore.reloadConfigs()

// 返回该稀有度等级的全部物品 ID
let ids = RarityCore.getItemsByRarity(5)
// 返回当前出现过的稀有度等级集合
let rarities = RarityCore.getConfiguredRarities()
// 返回匹配任一指定等级的全部物品 ID
let ids2 = RarityCore.getItemsByRarities([5, 6])
// 返回该等级的物品数量
let count = RarityCore.getRarityCount(5)
// 返回全部已解析稀有度等级快照
let all = RarityCore.getAllRarityEntries()
// 版本与可用性
let apiVer = RarityCore.getApiVersion()
let ver = RarityCore.getModVersion()
let cfgVer = RarityCore.getConfigVersion()
let ok = RarityCore.isAvailable()
```

## 常量

等级为普通整数，无命名常量方法；最低档位为 `1`，内置预置档位数为 `7`（非稀有度上限）。

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
    let source = event.source  // "registry"/"nbt"/"tag" 等
    if (event.itemId === "minecraft:diamond") {
        event.rarity = 6  // 强制设为神话
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

// 批量注册
const items = [
    ["minecraft:diamond_sword", 5],
    ["minecraft:netherite_ingot", 5],
    ["minecraft:elytra", 6],
    ["minecraft:nether_star", 7]
]
items.forEach(([id, r]) => RarityCore.register(id, r))

// 监听稀有度查询
RarityCoreEvents.rarityQuery(event => {
    // 给所有附魔金苹果额外提升一级
    if (event.itemId === "minecraft:enchanted_golden_apple") {
        event.rarity = Math.min(event.rarity + 1, 7)
    }
})
```
