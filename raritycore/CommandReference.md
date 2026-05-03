# 稀有度核心命令参考

稀有度核心提供两组命令：`/raritycore`（服务端命令，需要 OP 权限）和 `/raritycore-client`（客户端命令，普通玩家可用）。

## 服务端命令

所有 `/raritycore` 子命令都需要 OP 权限（权限等级 2）。

### 稀有度管理

| 命令 | 说明 |
|------|------|
| `/raritycore sethand <稀有度>` | 设置主手物品的稀有度 |
| `/raritycore removehand` | 移除主手物品的稀有度 |
| `/raritycore setrarity <物品ID> <稀有度>` | 设置指定物品的稀有度 |
| `/raritycore removerarity <物品ID>` | 移除指定物品的稀有度 |
| `/raritycore recalculate-auto` | 重新计算自动稀有度 |

**示例：**
```
/raritycore sethand 3
/raritycore setrarity minecraft:diamond_sword 5
/raritycore removerarity minecraft:iron_sword
```

### 配置管理

| 命令 | 说明 |
|------|------|
| `/raritycore reload` | 重新加载所有配置和稀有度数据 |

### 数据导出

| 命令 | 说明 |
|------|------|
| `/raritycore export all` | 导出所有稀有度数据到单个文件 |
| `/raritycore export all-mod` | 按模组分别导出稀有度数据 |
| `/raritycore export mod <模组ID>` | 导出指定模组的稀有度数据 |
| `/raritycore export rarity <等级>` | 导出指定稀有度等级的所有物品 |

**导出文件说明：**
- 文件名格式：`export_<类型>_<Minecraft版本>_<时间戳>.json`，`export rarity` 为 `export_rarity_<等级>_<时间戳>.json`
- 保存位置：模组配置目录下

### 详细信息

| 命令 | 说明 |
|------|------|
| `/raritycore details` | 显示当前稀有度配置统计信息 |
| `/raritycore details nbt` | 显示 NBT 匹配配置详情 |

### 编辑模式

> **Ver.13 重构**：编辑模式已重构为模式+参数驱动。详见[稀有度配置指南](/raritycore/how-to-config-rarity)。

**编辑模式控制：**

| 命令 | 说明 |
|------|------|
| `/raritycore edit toggle <true\|false>` | 开启/关闭编辑模式 |
| `/raritycore edit mode <normal\|fullmatch>` | 切换编辑模式 |

**参数设置（所有参数随时可修改，某参数是否生效取决于当前模式）：**

| 命令 | 说明 | 适用模式 |
|------|------|---------|
| `/raritycore edit parameter rarity <值>` | 设置稀有度等级（≥0） | 全部 |
| `/raritycore edit parameter autoReload <true\|false>` | 生成配置后是否自动重载 | FullMatch |
| `/raritycore edit parameter stringContains <true\|false>` | 字符串类型 NBT 是否用包含匹配 | FullMatch |
| `/raritycore edit parameter ignore "<aa\|bb\|cc>"` | 排除的 NBT 标签，以 `\|` 分隔 | FullMatch |

**GUI 操作：**
- 编辑模式开启后，左上角显示浮动面板
- 点击面板上的模式名可切换 Normal/FullMatch
- `[-]` `[+]` 按钮调整稀有度等级
- `Ctrl+1`~`Ctrl+7` 选择等级，`Ctrl+0` 清除稀有度
- `Ctrl+H` 折叠/展开面板

## 客户端命令

`/raritycore-client` 命令无需 OP 权限，普通玩家均可使用。

| 命令 | 说明 |
|------|------|
| `/raritycore-client reload` | 重新加载客户端配置（`client.json` 和 `RarityClientConfig.json`） |
| `/raritycore-client cache stats` | 显示缓存统计信息 |
| `/raritycore-client cache clear` | 清空本地缓存 |

## 权限要求

| 权限等级 | 说明 |
|---------|------|
| 0 | 普通玩家（仅可使用 `/raritycore-client` 命令） |
| 2 | OP 玩家（可使用所有 `/raritycore` 命令） |
| 4 | 服务器管理员 |
