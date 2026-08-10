# RarityStyle 配置指南（V14）

V14 起，原有的 `client.json` 与 `RarityClientConfig.json` 已整合为单一配置文件：

```
config/raritycore/RarityStyle.json
```

该文件统一管理所有稀有度视觉表现——颜色、边框、工具提示、星星、物品名称颜色，以及无稀有度物品的回退行为。

## 文件结构概览

```json
{
  "enableBorder": true,
  "enableTooltip": true,
  "tooltipColorEnabled": true,

  "defaults": {
    "color": "inherit",
    "border": {
      "useTexture": true,
      "defaultTexture": "raritycore:textures/border/rarity_{level}.png",
      "style": 1,
      "show": true,
      "fallback": "inherit"
    },
    "tooltip": {
      "show": true,
      "content": "[@{level}]-@{star}]",
      "colored": true,
      "level": {
        "colored": true,
        "translationKey": "$(rarity.core.{level})",
        "fallback": "{level}$(rarity.core.special.rarity.prefix)"
      },
      "star": {
        "colored": true,
        "mode": "repeat",
        "repeatChar": "★",
        "custom": ""
      }
    },
    "itemNameColor": true,
    "noRarity": {
      "skip": false,
      "defaultRarity": 1
    }
  },

  "rarities": {
    "1": { "color": "#CCCCCC" },
    "2": { "color": "#55FF55" },
    "3": { "color": "#55FFFF" },
    "4": { "color": "#FF55FF" },
    "5": { "color": "#FFCC00" },
    "6": { "color": "#FF6666" },
    "7": { "color": "#FF3333" }
  }
}
```

## 全局主开关

| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `enableBorder` | 布尔 | `true` | 是否启用物品边框渲染（旧 `enableItemBorderRendering`） |
| `enableTooltip` | 布尔 | `true` | 是否在工具提示中插入稀有度信息（旧 `enableTooltipInsert`） |
| `tooltipColorEnabled` | 布尔 | `true` | 工具提示颜色总开关（旧 `enableTooltipColor`），与字段的 `colored` 取与生效 |

> 其余旧 `client.json` 的开关（`itemBorderStyle`、`useTextureBorder`、`enableItemNameColor`、`skipUnconfiguredItems`、`starDisplay` 等）已移入 `defaults` 下，启动时 `client.json` 仅保留 `enableCacheSystem` 与 `enableIronSpellsAdapter`（1.21.1 另保留 `enableSophisticatedCoreAdapter`）。
>
> `enableIronSpellsAdapter`（布尔，默认 `true`）：铁魔法（Iron's Spells 'n Spellbooks）稀有度联动开关。开启时，法术卷轴/法书会按 `irons_spellbooks:spell_container` 中的法术等级动态映射稀有度；关闭后该适配器整体停用，法术卷轴不再按法术等级映射稀有度，但铁魔法物品的静态映射（数据包中的固定配置）不受影响，仍正常生效。此开关仅 1.20.1 / 1.21.1 提供。

## defaults：默认值与继承根

### color
- 类型：字符串，默认 `"inherit"`
- `"inherit"`：从该稀有度向更低等级逐级查找首个显式指定的 `#RRGGBB`；若到底仍无，回退内置每级默认色。
- `#RRGGBB`：直接指定该级颜色。

### border：边框
| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `useTexture` | 布尔 | `true` | 是否使用纹理边框（旧 `useTextureBorder`） |
| `defaultTexture` | 字符串 | `raritycore:textures/border/rarity_{level}.png` | 纹理路径，`{level}` 替换为等级数字（旧 `rarity_1.png` 等约定） |
| `style` | 整数 | `1` | `1`=实心填充，`0`=空心（旧 `itemBorderStyle`） |
| `show` | 布尔 | `true` | 是否显示边框（旧 `renderer` 总开关） |
| `fallback` | 字符串 | `"inherit"` | 未显式配置边框纹理的等级（通常为 8 级及以上）的边框纹理回退策略 |

`border.fallback` 取值：
- `"inherit"`：未显式配置边框纹理的等级沿用最高已配置档位（默认 7 级）纹理。
- 其它路径字符串：作为未显式配置边框纹理等级的统一纹理，支持 `{level}` 占位符，例如 `"raritycore:textures/border/rarity_special.png"`。

