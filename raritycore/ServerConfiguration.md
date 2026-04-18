# 服务端配置说明

## 配置文件位置

服务端配置文件位于:
```
config/raritycore/server.json
```

## 配置选项

### checkVanillaRarity

- **类型**: 布尔值
- **默认值**: `true`
- **说明**: 控制是否检查原版物品稀有度并映射到 RarityCore 的稀有度系统
- **效果**: 启用时,具有原版稀有/史诗品质的物品将自动分配对应的 RarityCore 稀有度等级

### checkApotheosisRarity

- **类型**: 布尔值
- **默认值**: `true`
- **说明**: 控制是否检查神化模组物品稀有度并映射到 RarityCore 的稀有度系统
- **效果**: 启用时,具有神化稀有度的物品将自动分配对应的 RarityCore 稀有度等级

### enableGetRarityWarning

- **类型**: 布尔值
- **默认值**: `true`
- **说明**: 控制是否启用 getRarity() 可用性警告
- **效果**: 启用时,当检测到物品调用 getRarity() 方法时会输出警告日志

## 配置文件格式

```json
{
  "checkVanillaRarity": true,
  "checkApotheosisRarity": true,
  "enableGetRarityWarning": true
}
```

## 重新加载服务端配置

```
/reload
```

此命令重新加载所有服务端配置,包括稀有度数据.

## 查看配置版本

```
/raritycore config version
```

此命令显示当前配置版本信息.

## 强制配置升级

```
/raritycore config upgrade
```

此命令强制将所有配置文件升级到最新版本.

## 注意事项

1. 服务端配置仅影响服务器端行为,客户端无需同步这些设置
2. 修改配置后建议使用 `/reload` 命令使其生效
3. 如果配置文件损坏,删除后重启服务器会自动生成默认配置