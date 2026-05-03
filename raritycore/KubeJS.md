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

## 常量

```js
RarityCore.COMMON()    // 1
RarityCore.UNCOMMON()  // 2
RarityCore.RARE()      // 3
RarityCore.EPIC()      // 4
RarityCore.LEGENDARY() // 5
RarityCore.MYTHICAL()  // 6
RarityCore.UNIQUE()    // 7
```

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