### tooltip：工具提示
| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `show` | 布尔 | `true` | 是否显示工具提示（旧 `tooltips` 总开关） |
| `content` | 字符串 | `[@{level}]-@{star}]` | 模板，占位符见下 |
| `colored` | 布尔 | `true` | 是否对整个工具提示行统一染色（含 `[`、`]`、`-` 等静态分隔符） |

`colored` 行为：
- 开启时：整行套用稀有度颜色，`level`/`star` 段不再单独上色。
- 关闭时：回退到 `level.colored` 与 `star.colored` 的分段独立染色。

### tooltip.level：等级名段
| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `colored` | 布尔 | `true` | 等级名是否单独随稀有度变色（仅在 `tooltip.colored` 关闭时生效） |
| `translationKey` | 字符串 | `$(rarity.core.{level})` | 等级名来源；`$(...)` 为翻译键，`{level}` 替换为数字；非 `$(...)` 开头则整体作为字面量显示 |
| `fallback` | 字符串 | `{level}$(rarity.core.special.rarity.prefix)` | 翻译键缺失时回退；`{level}` 替换为数字 |

### tooltip.star：星星段
| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `colored` | 布尔 | `true` | 星星是否单独随稀有度变色（仅在 `tooltip.colored` 关闭时生效） |
| `mode` | 字符串 | `repeat` | `repeat`=重复字符；`custom`=使用自定义字符串 |
| `repeatChar` | 字符串 | `★` | repeat 模式重复字符，重复次数 = 稀有度等级 |
| `custom` | 字符串 | `""` | custom 模式字符串（不支持按等级动态） |

### itemNameColor
- 类型：布尔，默认 `true`
- 是否按稀有度修改物品名称颜色（旧 `enableItemNameColor` / `nameColor`）。

### noRarity：无稀有度物品
| 字段 | 类型 | 默认 | 说明 |
|------|------|------|------|
| `skip` | 布尔 | `false` | 是否跳过未配置稀有度的物品（旧 `skipUnconfiguredItems`） |
| `defaultRarity` | 整数 | `1` | 不跳过时使用的默认稀有度等级，随后走正常继承流程 |

## rarities：各稀有度覆盖

`rarities` 下以 `"1"`~`"7"`（及更高数字键）为键，可覆盖任意 `defaults` 字段，缺失项继承 `defaults`。

```json
"rarities": {
  "1": { "color": "#CCCCCC" },
  "8": {
    "color": "#FF00FF",
    "border": { "defaultTexture": "raritycore:textures/border/rarity_8.png" }
  }
}
```

## 占位符与字符串解析

- `@{level}`：解析为该稀有度等级名（由 `tooltip.level.translationKey` + `fallback` 得到，非数字）。
- `@{star}`：解析为该稀有度星星串（由 `tooltip.star` 得到）。
- `$(key)`：嵌入翻译键，解析为语言文件中的文本。
- `$(key)` 作为整串（`translationKey`/`fallback` 等）：直接视为翻译键；缺失时走 `fallback`。

## 继承规则

任一字段在某等级缺失（或 color 为 `"inherit"`）时，向更低等级逐级查找首个显式值；均无则用 `defaults` 对应默认。`color` 继承到底仍无指定值时，回退内置每级默认色。适用字段：`color`、`border.*`、`tooltip.show`、`tooltip.content`、`tooltip.colored`、`tooltip.level.*`、`tooltip.star.*`、`itemNameColor`。

## 翻译键与语言文件

新增数字键（en_us / zh_cn 均需）：

```
rarity.core.1 = Common   / 普通
rarity.core.2 = Uncommon / 稀有
rarity.core.3 = Rare     / 罕见
rarity.core.4 = Epic     / 史诗
rarity.core.5 = Legendary/ 传说
rarity.core.6 = Mythical / 神话
rarity.core.7 = Unique   / 唯一
```

保留 `rarity.core.special.rarity.prefix`。旧命名键（`rarity.core.common` 等）已移除。

## 如何应用配置

```
/raritycore-client reload
```

此命令会重新加载 `RarityStyle.json` 并刷新缓存。若文件缺失，启动时自动生成默认配置；若文件损坏，可删除后重载重新生成。

## 纹理边框

若使用纹理边框（`border.useTexture=true`），需在资源包准备 16x16 的 PNG：

- 路径：`assets/raritycore/textures/border/`
- 命名：默认 `rarity_1.png` ~ `rarity_7.png`（由 `defaultTexture` 的 `{level}` 决定）；未显式配置边框纹理的等级（8 级及以上）按 `border.fallback` 指定的路径（或沿用 7 级）。
