# API 使用说明

StylizedDamage 提供 Java API，其他模组可通过硬依赖或软依赖方式编程注册样式和绑定选择器。

## 入口点

`StylizedDamageAPI` 是唯一的 API 入口，完整类名为 `com.stylizeddamage.common.api.StylizedDamageAPI`。通过静态方法获取实例：

```java
import com.stylizeddamage.common.api.StylizedDamageAPI;

StylizedDamageAPI api = StylizedDamageAPI.getInstance();
```

> 注意：`com.stylizeddamage.api.StylizedDamageAPI` 是早期的占位类，当前未实现，请勿使用。

## 注册时机

所有 API 调用应在模组初始化阶段完成。当前版本的 Forge 1.20.1 与 NeoForge 1.21.1 均**尚未实际发布 `StylizedDamageRegisterEvent`**（代码中仅预留了该事件类，平台集成待完善）。因此现阶段第三方模组应直接通过 `StylizedDamageAPI.getInstance()` 获取实例并注册：

```java
StylizedDamageAPI api = StylizedDamageAPI.getInstance();
api.createStyle("my_style").register();
```

> 未来版本计划提供事件总线集成，届时可通过监听 `StylizedDamageRegisterEvent` 注册样式和选择器。

## 样式注册

### 使用 StyleBuilder 链式构建

```java
api.createStyle("my_style")
    .color("#FF4444")
    .fontSize(1.2f)
    .fontStyle("bold")
    .shadow(true)
    .outlineColor("#000000")
    .prefix("!")
    .suffix("❤")
    .icon("mymod:textures/gui/my_icon.png")
    .sound("minecraft:entity.player.hurt")
    .damageScale(false)
    .animation(animationConfig)
    .register();
```

### StyleBuilder 方法参考

| 方法 | 参数 | 说明 |
|------|------|------|
| `.color(String)` | 颜色字符串 | 支持 `#RRGGBB`、`#AARRGGBB`、`rainbow:speed:N` |
| `.fontSize(float)` | 倍率 | 字体大小，默认 1.0 |
| `.fontStyle(String)` | 枚举值 | `normal`/`bold`/`italic`/`bold_italic` |
| `.shadow(boolean)` | 开关 | 文字阴影 |
| `.outlineColor(String)` | 颜色 | 描边颜色，null 为无描边 |
| `.backgroundColor(String)` | 颜色 | 背景色块，null 为无背景 |
| `.prefix(String)` | 字符串 | 文字前缀 |
| `.suffix(String)` | 字符串 | 文字后缀 |
| `.icon(String)` | 路径 | 图标纹理路径 |
| `.iconPosition(String)` | 字符串 | 图标位置：`"left"` 或 `"right"` |
| `.iconOffsetX(double)` | 像素 | 跳字图标水平偏移（正=右移，负=左移） |
| `.iconOffsetY(double)` | 像素 | 跳字图标垂直偏移（正=下移，负=上移） |
| `.hudIconOffsetX(double)` | 像素 | 总伤害 HUD 图标水平偏移，独立于 `iconOffsetX` |
| `.hudIconOffsetY(double)` | 像素 | 总伤害 HUD 图标垂直偏移，独立于 `iconOffsetY` |
| `.sound(String)` | 音效ID | 跳字出现音效 |
| `.animation(AnimationConfig)` | 动画对象 | 动画配置 |
| `.damageScale(boolean)` | 开关 | 是否启用伤害大小缩放 |
| `.register()` | — | 完成注册 |

## 动画构建

使用 AnimationBuilder 链式构建：

```java
AnimationConfig anim = api.createAnimation()
    .hold(6)
    .position()
        .enter("normal", 8, AnimationBuilder.easeInOut())
        .startOffset(AnimationBuilder.direction(90, 12))
        .targetOffset(AnimationBuilder.xy(0, 0))
        .exitNone()
    .size()
        .enter("normal", 6, AnimationBuilder.easeInOut(), 0.3, 0)
        .exit("normal", 10, AnimationBuilder.easeInOut(), -0.5)
    .opacity()
        .enter("normal", 4, AnimationBuilder.easeInOut(), 0, 1)
        .exit("normal", 12, AnimationBuilder.easeInOut(), 0)
    .done();
```

### 辅助方法

| 方法 | 说明 |
|------|------|
| `easeInOut()` | 创建缓入缓出 easing |
| `easeIn()` | 创建缓入 easing |
| `easeOut()` | 创建缓出 easing |
| `linear()` | 创建线性 easing |
| `direction(angle, distance)` | 方向偏移 |
| `xy(x, y)` | XY 绝对值偏移 |

> 这些辅助方法都是 `AnimationBuilder` 的静态方法，调用时需写 `AnimationBuilder.xxx()`，或先 `import static com.stylizeddamage.common.api.AnimationBuilder.*;` 后才能直接使用。

## 选择器绑定

```java
// 注册选择器到 common 区间的 common 分支
api.selectors()
    .in("common")
    .branch("common")
    .match("*").style("my_style")
    .match("minecraft:in_fire").style("fire")
    .match("critical").style("critical_style")
    .register();

// 添加区间分流和目标类型分支
api.selectors()
    .in("[50,...]")
    .branch("player", "yourTeam")
    .match("*").style("high_damage")
    .register();
```

### SelectorBuilder 方法

| 方法 | 说明 |
|------|------|
| `.in(String interval)` | 指定伤害数值区间 |
| `.branch(String... segments)` | 指定目标分支路径 |
| `.match(String... conditions)` | 添加匹配条件 |
| `.style(String name)` | 指定匹配后使用的样式 |
| `.register()` | 完成注册 |

## 优先级规则

| 来源 | 优先级 |
|------|--------|
| **API 注册的选择器** | 最高 — 插入到配置选择器之前 |
| **配置文件的选择器** | 正常 |
| **API 注册的样式** | 与配置样式同级，**同名时 API 覆盖配置** |

## 依赖方式

### 硬依赖

在 `mods.toml` 或 `neoforge.mods.toml` 中声明 StylizedDamage 为必选依赖：

```toml
[[dependencies.yourmod]]
    modId="stylizeddamage"
    mandatory=true
    versionRange="[1.0.0,)"
    ordering="NONE"
    side="BOTH"
```

直接调用 API 即可。

### 软依赖

使用 `@Optional` 注解或服务加载器机制，检查 `StylizedDamageAPI` 类是否存在后再调用：

```java
try {
    Class.forName("com.stylizeddamage.common.api.StylizedDamageAPI");
    // API 存在，可以调用
    StylizedDamageAPI api = StylizedDamageAPI.getInstance();
    // ...
} catch (ClassNotFoundException e) {
    // StylizedDamage 未安装，跳过
}
```
