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
| `/raritycore recalculate-auto` | 重新计算所有自动稀有度配置 |

**示例：**
```
/raritycore sethand 3
/raritycore setrarity minecraft:diamond_sword 5
/raritycore removerarity minecraft:iron_sword
```

### 配置管理

| 命令 | 说明 |
|------|------|
| `/raritycore reload` | 重新加载所有稀有度配置 |
| `/raritycore config version` | 显示配置文件版本信息 |
| `/raritycore config upgrade` | 强制验证并升级配置文件 |

### 数据导出

| 命令 | 说明 |
|------|------|
| `/raritycore export all` | 导出所有稀有度数据到单个文件 |
| `/raritycore export all-mod` | 按模组分别导出稀有度数据 |
| `/raritycore export mod <模组ID>` | 导出指定模组的稀有度数据 |

**导出文件说明：**
- 文件名格式：`export_<类型>_<Minecraft版本>_<时间戳>.json`
- 保存位置：模组配置目录下

### 详细信息

| 命令 | 说明 |
|------|------|
| `/raritycore details` | 显示当前稀有度配置统计信息 |
| `/raritycore details nbt` | 显示 NBT 匹配配置详情 |

### 编辑模式

编辑模式允许在游戏中实时预览稀有度更改。

| 命令 | 说明 |
|------|------|
| `/raritycore edit enable` | 启用编辑模式 |
| `/raritycore edit disable` | 禁用编辑模式 |
| `/raritycore edit toggle` | 切换编辑模式 |
| `/raritycore edit status` | 显示当前编辑模式状态 |

### 性能监控

| 命令 | 说明 |
|------|------|
| `/raritycore perf stats` | 显示性能统计信息 |
| `/raritycore perf optimize` | 手动触发性能优化 |

## 客户端命令

`/raritycore-client` 命令无需 OP 权限，普通玩家均可使用。

| 命令 | 说明 |
|------|------|
| `/raritycore-client reload` | 重新加载客户端配置 |
| `/raritycore-client texture toggle` | 切换纹理边框显示 |
| `/raritycore-client cache stats` | 显示缓存统计信息 |
| `/raritycore-client cache clear` | 清空本地缓存 |

## 权限要求

| 权限等级 | 说明 |
|---------|------|
| 0 | 普通玩家（仅可使用 `/raritycore-client` 命令） |
| 2 | OP 玩家（可使用所有 `/raritycore` 命令） |
| 4 | 服务器管理员 |