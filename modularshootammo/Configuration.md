# 客户端配置

客户端配置文件 `modularshootammo-client.toml`（NeoForge 配置系统），存放于常规配置目录。可在**游戏内配置界面**编辑：`Options → Mods → ModularShootAmmo`，修改保存后**下一帧即生效**，无需重启。

> 本模组当前无服务端配置；以下全部为客户端（HUD）配置。

## 配置项一览

| 配置键 | 类型 | 默认值 | 范围 | 说明 |
|--------|------|--------|------|------|
| `hud.offsetX` | 整数 | `8` | 0-2000 | HUD 距屏幕右/左边缘的偏移（GUI 缩放后像素） |
| `hud.offsetY` | 整数 | `8` | 0-2000 | HUD 距屏幕下/上边缘的偏移（GUI 缩放后像素） |
| `hud.scale` | 浮点 | `1.0` | 0.25-4.0 | HUD 整体缩放倍率 |
| `hud.showReserve` | 布尔 | `true` | — | 是否显示备弹数（`弹匣/备弹` 格式的第二段）；关闭后只显示弹匣数 |
| `hud.showReloadProgress` | 布尔 | `true` | — | 是否显示换弹中提示文字与进度条 |
| `hud.anchor` | 枚举 | `BOTTOM_RIGHT` | `BOTTOM_RIGHT` / `BOTTOM_LEFT` / `TOP_RIGHT` / `TOP_LEFT` | HUD 锚点（四角定位） |

## HUD 显示规则

- 手持枪械且启用弹药系统（`uses_ammo`）时显示第 1 行：`弹匣数/备弹数`
  - 弹匣与备弹数字按绑定弹药类型的颜色着色
  - 弹匣为空时数字变红（`0xFFFF5555`）警示
  - 无限弹药（`infinite_ammo`）或创造模式下显示 `∞`
- 换弹进行中显示第 2 行：换弹提示文字 + 进度条（`hud.showReloadProgress` 控制）
