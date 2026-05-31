# 命令参考

StylizedDamage 提供以下命令，所有命令均以 `/stylizeddamage` 为根。

---

## 命令列表

### `/stylizeddamage reload`

重载所有配置文件（`common.json` 和 `styles/` 目录下的所有样式文件）。

- **权限等级**：2（仅管理员）
- **效果**：热重载配置和样式，无需重启游戏

```
/stylizeddamage reload
```

---

### `/stylizeddamage test <伤害类型> <数值>`

在屏幕中央（准星位置）生成一个测试伤害数字。

- **权限等级**：1（仅作弊）
- **参数**：
  - `<伤害类型>`：伤害类型 ID，如 `minecraft:in_fire`、`heal`
  - `<数值>`：伤害数值，如 `12.5`

```
/stylizeddamage test minecraft:in_fire 15
/stylizeddamage test heal 10
```

---

### `/stylizeddamage list`

列出所有已加载的样式名称和选择器绑定关系。

- **权限等级**：1（仅作弊）

```
/stylizeddamage list
```

输出示例：
```
=== 已加载样式 ===
- default
- fire
- magic

=== 选择器绑定 ===
common/common: * → default
```

---

### `/stylizeddamage toggle`

开关伤害跳字显示。

- **权限等级**：1（仅作弊）
- **效果**：切换全局显示开关，关闭后所有伤害跳字和总伤害面板均不渲染

```
/stylizeddamage toggle
```
