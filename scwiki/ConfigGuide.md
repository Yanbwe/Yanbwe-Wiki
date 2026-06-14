# SearchCarefully 模组配置指南

## 配置文件位置

配置文件位于 `.minecraft/config/searchcarefully-common.toml`

## 配置选项详解

### 搜索系统配置

#### `enableSearchSystem` (布尔值, 默认: true)
- 作用：启用或禁用整个搜索系统
- true：开启搜索功能
- false：关闭搜索功能

#### `maxSearchTimeTicks` (整数, 范围: 1-1000, 默认: 200)
- 作用：设置最大搜索时间（以游戏刻为单位）
- 注意：20 游戏刻 = 1 秒
- 建议值：根据服务器需求调整

#### `searchSpeedMultiplier` (浮点数, 范围: 0.1-10.0, 默认: 1.0)
- 作用：搜索速度倍数
- 1.0：正常速度
- 大于 1.0：加快搜索速度
- 小于 1.0：减慢搜索速度

### 稀有度搜索时间配置

#### `raritySearchTimes`（字符串列表，支持任意稀有度等级）
- 作用：为每个稀有度等级配置搜索时间和完成音效，不限于 1~7
- 格式：每条为 `"稀有度:基础时间:随机范围[:音效ID]"`（半角冒号分隔）
  - **稀有度**：整数，≥ 1（如 1、5、8、12 等任意数字）
  - **基础时间**：基础搜索时间（游戏刻），整数 ≥ 1
  - **随机范围**：随机浮动范围（游戏刻），整数 ≥ 0。实际搜索时间 = 基础时间 ± 随机(0, 随机范围)
  - **音效ID**：（可选）搜索完成时播放的音效，格式 `命名空间:路径`。可使用原版音效、本模组音效、或任何已注册音效。省略时自动映射到内置完成音效（1~7）
- 查询规则：
  - 精确匹配：稀有度在列表中有对应条目 → 使用该条目
  - 向下取最近：稀有度未配置 → 使用不大于该稀有度的最大已配置条目（如只配了稀有度 1、4、7，查询稀有度 5 时用稀有度 4 的配置）
  - 无匹配：查询的稀有度比所有已配置条目都小 → 返回 0（不搜索）
- 默认值：
  ```toml
  raritySearchTimes = [
      "1:10:10:searchcarefully:search_completion_rarity_1",
      "2:30:10:searchcarefully:search_completion_rarity_2",
      "3:55:10:searchcarefully:search_completion_rarity_3",
      "4:85:10:searchcarefully:search_completion_rarity_4",
      "5:110:10:searchcarefully:search_completion_rarity_5",
      "6:130:10:searchcarefully:search_completion_rarity_6",
      "7:140:10:searchcarefully:search_completion_rarity_7"
  ]
  ```
  各等级对应时间约：稀有度1 ≈ 0.5秒、稀有度2 ≈ 1.5秒、稀有度3 ≈ 2.8秒、稀有度4 ≈ 4.3秒、稀有度5 ≈ 5.5秒、稀有度6 ≈ 6.5秒、稀有度7 ≈ 7秒（不含随机浮动）
- 自定义示例：
  ```toml
  raritySearchTimes = [
      "1:20:5:searchcarefully:search_completion_rarity_1",   # 调快稀有度1
      # ... 其他稀有度保持默认 ...
      "7:140:10:searchcarefully:search_completion_rarity_7",
      "8:200:20:minecraft:entity.player.levelup",             # 稀有度8，用原版升级音效
      "10:400:50"                                              # 稀有度10，省略音效自动钳制
  ]
  ```

### 自定义战利品表路径配置

#### `customLootTablePaths`
- 作用：添加额外的战利品表路径，为其应用搜索时间机制
- 格式：完整资源位置标识符列表
- 示例：
  ```toml
  customLootTablePaths = [
      "modid:special_chest",
      "anothermod:treasure_box",
      "custommod:magic_container"
  ]
  ```
- 说明：
  - 这些路径必须是完整的资源位置（namespace:path格式）
  - 适用于那些路径非常猎奇的模组战利品表
  - 可以添加任意数量的自定义路径

#### `chestPathSegments`
- 作用：定义用于中间路径匹配的路径片段，为匹配的路径下的战利品表应用搜索时间机制
- 格式：路径片段字符串列表
- 默认值：`["chest", "chests"]`
- 示例：
  ```toml
  chestPathSegments = ["chest", "chests", "treasure", "loot"]
  ```
- 说明：
  - 用于匹配路径中间包含这些片段的战利品表
  - 如果你按照示例值写，会匹配：`structures/village/chest`、`modid/special/chests`、`dungeons/treasure_room`

### 热键栏搜索配置

#### `enableHotbarSearch` (布尔值，默认：false)
- 作用：启用或禁用热键栏物品的搜索功能
- true：开启热键栏搜索，玩家物品栏中的物品也会自动进行搜索
- false：关闭热键栏搜索，仅在容器界面中才能进行搜索
- 注意：此功能独立于容器搜索，关闭时不影响容器内的正常搜索机制

### 单槽位搜索配置

#### `enableSingleSlotSearch` (布尔值，默认：false)
- 作用：启用单槽位搜索模式，物品将逐个依次搜索
- true：开启单槽位搜索模式，物品会从第一个槽位开始逐个搜索
- false：关闭单槽位搜索模式

#### `singleSlotSearchTimeMultiplier` (布尔值，默认：true)
- 作用：单槽位搜索模式下是否应用3倍时间倍数
- true：应用3倍时间倍数
- false：不应用额外时间倍数

### 鼠标目标搜索配置

#### `enableMouseTargetSearch` (布尔值，默认：true)
- 作用：启用鼠标目标搜索模式
- true：鼠标光标将锁定特定物品进行搜索，如果鼠标未指向任何物品则继续自动搜索
- false：关闭鼠标目标搜索，仅使用自动搜索

#### `mouseTargetSwitchDelay` (浮点数, 范围: 0.0-20.0, 默认: 3.0)
- 作用：切换到鼠标目标的延迟（游戏刻）
- 较高数值可以防止鼠标快速移动时频繁切换目标
- 默认值对应 0.15 秒

### 搜索进度音效配置

#### `enableSearchProgressSound` (布尔值，默认：true)
- 作用：启用搜索过程中的进度音效
- true：开启搜索进度循环音效，在有待搜物品时持续循环播放，搜索完成时自动停止
- false：关闭搜索进度音效