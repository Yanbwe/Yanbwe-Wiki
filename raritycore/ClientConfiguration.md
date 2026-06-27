# 客户端配置说明

客户端配置文件位于:

`config/raritycore/client.json`

## 配置选项说明

### enableItemBorderRendering

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用物品边框功能

### itemBorderStyle

- **类型**: 整数
- **默认值**: 1
- **说明**: 控制物品边框的样式(仅在未启用纹理边框时生效)
  - `0`: 空心边框
  - `1`: 实心填充

### useTextureBorder

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否使用纹理边框,启用后将使用自定义纹理渲染边框

### enableItemNameColor

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用物品名称变色功能,根据物品稀有度改变物品名称颜色

### enableTooltipInsert

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用工具提示插入功能,在物品提示中显示稀有度信息
- **注意**: 如果检测到 ColorTooltips 模组已加载,此功能将被强制禁用

### enableTooltipColor

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用工具提示稀有度文本变色功能

### skipUnconfiguredItems

- **类型**: 布尔值
- **默认值**: false
- **说明**: 是否跳过未配置稀有度的物品渲染,启用后只会显示已配置稀有度的物品

### enableCacheSystem

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用缓存系统,如果与其他优化模组发生冲突,请禁用此选项

### enableSophisticatedCoreAdapter

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用精妙核心(Sophisticated Core)适配器,用于与精妙核心模组兼容
- **注意**: 该配置项仅1.21.11之后的版本拥有.

### starDisplay

- **类型**: 对象
- **说明**: 控制稀有度星星的显示方式

**starDisplay 子配置项:**

| 配置项 | 类型 | 默认值 | 说明 |
|-------|------|-------|------|
| `enabled` | 布尔值 | true | 是否启用星星显示 |
| `mode` | 字符串 | "repeat" | 显示模式:"repeat"(重复)或"custom"(自定义) |
| `repeat.character` | 字符串 | "⭐" | repeat模式下使用的字符 |
| `custom.strings` | 对象 | - | custom模式下1-7级稀有度字符串映射 |
| `custom.specialRarityTexts` | 对象 | - | 大于7级的特殊稀有度文本映射。值以 `$` 开头视为翻译键（需在资源包 lang 文件中定义），否则为纯文本 |

#### starDisplay 配置格式示例

```json
{
  "starDisplay": {
    "enabled": true,
    "mode": "repeat",
    "repeat": {
      "character": "⭐"
    },
    "custom": {
      "strings": {
        "1": "★",
        "2": "★★",
        "3": "★★★",
        "4": "★★★★",
        "5": "★★★★★",
        "6": "★★★★★★",
        "7": "★★★★★★★",
        "8": "XXXXXXXXXX"
      },
      "specialRarityTexts": {
        "8": "神话",
        "9": "$rarity.core.special.9",
        "10": "无尽"
      }
    }
  }
}
```

## 如何应用配置

```
/raritycore-client reload
```

## 纹理边框配置

如果启用纹理边框(`useTextureBorder=true`),需要准备对应的纹理文件:

- 纹理文件路径:`assets/raritycore/textures/border/`
- 纹理文件命名:`rarity_1.png` 至 `rarity_7.png`,对应 7 个稀有度等级
- 纹理尺寸:16x16 像素

## 缓存系统相关命令

```
/raritycore-client cache stats   # 显示缓存统计信息
/raritycore-client cache clear   # 清空本地缓存
```

## 注意事项

1. 如果配置文件损坏或陈旧,可以删除配置文件,然后使用 `/raritycore-client reload` 命令重新生成默认配置