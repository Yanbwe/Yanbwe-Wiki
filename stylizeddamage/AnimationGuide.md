# 动画配置指南

动画系统由**四个独立模块**组成：位移（position）、大小（size）、明度（brightness）、透明度（opacity）。

四个模块同时播放，互不干扰。退出阶段**统一从最长 enter 时长结束后开始**，确保不同 enter 时长的模块退出同步。每个模块分三个生命周期阶段：

```
进入动画 → 停留 (hold) → 退出动画 → 移除
```

---

## 动画配置结构

```jsonc
"animation": {
  "hold": 10,            // 停留 tick 数
  "position": { ... },   // 位移动画
  "size": { ... },       // 大小动画
  "brightness": { ... }, // 明度动画
  "opacity": { ... }     // 透明度动画
}
```

---

## 通用参数

每个模块的进入/退出阶段共用以下参数：

| 参数 | 类型 | 说明 |
|------|------|------|
| `type` | 字符串 | `"none"`（无动画）或 `"normal"`（有动画） |
| `duration` | 整数 | 动画持续 tick 数（`type` 为 normal 时必填） |
| `easing` | 对象 | 缓动曲线配置 |

### 缓动曲线

| easing 配置 | 效果 |
|-------------|------|
| `{ "in": false, "out": true }` | 缓出（默认）— 开始快结束慢 |
| `{ "in": true, "out": false }` | 缓入 — 开始慢结束快 |
| `{ "in": true, "out": true }` | 缓入缓出 — 两端慢中间快 |
| `{ "in": false, "out": false }` | 线性 — 匀速运动 |

---

## 随机值

支持随机值的参数可使用三种表示法：

**固定值：**
```json
"distance": 20
```

**基础值 + 正向随机（0%~50%）：**
```json
"distance": { "base": 20, "random": 0.5 }
```

**基础值 + 双向随机（-30%~30%）：**
```json
"distance": { "base": 20, "random": [-0.3, 0.3] }
```

---

## 位移动画 (position)

控制数字在屏幕上的位置变化。

> **距离缩放**：位移动画的偏移量会随实体到玩家的距离等比缩放。远处实体的跳字移动幅度更小，近处正常。



### 进入 (enter)

- `type: "none"` — 直接出现在目标位置
- `type: "normal"` — 从开始位置移动到目标位置

参数：

| 参数 | 说明 |
|------|------|
| `startOffset` | 动画开始时的位置偏移 |
| `targetOffset` | 动画结束时的位置偏移（相对于原始位置） |

偏移支持两种模式：

**XY 绝对值偏移：**
```json
"startOffset": { "type": "xy", "x": -10, "y": -20 }
```

**方向偏移：**
```json
"startOffset": { "type": "direction", "angle": -90, "distance": 12 }
```

- `angle`：角度（度），0° = 右，90° = 上，-90° = 下
- `distance`：距离（像素），支持随机值

### 退出 (exit)

- `type: "none"` — 保持进入后的位置
- `type: "normal"` — 从当前位移动到 `targetOffset`

```json
"exit": {
  "type": "normal",
  "duration": 15,
  "easing": { "in": true, "out": true },
  "targetOffset": { "type": "direction", "angle": -60, "distance": 30 }
}
```

---

## 大小动画 (size)

控制数字的缩放，基于样式中的 `fontSize`。

### 进入 (enter)

| 参数 | 说明 |
|------|------|
| `startOffset` | 开始大小偏移（0.5 = 大 50%） |
| `targetOffset` | 目标大小偏移（0 = 原始大小） |

```json
"enter": {
  "type": "normal",
  "duration": 6,
  "easing": { "in": true, "out": true },
  "startOffset": 0.3,
  "targetOffset": 0
}
```

### 退出 (exit)

```json
"exit": {
  "type": "normal",
  "duration": 10,
  "easing": { "in": true, "out": true },
  "targetOffset": -0.5
}
```

负值表示缩小：`-0.5` = 缩到原始大小的 50%。

---

## 明度动画 (brightness)

控制数字颜色的明暗。进入阶段从 `startOffset` 变化到 0（原始明度），退出阶段从 0 变化到 `targetOffset`。正值更亮，负值更暗。

### 进入 (enter)

```json
"enter": {
  "type": "normal",
  "duration": 8,
  "easing": { "in": true, "out": true },
  "startOffset": 0.3
}
```

### 退出 (exit)

```json
"exit": {
  "type": "normal",
  "duration": 10,
  "easing": { "in": true, "out": true },
  "targetOffset": -0.2
}
```

---

## 透明度动画 (opacity)

控制数字的透明度。0.0 = 完全透明，1.0 = 完全不透明。

### 进入 (enter)

| 参数 | 说明 |
|------|------|
| `startOpacity` | 开始透明度 |
| `targetOpacity` | 目标透明度 |

```json
"enter": {
  "type": "normal",
  "duration": 4,
  "easing": { "in": true, "out": true },
  "startOpacity": 0,
  "targetOpacity": 1
}
```

### 退出 (exit)

```json
"exit": {
  "type": "normal",
  "duration": 12,
  "easing": { "in": true, "out": true },
  "targetOpacity": 0
}
```

---

## 完整生命周期示意

以默认样式为例（max enter=40, hold=10）：

```
Tick 0-40:  位置进入(30tick) + 大小进入(40tick) + 透明度进入(10tick)
            短 enter 的模块在最长 enter(40tick) 结束前保持停留
Tick 40-50: 停留（hold=10 tick）
Tick 50-90: 大小退出(40tick) + 透明度退出(40tick) 同时进行
Tick 90:    移除
```

动画引擎每 tick 更新所有模块状态，`isComplete()` 为 true 时自动移除跳字。
