# 命令参考

`/modularshoot` 调试命令，需要 op 权限等级 2（`modularshoot.command` 权限节点）。
## 子命令速查

| 子命令 | 参数 | 说明 |
|--------|------|--------|
| `stats` | 无 | 查询当前主手枪械的**最终计算后属性值**（含枪械基础值 + 插件修饰符 + Buff/装备叠加的全部来源） |
| `plugins` | 无 | 列出当前主手枪械的所有已安装插件。每项显示：插件 ID、安装种类 ID、实例 UUID、锁定状态 |
| `gun <id>` | `id` — 枪械注册 ID（如 `modularshoot:test_gun`） | 给予自身一个指定枪械物品 |
| `plugin <id> [数量]` | `id` — 插件注册 ID；`数量` — 可选，给予数量（默认 1，钳制在 1-64） | 给予自身一个或多个指定插件物品 |
| `bullets` | 无 | 查询当前世界的活跃子弹数量与简要状态 |
| `debug <on\|off>` | `on` 或 `off` | 切换调试模式。开启时在动作栏持续显示当前主手枪械的关键属性值 |

## 使用示例

| 操作 | 命令 |
|------|------|
| 查看手中枪的全属性 | `/modularshoot stats` |
| 查看手中枪安装了哪些插件 | `/modularshoot plugins` |
| 获取一把测试枪 | `/modularshoot gun modularshoot:test_gun` |
| 获取 5 个速射枪管插件 | `/modularshoot plugin modularshoot:rapid_fire_barrel 5` |
| 查看世界中有多少活跃子弹 | `/modularshoot bullets` |
| 开启调试 HUD | `/modularshoot debug on` |
