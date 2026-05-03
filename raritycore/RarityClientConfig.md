# 客户端稀有度配置说明

**Ver.13 新增功能**

`RarityClientConfig.json` 允许你按稀有度等级逐级自定义客户端的视觉表现——颜色、纹理、以及各项功能的开关。

## 配置文件位置

```
config/raritycore/RarityClientConfig.json
```

## 配置格式

```json
{
  "rarities": {
    "1": {
      "color": "#CCCCCC",
      "texture": "raritycore:textures/border/rarity_1.png",
      "tooltips": true,
      "renderer": true,
      "nameColor": true
    },
    "2": {
      "color": "#55FF55",
      "texture": "raritycore:textures/border/rarity_2.png",
      "tooltips": true,
      "renderer": true,
      "nameColor": true
    }
  }
}
```

> 3~7 级同理,不赘述。

## 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `color` | string | RGB 颜色,格式 `#RRGGBB` |
| `texture` | string | 纹理边框资源路径 |
| `tooltips` | bool | 该等级是否显示工具提示 |
| `renderer` | bool | 该等级是否渲染物品槽边框 |
| `nameColor` | bool | 该等级是否修改物品名称颜色 |

## 默认颜色

| 等级 | 颜色 | 名称 |
|------|------|------|
| 1 | `#CCCCCC` | 普通 (亮灰) |
| 2 | `#55FF55` | 稀有 (亮绿) |
| 3 | `#55FFFF` | 罕见 (亮青) |
| 4 | `#FF55FF` | 史诗 (亮紫) |
| 5 | `#FFCC00` | 传说 (亮金) |
| 6 | `#FF6666` | 神话 (亮红) |
| 7 | `#FF3333` | 唯一 (亮深红) |

## 规则

- JSON key 即为稀有度等级 ("1"~"7"),无内部 `level` 字段
- 颜色统一为 **RGB** 格式
- 等级 >7 未配置颜色/纹理时,**沿用等级 7 的值**
- **`client.json` 为总闸**: 若 `client.json` 中某项总开关关闭,则本配置中对应等级的开关无效
- 本配置优先级高于 `client.json` 中各表现的总开关——但 `client.json` 的开关必须为开,本配置才生效

## 如何应用配置

```
/raritycore-client reload
```

此命令会重新加载客户端配置,包括 `client.json` 和 `RarityClientConfig.json`。

## 自定义纹理

如果你想使用自定义纹理边框:

1. 在资源包中放置 16x16 的 PNG 纹理文件
2. 在 `texture` 字段中填写资源路径,如 `"mypack:textures/border/epic.png"`
3. 确保 `client.json` 中 `useTextureBorder` 为 `true`

## 注意事项

- 首次启动时自动生成默认配置文件
- 如果配置文件损坏,删除后使用 `/raritycore-client reload` 重新生成
- 颜色格式必须为 6 位十六进制 (`#RRGGBB`),否则回退为默认灰色
