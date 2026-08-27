# 命令参考

`/onegun` 为 OneGunLifetime 的根命令。玩家自用子命令 `bind`、`stat`、`trait`、`info` 不需要 op 权限；管理员子命令 `unbind` 需要 op 权限等级 2。

## 子命令速查

| 子命令 | 参数 | 说明 |
|--------|------|------|
| `bind <枪械ID>` | `枪械ID` — 框架枪械注册 ID（如 `modularshoot:demo_pistol`），必须是 `getAllGunIds` 中的实体定义 | 将执行者灵魂绑定到该枪械模板，一生一次；成功后生成第一把投影枪 |
| `stat set <属性ID> <数值>` | `属性ID` — `attribute_meta` 注册表中的逻辑属性 ID；`数值` — 任意有限数值 | 覆写某个逻辑属性的基础值 |
| `stat reset [属性ID]` | `属性ID` 可选 | 不带参数清空全部数值覆写；带参数仅移除指定属性覆写 |
| `trait add <特性ID>` | `特性ID` — 已注册的特性 ID | 为灵魂枪添加特性 |
| `trait remove <特性ID>` | `特性ID` — 已注册的特性 ID | 从灵魂枪移除特性 |
| `info` | 无 | 展示当前绑定：模板、覆写、特性、插件、版本、稳定枪 ID |
| `unbind <玩家>` | `玩家` — 在线玩家 | 管理员专用：清除目标绑定与投影枪，op 2 |

## 使用示例

| 操作 | 命令 |
|------|------|
| 绑定 demo 手枪 | `/onegun bind modularshoot:demo_pistol` |
| 将 `modularshoot:hit_damage` 覆写为 20 | `/onegun stat set modularshoot:hit_damage 20` |
| 清空全部数值覆写 | `/onegun stat reset` |
| 添加 `modularshoot:auto` 特性 | `/onegun trait add modularshoot:auto` |
| 查看自己的灵魂绑定 | `/onegun info` |
| 管理员解绑玩家 Steve | `/onegun unbind Steve` |

## 错误提示

- 未绑定玩家使用 `stat`/`trait`/`info` 会收到“先绑定”提示。
- 已绑定玩家再次使用 `bind` 会被拒绝。
- `bind` 只能绑定框架实体注册表中的枪械定义，不能绑定动态生成的玩家专属枪 ID。
- 参数校验失败不会产生半生效状态。