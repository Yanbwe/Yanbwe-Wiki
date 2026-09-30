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

### bypass — 让位名单

有些模组作者会在原版提示框上做**较大的内容魔改**（例如拔刀剑重锋给每把刀追加「妖/印」「耀魂数」「杀敌数」「精炼数」「SA」等多行彩色信息）。
这些提示框由作者精心设计，ColorTooltips 接管后会破坏其信息层次与配色。

把这类物品写进 `bypass` 名单后，ColorTooltips 对该物品的行为**等同于没有安装本模组**：
不替换物品名头部、不插入附加行、不覆盖边框与背景色、不参与淡入淡出等动画。

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | 布尔 | `true` | 让位名单总开关；置 `false` 时名单整体失效，恢复全部接管 |
| `mods` | 字符串数组 | `[]` | 命名空间列表，命中后该模组**所有物品**都让位 |
| `items` | 字符串数组 | `[]` | 物品注册名列表（`命名空间:物品id`），命中的物品让位 |

`mods` 与 `items` 任一命中即让位；两个列表都为空时行为与默认完全一致（全部接管）。

```json
{
  "bypass": {
    "enabled": true,
    "mods": ["slashblade"],
    "items": ["minecraft:diamond_sword"]
  }
}
```

上例的含义：拔刀剑模组的全部物品、以及原版钻石剑，都不使用 ColorTooltips 样式。

> **提示**：如果只是想让某个物品换个样式，用 `styleSelector.items` 把它指到 `Vanilla` 即可；
> `bypass` 是「完全不碰这个提示框」的更强手段。

#### 用指令一条命令登记

不想手动编辑 JSON 时，可以直接在游戏内用客户端指令登记，写入 `common.json` 并**立即生效**：

| 指令 | 作用 |
|------|------|
| `/colortooltips bypass add hand` | 把手持物品加入名单 |
| `/colortooltips bypass add hover` | 把鼠标悬停槽位里的物品加入名单 |
| `/colortooltips bypass add <物品ID 或 模组ID>` | 按 ID 加入；只写模组ID（如 `slashblade`）则整个模组让位 |
| `/colortooltips bypass remove hand` / `hover` / `<ID>` | 从名单移除 |
| `/colortooltips bypass list` | 列出名单全部条目 |
| `/colortooltips bypass check hand` / `hover` / `<ID>` | 查询某物品是否已让位、命中哪一条 |
| `/colortooltips bypass` | 查看名单开关与条目数量 |

示例：悬停在拔刀剑上执行 `/colortooltips bypass add hover`，该物品立刻恢复原版提示框，并且已经写进 `common.json`，重启后依然有效。

其它说明：

- 条目也接受从日志里复制的原始 JSON（含 `"id"` 字段），会自动提取物品注册名。
- 重复添加是幂等的，会提示「本来就在名单里」。
- 名单按注册名**精确匹配**（区分大小写，注册名全小写）；条目首尾空格自动忽略。
- 写入失败（文件被占用或只读）会红字提示，且不会破坏原文件内容。

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
  "bypass": {
    "enabled": true,
    "mods": [],
    "items": []
  },
  "smoothColor": true
}
```

## 注意事项

1. 修改任何 JSON 文件后，在游戏内执行 `/colortooltips reload` 即可热重载，无需重启。
2. 样式选择器的 `items` 字段中，物品注册名格式为 `"命名空间:物品id"`（例如 `"minecraft:diamond"`）。
3. 可以在 `styles/` 目录下添加自己的 `.json` 文件，文件名即为样式名（不含 `.json` 后缀），然后在 `styleSelector` 中引用。
4. JSON 文件损坏时，模组会自动使用默认值降级，不会导致游戏崩溃。日志中会记录加载警告。
5. `bypass` 名单按注册名**精确匹配**（区分大小写，注册名本身全小写）。`mods` 填命名空间（如 `slashblade`），`items` 填完整注册名（如 `slashblade:slashblade`）。条目首尾空格会被自动忽略。
