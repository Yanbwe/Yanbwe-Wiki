# ModularShootAmmo（模块化射击·弹药）

**https://github.com/Yanbwe/ModularShootAmmo**

ModularShootAmmo 是 [ModularShoot（模块化射击）](./) 框架的**弹药 addon 模组**，运行于 NeoForge 1.21.1。它为框架枪械添加弹匣制弹药、换弹与弹药 HUD 系统。

> **依赖**：本模组为框架的附属模组，**必需安装** [ModularShoot](./) 框架才能运行。它负责框架"射击引擎"之外的装填侧逻辑：弹药、换弹、备弹与 HUD。

## 功能一览

| 功能 | 说明 |
|------|------|
| **弹匣制弹药** | 枪械数据包声明 `uses_ammo` 特性即启用；弹匣余量走框架 GunState，容量/换弹时间走属性管线（可被插件修饰，如扩容弹匣 +15） |
| **射击扣弹** | 服务端按 `per_shot_cost` 扣弹（支持每发多颗）；创造模式与 `infinite_ammo` 特性豁免；空仓/换弹中禁止射击 |
| **换弹闭环** | R 键手动换弹 + 空仓扣扳机自动换弹；切枪/收枪/死亡/登出中断倒计时；背包备弹跨堆叠扣取，支持 `reserve_limit` 上限 |
| **弹药类型系统** | `ammo_types` 注册表：颜色、每发消耗、备弹上限、专属换弹音效均可配置 |
| **枪械→弹药绑定** | `gun_ammo_bindings` 注册表（数据包/Java 双路），随网络同步客户端 |
| **弹药 HUD** | 弹匣/备弹（类型着色、空匣红警、无限 ∞）+ 换弹进度条；偏移/缩放/锚点/显示项全部可配置 |
| **Tooltip** | 弹药物品显示归属弹药类型；枪械属性栏后显示弹药类型与每发消耗 |
| **调试命令** | `/modularammo info\|ammo\|fill\|bind`（op 2） |
| **Java API** | `ModularAmmoAPI` 支持代码绑定与查询，跨 `/reload` 存活 |

## 快速上手

1. 安装本模组与 [ModularShoot](./) 框架（NeoForge 21.1.233+，MC 1.21.1）
2. 从创造标签「ModularShoot: Ammo」获取 demo 手枪/散弹枪与四种弹药
3. 按住右键射击，弹匣打空后按 **R** 换弹（或空仓时直接扣扳机自动换弹）

## 快速导航

| 文档 | 适合人群 | 内容 |
|------|---------|------|
| [数据包注册](./DataPack.md) | 想用 JSON 给枪械配弹药/注册弹药类型的开发者 | 弹药类型与枪械绑定 JSON 格式、框架侧配合项 |
| [API 参考](./API.md) | 想用代码调用弹药功能的开发者 | `ModularAmmoAPI` 方法速查与注册表 key |
| [命令参考](./CommandReference.md) | 想用调试命令的开发者 | `/modularammo` 子命令速查 |
| [客户端配置](./Configuration.md) | 想调整 HUD 的玩家 | HUD 全部配置项说明 |

## 演示内容

| 内容 | 说明 |
|------|------|
| demo 手枪 | 12 发弹匣，`hit_damage 6`，绑定手枪弹（#FFAA00） |
| demo 散弹枪 | 6 发弹匣 × 每发 2 弹壳，四颗弹丸，绑定霰弹（#AAFF00） |
| 4 种弹药 | 手枪/步枪/霰弹/狙击弹（黄/橙/绿/紫四色纹理） |
| 扩容弹匣插件 | `demo_extended_mag`，+15 弹容量 |
