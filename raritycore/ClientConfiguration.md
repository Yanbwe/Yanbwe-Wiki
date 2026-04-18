# 客户端配置说明

客户端配置文件位于:

`config/raritycore/client.json`

## 配置选项说明

### 1. enableItemBorderRendering

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用物品边框功能

### 2. itemBorderStyle

- **类型**: 整数
- **默认值**: 0
- **说明**: 控制物品边框的样式(仅在未启用纹理边框时生效)
  - `0`: 空心边框
  - `1`: 实心填充

### 3. useTextureBorder

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否使用纹理边框,启用后将使用自定义纹理渲染边框

### 4. enableItemNameColor

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用物品名称变色功能,根据物品稀有度改变物品名称颜色

### 5. enableTooltipInsert

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用工具提示插入功能,在物品提示中显示稀有度信息

### 6. skipUnconfiguredItems

- **类型**: 布尔值
- **默认值**: false
- **说明**: 是否跳过未配置稀有度的物品渲染,启用后只会显示已配置稀有度的物品

### 7. enableCacheSystem

- **类型**: 布尔值
- **默认值**: true
- **说明**: 是否启用缓存系统.如果与其他优化模组发生冲突,请禁用此选项

### 8. starDisplay(星星显示配置)

- **类型**: 对象
- **说明**: 控制稀有度星星的显示方式

  子配置项:
  - `enabled`: 是否启用星星显示(布尔值,默认 true)
  - `mode`: 显示模式,可选 "repeat"(重复)或 "custom"(自定义)
  - `repeat.character`: repeat模式下使用的字符(默认 "★")
  - `custom.strings`: custom模式下的稀有度字符串映射(1-7 级)
  - `custom.specialRarityTexts`: 特殊稀有度文本映射(大于 7 级,用户自定义)

#### starDisplay 配置格式示例

```json
{
  "starDisplay": {
    "enabled": true,
    "mode": "repeat",
    "repeat": {
      "character": "★"
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
        "9": "创世",
        "10": "无尽"
      }
    }
  }
}
```

## 如何应用配置

### 方法 1:重启游戏

修改配置文件后重启游戏.

### 方法 2:使用命令

```
/raritycore-client reload
```

## 纹理边框配置

如果启用纹理边框(useTextureBorder=true),需要准备对应的纹理文件:

- 纹理文件路径:`assets/raritycore/textures/border/`
- 纹理文件命名:`rarity_1.png` 至 `rarity_7.png`,对应 7 个稀有度等级
- 纹理尺寸:16x16 像素

## 缓存系统相关信息命令

可以通过以下命令查看缓存系统状态:

```
/raritycore-client cache stats     # 显示缓存统计信息
/raritycore-client cache clear     # 清空缓存
/raritycore-client cache health    # 显示缓存健康状态
/raritycore-client cache smart-optimize  # 触发智能缓存优化
```

## 注意事项

如果配置文件损坏或陈旧,可以把配置文件删了,然后重载配置就可以重新生成一份默认配置