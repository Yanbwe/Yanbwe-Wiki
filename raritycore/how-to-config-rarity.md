# **稀有度说明**

在开始为物品赋予稀有度前,你得知道本模组的稀有度是个什么东西.

正如名字表示,稀有度是一个物品的特征,它表示物品的稀有程度,物品越难获取,稀有度就越高.

而很多人将稀有度理解为物品的品质,这是不对的!**稀有度≠品质**!

一个物品在要花很大的代价,或要有很好的运气才能获得的情况下,哪怕这个物品没有任何实质性作用,他也配得上高稀有度.

而另一个物品,在用一个泥土合成,却能有比金苹果还厉害的效果的情况下,他也配不上高稀有度.

# 常规的稀有度配置

稀有度核心最主要的稀有度配置是基于物品的id的，首先我们需要准备一些json文件，在这些文件中，我们应该这样写：

```json
{
  "minecraft:item_id": rarity_value,
  "another_mod:item_id": rarity_value,
  ...
}
```
将物品的稀有度一个个列出来，就是这样。

之后，稀有度核心会在以下位置读取稀有度信息：

1. `config\raritycore\auto\auto_rarity.json`
2. (数据包)`data\<命名空间>\rarity\*.json`
3. `config\raritycore\FinalRarityConfig\*.json`
4. `config\raritycore\FinalRarity.json`

将你的稀有度信息写在这些json文件中，稀有度核心便会读取它们。

> **加载优先级说明:**
>
> 需要注意的是，稀有度核心会按照以上的顺序加载稀有度配置,后加载的会覆盖先加载的同名物品配置

那一个个手打id也太繁琐了，有没有更快的方式呢，有的兄弟，有的~

## 0. 自动稀有度计算功能

稀有度核心最具特色的功能，无需人为操作，自动根据合成表评估物品的稀有度。

只需要运行一条命令 `/raritycore recalculate-auto` 即可启动自动稀有度计算功能。

计算后的稀有度存在 `config\raritycore\auto\auto_rarity.json` 文件中。

如果服务端启动后，没有`auto_rarity.json`文件，会自动运行自动稀有度计算功能。

缺点是仅支持工作台、熔炉、锻造台的配方，导致无法计算所有物品的稀有度，这点在科技整合包中尤为明显，后续会支持更多的配方类型。

## 1. 使用游戏命令添加

1. `/raritycore sethand <rarity>` 设置当前手持物品的稀有度
2. `/raritycore removehand` 删除当前手持物品的稀有度配置
3. `/raritycore setrarity <item> <rarity>` 设置指定物品的稀有度
4. `/raritycore removerarity <item>` 删除指定物品的稀有度配置

使用以上方法修改的稀有度会存进 `config\raritycore\FinalRarity.json` 文件中.

## 2. 使用编辑模式修改

如果想快速可控地修改物品的稀有度，可以使用编辑模式，

`/raritycore edit enable/disable/toggle` 编辑模式控制

之后，您可以按以下方式修改物品稀有度:

1. 在任意游戏界面中(物品栏、箱子、工作台等)
2. 点击想要修改稀有度的物品

按住 `Ctrl` 键同时按下对应的数字键来切换指定的稀有度等级，也可以开启删除模式来删除稀有度.

- `Ctrl + 1` - 等级 1
- `Ctrl + 2` - 等级 2
- `Ctrl + 3` - 等级 3
- `Ctrl + 4` - 等级 4
- `Ctrl + 5` - 等级 5
- `Ctrl + 6` - 等级 6
- `Ctrl + 7` - 等级 7
- `Ctrl + 0` - 删除模式

- 编辑模式下的修改会像命令那样立即应用并自动保存到 `config/raritycore/FinalRarity.json` 文件中;
- 完成编辑后记得关闭编辑模式~

## 基于物品数据的配置

想要基于物品的 NBT标签/物品组件 来配置稀有度的话，请参阅 [NBT匹配](/raritycore/matching-config/NBTMatching) 和 [物品组件匹配](/raritycore/matching-config/ItemComponentMatching)。