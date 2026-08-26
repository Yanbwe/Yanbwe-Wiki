# 配置指南

ModularShoot 提供两个配置文件（位于游戏目录 `config/` 下）。客户端配置可在游戏内「选项 → Mods → ModularShoot」界面直接编辑。

> **0.3.0 起新增公共配置** `modularshoot-common.toml`（服务器端子弹同步调优）；网络协议同时升至 4，与旧版不互通。

## 客户端配置（`modularshoot-client.toml`）

控制本地渲染行为，仅影响自己的画面，不影响服务器与其他玩家。修改后立即生效，无需重启。

### 近相机子弹透明度（`nearTranslucency`）

子弹飞到镜头附近时自动半透明，避免遮挡视线。

| 选项 | 类型 | 默认值 | 范围 | 说明 |
|------|------|--------|------|------|
| `nearTranslucency.enabled` | 布尔 | `true` | — | 总开关。关闭后子弹始终完全不透明 |
| `nearTranslucency.fadeDistance` | 小数 | `4.0` | 0.5–16.0 | 渐隐距离（格）：子弹距相机达到该距离时完全不透明；距离为 0 时取 `minOpacity`，中间按平滑曲线过渡 |
| `nearTranslucency.minOpacity` | 小数 | `0.2` | 0.05–1.0 | 距离 0 处的不透明度。设为 `1.0` 相当于禁用渐隐 |

示例：

```toml
[nearTranslucency]
enabled = true
fadeDistance = 4.0
minOpacity = 0.2
```

## 公共配置（`modularshoot-common.toml`，0.3.0 新增）

控制服务端子弹同步行为，服主可按服务器规模调节带宽与流畅度的平衡。**所有值均为服务端权威**：客户端无需配置相同的值即可正常联机。

### 子弹同步（`bulletSync`）

子弹增量同步按与玩家的距离分档：近档内每 tick 均可更新；中档限制为每 `midIntervalTicks` 一次；远档限制为每 `farIntervalTicks` 一次。此外每隔 `fullSyncIntervalTicks` 强制下发一次全量同步，用于丢包后的漂移恢复。

| 选项 | 类型 | 默认值 | 范围 | 说明 |
|------|------|--------|------|------|
| `bulletSync.closeDistance` | 小数 | `32.0` | 8–128 | 近档半径（格）：该距离内的子弹每 tick 均可发送位置更新 |
| `bulletSync.midDistance` | 小数 | `64.0` | 16–256 | 中档半径（格）：近档与该值之间的子弹按 `midIntervalTicks` 限频。小于 `closeDistance` 时按 `closeDistance` 处理 |
| `bulletSync.midIntervalTicks` | 整数 | `2` | 1–20 | 中档子弹两次更新的最小 tick 间隔 |
| `bulletSync.farIntervalTicks` | 整数 | `4` | 1–40 | 远档（超出中档）子弹两次更新的最小 tick 间隔。小于 `midIntervalTicks` 时按 `midIntervalTicks` 处理 |
| `bulletSync.fullSyncIntervalTicks` | 整数 | `100` | 20–1200 | 强制全量同步间隔（tick，100 = 5 秒）。用于丢包后客户端自愈；调低更稳但带宽更高 |

示例：

```toml
[bulletSync]
closeDistance = 32.0
midDistance = 64.0
midIntervalTicks = 2
farIntervalTicks = 4
fullSyncIntervalTicks = 100
```

**调优建议**：

- **追求流畅**（近距离大量子弹的玩法）：把 `midIntervalTicks` / `farIntervalTicks` 调低（1–2），并适度扩大 `closeDistance`
- **节省带宽**（大型多人服务器）：调高各间隔、缩小分档半径；代价是远处子弹的位置更新略有延迟（视觉可接受，命中判定始终由服务端权威执行）
