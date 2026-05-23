# 配置指南

ColorTooltips 使用 JSON 配置文件，所有配置文件位于：

```
config/colortooltips/
├── common.json          ← 全局设置 + 样式选择器
└── styles/
    ├── Vanilla.json      ← 默认样式
    ├── RarityCoreStyles.json
    ├── RGB.json
    └── VanillaRarity.json
```

**热重载**：修改配置文件后，在游戏内使用聊天命令 `/colortooltips reload` 即可立即生效，无需重启。

## common.json — 全局配置

### smoothColor

- **类型**: 布尔值
- **默认**: `true`
- **说明**: 物品切换时颜色是否平滑过渡（渐变而非跳变）。

### tooltipLock

提示框锁定功能，按住 `Shift + 鼠标滚轮` 可上下移动提示框。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 是否启用 Shift+滚轮 移动提示框 |
| `sensitivity` | 浮点数 | `10.0` | 滚轮灵敏度，范围 1.0~20.0 |

### onlyTextTooltips

纯文本提示框（如聊天物品链接悬停、成就提示等）是否也使用 ColorTooltips 样式。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 关闭后纯文本提示框使用原版样式 |

### styleSelector — 样式选择器

决定不同物品使用哪个样式文件。分为两个选择器块：

- **`common`**：未安装 RarityCore 时使用
- **`rarityCore`**：安装了 RarityCore 时使用

#### 匹配规则

样式按以下优先级依次匹配（命中即返回）：

1. **`onlyText`** — 纯文本提示框使用的样式名
2. **`items`** — 物品注册名精确匹配（如 `"minecraft:diamond_sword": "RGB"`）
3. **稀有度编号** — RarityCore 稀有度数字匹配（如 `"3": "VanillaRarity"`，仅 rarityCore 块有效）
4. **原版稀有度名** — `"Common"`、`"Uncommon"`、`"Rare"`、`"Epic"`
5. **`"*"` 通配符** — 上述全部未命中时的默认样式
6. **最终降级** — 固定使用 `"Vanilla"`

#### 示例

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {
        "minecraft:diamond_sword": "RGB"
      }
    }
  }
}
```

这个配置的含义：
- 纯文本提示框 → 使用 `Vanilla` 样式
- Common(白色)物品 → 使用 `Vanilla`
- Uncommon/Rare/Epic 物品 → 使用 `VanillaRarity`
- 如果有 RarityCore → 全部使用 `RarityCoreStyles`，但钻石剑例外使用 `RGB` 彩虹样式

## styles/*.json — 样式文件

每个样式文件控制提示框的所有视觉效果。详见 [样式编写指南](/colorTooltips/StyleGuide)。

## 默认配置文件内容

```json
{
  "styleSelector": {
    "common": {
      "onlyText": "Vanilla",
      "Common": "Vanilla",
      "Uncommon": "VanillaRarity",
      "Rare": "VanillaRarity",
      "Epic": "VanillaRarity",
      "items": {}
    },
    "rarityCore": {
      "onlyText": "Vanilla",
      "*": "RarityCoreStyles",
      "items": {}
    }
  },
  "tooltipLock": {
    "enabled": true,
    "sensitivity": 10.0
  },
  "onlyTextTooltips": {
    "enabled": true
  },
  "smoothColor": true
}
```

## 注意事项

1. 修改任何 JSON 文件后，在游戏内执行 `/colortooltips reload` 即可热重载，无需重启。
2. 样式选择器的 `items` 字段中，物品注册名格式为 `"命名空间:物品id"`（例如 `"minecraft:diamond"`）。
3. 可以在 `styles/` 目录下添加自己的 `.json` 文件，文件名即为样式名（不含 `.json` 后缀），然后在 `styleSelector` 中引用。
4. JSON 文件损坏时，模组会自动使用默认值降级，不会导致游戏崩溃。日志中会记录加载警告。
