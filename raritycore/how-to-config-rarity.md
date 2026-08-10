# **稀有度说明**

在开始为物品赋予稀有度前,你得知道本模组的稀有度是个什么东西.

正如名字表示,稀有度是一个物品的特征,它表示物品的稀有程度,物品越难获取,稀有度就越高.

而很多人将稀有度理解为物品的品质,这是不对的!**稀有度≠品质**!

一个物品在要花很大的代价,或要有很好的运气才能获得的情况下,哪怕这个物品没有任何实质性作用,他也配得上高稀有度.

而另一个物品,在用一个泥土合成,却能有比金苹果还厉害的效果的情况下,他也配不上高稀有度.

# 常规的稀有度配置

稀有度核心最主要的稀有度配置是基于物品的id的,首先我们需要准备一些json文件,在这些文件中,我们应该这样写:

```json
{
  "minecraft:item_id": rarity_value,
  "another_mod:item_id": rarity_value,
  ...
}
```
将物品的稀有度一个个列出来,就是这样.

之后,稀有度核心会在以下位置读取稀有度信息:

1. `config\raritycore\auto\auto_rarity.json`
2. (数据包)`data\<命名空间>\rarity\*.json`
3. `config\raritycore\FinalRarityConfig\*.json`
4. `config\raritycore\FinalRarity.json`

将你的稀有度信息写在这些json文件中,稀有度核心便会读取它们.

> **加载优先级说明:**
>
> 需要注意的是,稀有度核心会按照以上的顺序加载稀有度配置,后加载的会覆盖先加载的同名物品配置

那一个个手打id也太繁琐了,有没有更快的方式呢,有的兄弟,有的~

## 0. 自动稀有度计算功能

稀有度核心最具特色的功能,无需人为操作,自动根据合成表评估物品的稀有度.

只需要运行一条命令 `/raritycore recalculate-auto` 即可启动自动稀有度计算功能.

计算后的稀有度存在 `config\raritycore\auto\auto_rarity.json` 文件中.

如果服务端启动后,没有`auto_rarity.json`文件,会自动运行自动稀有度计算功能.

缺点是仅支持工作台、熔炉、锻造台的配方,导致无法计算所有物品的稀有度,这点在科技整合包中尤为明显,后续会支持更多的配方类型.

## 1. 使用游戏命令添加

1. `/raritycore sethand <rarity>` 设置当前手持物品的稀有度
2. `/raritycore removehand` 删除当前手持物品的稀有度配置
3. `/raritycore setrarity <item> <rarity>` 设置指定物品的稀有度
4. `/raritycore removerarity <item>` 删除指定物品的稀有度配置

使用以上方法修改的稀有度会存进 `config\raritycore\FinalRarity.json` 文件中.

## 2. 使用编辑模式修改

如果想快速可控地修改物品的稀有度,可以使用编辑模式.

> **Ver.13 更新**: 编辑模式已重构,支持 Normal 和 FullMatch 两种模式.

### 编辑模式命令

```
/raritycore edit toggle <true|false>     # 开启/关闭编辑模式
/raritycore edit mode <normal|fullmatch>  # 切换编辑模式
/raritycore edit parameter rarity <值>    # 设置稀有度参数
/raritycore edit parameter autoReload <true|false>  # FullMatch 模式: 是否自动重载
/raritycore edit parameter stringContains <true|false> # FullMatch 模式: 字符串是否用包含匹配
/raritycore edit parameter ignore "<aa|bb|cc>"       # FullMatch 模式: 忽略的 NBT 标签
```

### Normal 模式

将物品与稀有度写入 `FinalRarity.json`,和之前的行为一致。

- `rarity=0` 表示「无稀有度」(等同于删除)
- 快捷键: `Ctrl+1`~`Ctrl+7` 选择等级,`Ctrl+0` 清除稀有度

> **TACZ 联动**: 当安装 TACZ (Timeless and Classics Zero) 模组时,Normal 模式下点击 TACZ 的枪械/配件/子弹**不会**写入 `FinalRarity.json`,而是自动生成基于子物品 ID (GunId/AttachmentId/AmmoId) 的匹配配置。
>
> 这是因为 TACZ 的枪械、配件、子弹共用同一个物品 ID (如 `tacz:modern_kinetic_gun`),需要通过子物品 ID 区分。
>
> - 生成的规则保存在 `config/raritycore/item_data_matches/editTacZ_*.json`,写入后立即生效
> - 重复编辑同一子物品会**覆盖更新**对应规则,不累积文件
> - TACZ 子物品不支持 `rarity=0` 删除

### FullMatch 模式

创建 **NBT 匹配配置文件**,将物品当前的所有 NBT 标签作为匹配条件生成规则文件。

**适用场景**: 需要通过 NBT 子标签区分同名物品时(如药水类型、附魔等级等)。

**行为**:
- 点击物品后,自动在 `config/raritycore/nbt_matches/` 下生成 `edit_<物品id>_<N>.json`
- 文本类型标签默认使用**包含匹配**(contains);关闭 `stringContains` 后使用等值匹配(equals)
- 其他类型标签使用等值匹配(equals)
- `ignore` 中指定的标签名会被排除,不参与匹配
- 默认不自动重载,设置 `autoReload=true` 后生成规则立即生效

**参数说明**:

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `rarity` | 1 | 分配的稀有度等级 (≥0) |
| `autoReload` | false | 生成配置后是否自动重载 |
| `stringContains` | true | 字符串类型 NBT 是否用包含匹配 |
| `ignore` | (空) | 排除的 NBT 标签,以 `\|` 分隔 |

### GUI 面板

编辑模式开启后,所有 GUI 左上角会显示浮动面板(默认为左上角,可按住面板空白区域拖动调整位置,面板不会拖出屏幕;位置仅内存保存,重启后复位):

- **当前模式** (Normal/FullMatch) — 点击可切换
- **稀有度等级** — `[-]` `[+]` 按钮直接调整
- **FullMatch 额外参数**: AutoReload、StrContains、Ignore(仅展示)
- `Ctrl+H` 折叠/展开面板
- 面板鼠标事件不穿透到下层 GUI
- 按住面板空白区域拖动可移动面板位置

然后 shift+右键 任意物品即可编辑

## 3. 基于 Tag 批量分配稀有度

如果你的整合包使用了大量模组,逐个物品配置稀有度非常耗时。TagRarity 功能允许你通过 Minecraft 的标签(Tag)系统批量分配稀有度。

配置文件: `config/raritycore/TagRarity.json`

格式:
```json
{
  "tag_rules": [
    { "tag": "forge:ingots/netherite", "rarity": 5 },
    { "tag": "forge:gems/diamond", "rarity": 4 },
    { "tag": "minecraft:swords", "rarity": 2 }
  ]
}
```

**规则:**
- `tag`: Minecraft TagKey,如 `forge:ingots/netherite`、`minecraft:swords`
- 物品匹配多个 Tag 时,自动取**最高稀有度**
- 模组物品只要打上对应标签即自动继承,对整合包极友好
- **优先级高于**自动稀有度计算,但**低于**手动配置 (FinalRarity.json)

## 999. 基于物品数据的配置

想要基于物品的 NBT 标签/物品组件来配置稀有度的话,请参阅 [NBT匹配](/raritycore/matching-config/NBTMatching) 和 [物品组件匹配](/raritycore/matching-config/ItemComponentMatching)。
