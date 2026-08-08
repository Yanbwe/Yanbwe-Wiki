# 数据包注册

通过数据包 JSON 注册弹药类型与枪械→弹药绑定。与框架注册表一致：`/reload` 可热重载 JSON 定义，已发放物品的行为实时跟随。

## 通用规则

- JSON 文件放在 `data/<命名空间>/modularshootammo/<注册表路径>/<id>.json`
- 文件名为条目 ID（不含命名空间），命名空间由文件夹路径决定
- 可选字段省略时使用代码中注明的默认值
- 两个注册表均携带网络 codec，条目随连接**同步到客户端**（HUD 与 tooltip 需要查询）

## 弹药类型 JSON（`ammo_types`）

**路径**：`data/<命名空间>/modularshootammo/ammo_types/<弹药类型id>.json`

| JSON 键 | 类型 | 必需 | 默认值 | 说明 |
|---------|------|------|--------|------|
| `name` | 字符串 | **是** | — | 显示名，支持 `lang:` 翻译键前缀 |
| `color` | 字符串 | **是** | — | 标识颜色，`"#RRGGBB"` 格式（也接受无 `#` 前缀）；解析失败回退白色，永不导致崩溃 |
| `item` | 资源路径 | **是** | — | 弹药物品 id（决定背包备弹按哪种物品统计/扣取） |
| `reserve_limit` | 整数 | 否 | 无限制 | 备弹上限：背包中该弹药的可用数量截断值 |
| `per_shot_cost` | 整数 | 否 | `1` | 每次射击消耗的弹药数（如霰弹枪每发 2 颗弹壳） |
| `reload_sound` | 资源路径 | 否 | 无 | 换弹音效覆盖，优先于通用换弹音效 |

**示例**（随包数据，`demo_pistol` 绑定的手枪弹）：

```json
{
  "name": "lang:modularshootammo.ammo_type.pistol_ammo",
  "color": "#FFAA00",
  "item": "modularshootammo:pistol_ammo",
  "per_shot_cost": 1
}
```

**带备弹上限与专属换弹音效的完整示例**：

```json
{
  "name": "lang:modularshootammo.ammo_type.sniper_ammo",
  "color": "#AA88FF",
  "item": "modularshootammo:sniper_ammo",
  "reserve_limit": 128,
  "per_shot_cost": 1,
  "reload_sound": "modularshootammo:reload_start"
}
```

> `name` 用 `lang:` 前缀时，翻译键应注册到语言文件；缺少翻译时回退显示键本身。

## 枪械→弹药绑定 JSON（`gun_ammo_bindings`）

**路径**：`data/<命名空间>/modularshootammo/gun_ammo_bindings/<枪械id>.json`

| JSON 键 | 类型 | 必需 | 说明 |
|---------|------|------|------|
| `ammo_type` | 资源路径 | **是** | 绑定的弹药类型 id（`ammo_types` 注册表） |

**示例**：

```json
{
  "ammo_type": "modularshootammo:pistol_ammo"
}
```

## 框架侧配合项

弹药系统建立在框架的注册表之上，随包数据（命名空间 `modularshootammo`）声明了以下框架条目：

| 框架注册表 | 条目 | 说明 |
|-----------|------|------|
| `modularshoot:traits` | `uses_ammo` | 枪械声明 `"uses_ammo": true` 后启用弹药系统 |
| `modularshoot:traits` | `infinite_ammo` | 声明后豁免扣弹（HUD 显示 ∞） |
| `modularshoot:states` | `mag_ammo`（gun/int） | 弹匣余量，默认 0 |
| `modularshoot:states` | `reload_tick`（player/int）、`reload_gun`（player/uuid） | 换弹倒计时与目标枪 |
| `modularshoot:attribute_meta` | `mag_size`、`reload_time` | 绑定本模组注册的原版属性（`modularshootammo:mag_size` / `modularshootammo:reload_time`），枪械基础值在 `guns` JSON 的 `stats` 中声明 |

**枪械启用示例**（`modularshoot:guns/demo_pistol.json` 片段）：

```json
{
  "stats": {
    "modularshootammo:mag_size": 12,
    "modularshootammo:reload_time": 15,
    "modularshoot:hit_damage": 6
  },
  "traits": {
    "modularshootammo:uses_ammo": true
  }
}
```

> 完整字段格式见[框架数据包文档](../modularshoot/DataPack.md)。换弹/扣弹的具体行为规则由本模组 `AmmoService` 实现，不在此赘述。
