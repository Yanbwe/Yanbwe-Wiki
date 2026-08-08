# 命令参考

`/modularammo` 调试命令，需要 op 权限等级 2。

## 子命令速查

| 子命令 | 参数 | 说明 |
|--------|------|------|
| `info` | 无 | 转储主手枪械的弹药状态：`uses_ammo`/`infinite_ammo` 特性值、绑定弹药类型、弹匣 `mag/mag_size`、背包备弹数、`reload_tick`/`reload_gun` 与最终 `reload_time`。主手非枪械时失败 |
| `ammo <弹药类型> <数量>` | `弹药类型` — 弹药类型注册 ID（如 `modularshootammo:rifle_ammo`）；`数量` — 1-9999 | 给予自身指定类型的弹药物品（背包满则掉落）。类型未注册时失败 |
| `fill` | 无 | 将主手枪械弹匣补满至最终 `mag_size`。主手非枪械或无状态数据时失败 |
| `bind <枪械> <弹药类型>` | `枪械` — 枪械注册 ID；`弹药类型` — 弹药类型注册 ID | Java 绑定枪械→弹药（内存绑定，不持久化，立即生效，跨 `/reload` 存活） |

## 使用示例

| 操作 | 命令 |
|------|------|
| 查看手中枪的弹药状态 | `/modularammo info` |
| 获取 64 发步枪弹 | `/modularammo ammo modularshootammo:rifle_ammo 64` |
| 补满手中枪的弹匣 | `/modularammo fill` |
| 让 demo_pistol 改用步枪弹 | `/modularammo bind modularshootammo:demo_pistol modularshootammo:rifle_ammo` |
