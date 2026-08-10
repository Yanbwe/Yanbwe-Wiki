# 示例集

本文档集中所有代码示例。

## Java API 示例

### 判断物品类型

```java
import org.yanbwe.modularshoot.ModularShootAPI;

// 判断是否枪械
if (ModularShootAPI.isGun(stack)) {
    System.out.println("这是一把枪");
}

// 判断是否插件
if (ModularShootAPI.isPlugin(stack)) {
    System.out.println("这是一个插件");
}
```

### 获取数据

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;
import java.util.UUID;

// 获取枪械 ID
ResourceLocation gunId = ModularShootAPI.getGunId(gunStack);
if (gunId != null) {
    System.out.println("枪械 ID：" + gunId);
}

// 获取完整枪械数据
ModularShootAPI.getGunData(gunStack).ifPresent(data -> {
    UUID instanceUuid = data.gunInstanceUuid();
    int version = data.modifierVersion();
    System.out.println("实例 UUID：" + instanceUuid + "，版本：" + version);
});

// 获取插件 ID
ModularShootAPI.getPluginId(pluginStack).ifPresent(id -> {
    System.out.println("插件 ID：" + id);
});

// 获取已安装插件列表
List<PluginInstance> installed = ModularShootAPI.getInstalledPlugins(gunStack);
for (PluginInstance pi : installed) {
    System.out.println("  插件：" + pi.pluginId() + "  种类：" + pi.installedTypeId());
}
```

### 注册枪械

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.registry.gun.GunDefinition;
import org.yanbwe.modularshoot.registry.gun.BulletStyle;
import org.yanbwe.modularshoot.registry.gun.BulletStyle.RenderMode;
import org.yanbwe.modularshoot.registry.gun.ScaleModifier;
import org.yanbwe.modularshoot.registry.gun.ShootTextureMode;
import org.yanbwe.modularshoot.registry.gun.TextureScaleMode;
import net.minecraft.resources.ResourceLocation;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// 注册一把枪械
ModularShootAPI.registerGun(
    ResourceLocation.parse("examplemod:assault_rifle"),
    new GunDefinition(
        Optional.of("§a突击步枪"),                          // name
        ResourceLocation.parse("examplemod:textures/gun/ar.png"),  // texture
        Optional.of(ResourceLocation.parse("examplemod:textures/gun/ar_shoot.png")), // shootTexture
        ShootTextureMode.WHILE_FIRING,                     // shootTextureMode
        TextureScaleMode.AUTO,                             // textureScale（几何随纹理分辨率自适应缩放）
        Map.of(                                             // stats
            ResourceLocation.parse("modularshoot:hit_damage"), 8.0,
            ResourceLocation.parse("modularshoot:fire_rate"), 10.0,
            ResourceLocation.parse("modularshoot:range"), 60.0
        ),
        Map.of(),                                           // traits
        Map.of(                                             // slots
            ResourceLocation.parse("examplemod:barrel"), 1,
            ResourceLocation.parse("examplemod:magazine"), 1
        ),
        Map.of("shoot", ResourceLocation.parse("examplemod:gun.ar.shoot")),  // sounds
        Optional.of(new BulletStyle(                        // bulletStyle（v2：base + modifiers 叠加结构）
            Optional.of(new BulletStyle.Base(               // base：渲染模式 + 纹理/模型二选一
                RenderMode.BILLBOARD,
                Optional.of(ResourceLocation.parse("modularshoot:textures/bullet/default.png")),
                Optional.empty()                             // model：3d 模式才填
            )),
            List.of(new ScaleModifier(1.0f))                // modifiers：scale/tint/attach_layer 叠加修饰符
        )),
        Map.of(),                                           // variants（变体 ID → 基础权重，喂给每射击变体池）
        Map.of(),                                           // extraValues（命名空间数字扩展字段）
        Optional.empty()                                    // soundRange（留空 = 用音效事件自身范围）
    )
);
```

### 注册插件验证器

```java
ModularShootAPI.registerPluginValidator((gun, pluginId) -> {
    if (pluginId.getPath().contains("rocket")
            && ModularShootAPI.getGunId(gun).getPath().contains("pistol")) {
        return ValidationResult.error("手枪不能安装火箭弹");
    }
    return ValidationResult.success();
});
```

### 注册射击条件判断

```java
import org.yanbwe.modularshoot.shooting.ShootPredicateResult;

ModularShootAPI.registerShootPredicate((player, gun) -> {
    // 检查弹药（由上层模组自己的弹药系统决定）
    if (!hasAmmo(player)) {
        return ShootPredicateResult.failure("弹药不足");
    }
    return ShootPredicateResult.success();
});
```

### 注册射击效果（registerShootEffect）

每颗弹丸快照 `copy()` 之后、散布采样之前按注册顺序执行；后注册者可见前序修改（`pelletIndex` 可用作逐颗分化种子）。**使用红线**：推荐 `setTrait`（布尔可共存）/ `multiplyStat`（倍率乘算）/ `setStat`（确定性覆盖）；**禁止** `setDamageType` 与视觉 `base` 覆盖——单值互斥字段的互斥场景必须走变体池（技术上不阻止，但会产生字段级碎片化）。

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;

// 10% 概率触发"致命一击"：点亮特性（特性自带的 visual_modifiers 让子弹变红）并翻倍伤害
ModularShootAPI.registerShootEffect((player, gun, snapshot, pelletIndex, totalPellets) -> {
    if (player.getRandom().nextFloat() < 0.10f) {
        // 红线内：setTrait（布尔可共存）/ multiplyStat（倍率乘算）/ setStat（确定性覆盖）
        snapshot.setTrait(ResourceLocation.parse("examplemod:critical_hit"), true);
        snapshot.multiplyStat(ResourceLocation.parse("modularshoot:hit_damage"), 2.0);
        // 红线外：不要在这里 setDamageType 或覆盖视觉 base——
        // 它们是一次选举单值互斥字段，互斥场景必须走变体池（modularshoot:variants）
    }
});
```

### 注册变体贡献者（registerVariantContributor）

声明"变体 ID → 权重修饰符"，每发射击组装变体池时实时收集（不持久化）。修饰符复用原版 `AttributeModifier` record + Operation 三阶段语义。

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.ai.attributes.AttributeModifier;

// 给"火弹"变体追加 2 倍权重修饰符
ModularShootAPI.registerVariantContributor(sink -> {
    // ADD_MULTIPLIED_BASE：只乘基础权重。若枪械声明了 fireball 基础权重 1.0，
    // 最终权重 = 1.0 × (1 + 1.0) = 2.0；若基础权重为 0 且无 ADD_VALUE 加算，
    // 结果恒为 0 —— "火元素饰品对非火枪无效"
    sink.add(
        ResourceLocation.parse("examplemod:fireball"),
        new AttributeModifier(
            ResourceLocation.parse("examplemod:fireball_weight_x2"),
            1.0,
            AttributeModifier.Operation.ADD_MULTIPLIED_BASE
        )
    );
});
```

### 注册特性钩子（ON_HIT 示例）

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.trait.TraitHookType;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.LivingEntity;

// 注册 onHit 钩子：命中时点燃目标 3 秒
ModularShootAPI.registerTraitHook(
    ResourceLocation.parse("examplemod:ignite"),
    TraitHookType.ON_HIT,
    (bullet, snapshot, entity) -> {
        if (snapshot.getTrait(ResourceLocation.parse("examplemod:ignite"))) {
            if (entity instanceof LivingEntity living) {
                living.setRemainingFireTicks(60); // 3 秒 = 60 tick
            }
        }
    }
);
```

### 注册伤害处理器

```java
import org.yanbwe.modularshoot.ModularShootAPI;

ModularShootAPI.registerDamageHandler((bullet, target, damage) -> {
    // PvP 场景下减伤 50%
    if (target instanceof Player && damage > 20) {
        return damage * 0.5;
    }
    return damage;
});
```

### 拆卸插件

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.plugin.UninstallResult;
import java.util.List;

// 按 UUID 拆卸指定插件（五参首选重载；带 RegistryAccess 的六参旧重载已 @Deprecated 废弃，
// RegistryAccess 由框架内部从 player.level().registryAccess() 获取）
UninstallResult result = ModularShootAPI.uninstallPlugin(
    gunStack,
    instanceUuid,
    player,
    false,    // force: false = 不强制拆锁定插件
    true      // returnItems: true = 返还插件物品
);

if (result.success()) {
    System.out.println("已拆卸：" + result.pluginId());
}

// 按种类拆卸所有插件
List<UninstallResult> results = ModularShootAPI.uninstallPluginsByType(
    gunStack,
    player,
    ResourceLocation.parse("examplemod:barrel"),
    true,     // force: true = 强制拆卸包括锁定插件
    true
);

// 拆卸全部插件
List<UninstallResult> allResults = ModularShootAPI.uninstallAllPlugins(
    gunStack,
    player,
    false,    // force: false = 跳过锁定插件
    true
);

// 随机拆卸一个
UninstallResult randomResult = ModularShootAPI.uninstallRandomPlugin(
    gunStack,
    player,
    false,
    true
);
```

### 锁定/解锁插件

```java
// 锁定插件（不可拆卸，除非 force=true）
// 四参版本会刷新 ATTRIBUTE_MODIFIERS 组件；三参旧重载已 @Deprecated 废弃且不刷新修饰符
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, true, player.level().registryAccess());

// 查询锁定状态
boolean locked = ModularShootAPI.isPluginLocked(gunStack, instanceUuid);

// 解锁
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, false, player.level().registryAccess());
```

### 访问状态

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.state.GunState;
import org.yanbwe.modularshoot.state.PlayerState;

// per-gun 状态：读写枪械上的击杀计数
GunState gunState = ModularShootAPI.getState(gunStack, player);
int kills = gunState.getInt(ResourceLocation.parse("examplemod:kill_count"));
gunState.setInt(ResourceLocation.parse("examplemod:kill_count"), kills + 1);

// per-player 状态：读写玩家上的连续爆头计数
PlayerState playerState = ModularShootAPI.getPlayerState(player);
int headshots = playerState.getInt(ResourceLocation.parse("examplemod:headshot_streak"));
playerState.setInt(ResourceLocation.parse("examplemod:headshot_streak"), headshots + 1);

// 字符串状态（如伤害类型预设）
gunState.setString(
    ResourceLocation.parse("modularshoot:ammo_damage_type"),
    "minecraft:in_fire"
);

// 判断状态是否存在
if (gunState.hasState(ResourceLocation.parse("examplemod:heat"))) {
    double heat = gunState.getDouble(ResourceLocation.parse("examplemod:heat"));
}

// 清除状态（恢复默认值）
gunState.clearState(ResourceLocation.parse("examplemod:kill_count"));
```

### 监听事件

```java
import net.neoforged.bus.api.SubscribeEvent;
import net.neoforged.fml.common.EventBusSubscriber;
import org.yanbwe.modularshoot.shooting.PreShootEvent;
import org.yanbwe.modularshoot.shooting.PostShootEvent;
import org.yanbwe.modularshoot.shooting.GunRightClickEvent;
import org.yanbwe.modularshoot.api.event.ActionEvent;
import org.yanbwe.modularshoot.plugin.event.PrePluginInstallEvent;
import org.yanbwe.modularshoot.plugin.event.PostPluginInstallEvent;
import org.yanbwe.modularshoot.plugin.event.PrePluginUninstallEvent;
import org.yanbwe.modularshoot.plugin.event.PostPluginUninstallEvent;

@EventBusSubscriber(modid = "examplemod")
public class EventListeners {

    // 射击前：取消射击（如安全区禁枪）
    @SubscribeEvent
    public static void onPreShoot(PreShootEvent event) {
        if (isInSafeZone(event.getPlayer())) {
            event.setCanceled(true);
        }
    }

    // 射击后：记录弹道数据
    @SubscribeEvent
    public static void onPostShoot(PostShootEvent event) {
        System.out.println("子弹已发射：" + event.getBulletRecord().getBulletId());
    }

    // 右键枪械：自定义行为（如开镜）
    @SubscribeEvent
    public static void onGunRightClick(GunRightClickEvent event) {
        // 实现瞄准/开镜逻辑
        event.setCanceled(true); // 如果处理了就不再传递
    }

    // 动作键（R）：实现换弹或其他自定义动作
    @SubscribeEvent
    public static void onAction(ActionEvent event) {
        if (hasSpareAmmo(event.getEntity(), event.getGun())) {
            doReload(event.getEntity(), event.getGun());
        }
    }

    // 插件安装前：追加条件检查
    @SubscribeEvent
    public static void onPrePluginInstall(PrePluginInstallEvent event) {
        if (playerLevelTooLow(event.getPlayer())) {
            event.setCanceled(true);
        }
    }

    // 插件安装后：记录日志
    @SubscribeEvent
    public static void onPostPluginInstall(PostPluginInstallEvent event) {
        System.out.println("插件已安装：" + event.getPluginId());
    }

    // 插件拆卸前
    @SubscribeEvent
    public static void onPrePluginUninstall(PrePluginUninstallEvent event) {
        if (isQuestItem(event.getGun())) {
            event.setCanceled(true); // 任务物品不可拆卸
        }
    }

    // 插件拆卸后
    @SubscribeEvent
    public static void onPostPluginUninstall(PostPluginUninstallEvent event) {
        System.out.println("插件已拆卸：" + event.getPluginId());
    }
}
```

### 独立发射子弹（炮塔等）

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.bullet.BulletRecord;
import org.yanbwe.modularshoot.bullet.BulletSnapshot;
import org.yanbwe.modularshoot.registry.gun.BulletStyle;
import org.yanbwe.modularshoot.registry.gun.BulletStyle.RenderMode;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.phys.Vec3;
import java.util.List;
import java.util.Optional;

// 1. Builder 链式构造快照（推荐入口）
//    独立发射约定：gunId / gunInstanceUuid / shooter 恒为 null；
//    shooter 经 fireBullet 末参传入（null = 无主发射源）
BulletSnapshot snapshot = ModularShootAPI.createBulletSnapshot()
        .stat(ResourceLocation.parse("modularshoot:hit_damage"), 10.0)
        .stat(ResourceLocation.parse("modularshoot:bullet_speed"), 30.0)
        .stat(ResourceLocation.parse("modularshoot:range"), 80.0)
        .stat(ResourceLocation.parse("modularshoot:bullet_size"), 0.3)
        .trait(ResourceLocation.parse("examplemod:ignite"), true)
        .style(new BulletStyle(               // 独立发射视觉（variant style override 通道）
                Optional.of(new BulletStyle.Base(
                        RenderMode.BILLBOARD,
                        Optional.of(ResourceLocation.parse(
                                "modularshoot:textures/bullet/default.png")),
                        Optional.empty()      // model：3d 模式才填
                )),
                List.of()
        ))
        .build(level.registryAccess());       // 自动补框架默认伤害类型；没有 RegistryAccess
                                              // 时用 build()（damageType 留空，fireBullet 时补）

// 2. 门面发射：无射速控制、无射击条件检查、无射击事件、无音效
BulletRecord bullet = ModularShootAPI.fireBullet(
        level,
        turretPosition,     // Vec3 发射位置
        turretDirection,    // Vec3 飞行方向（应已归一化）
        snapshot,
        null                // UUID 发射者（null = 无主发射源；传玩家 UUID 可归属伤害）
);
```

等价的手工构造方式（不推荐，仅当需要直接操作快照对象时）：`BulletSnapshot` 的 7 参构造（`stats`/`traits`/`state` 内部防御拷贝）+ 逐 `setStat` 填充（`setStat` 接收 `ResourceLocation`；`ModularShootAttributes` 常量是 `DeferredHolder`，需 `.getKey()`）；发射可经 `BulletManager.get(level).fireBullet(...)` 直调，等价于门面（门面额外做 null 伤害类型补丁）。两种方式都需自行保证 `gunId`/`gunInstanceUuid` 为 `null`——Builder 则强制约定。

### 弹幕怪物（shooters 注册表 + fireBullet 循环）

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.bullet.BulletSnapshot;
import org.yanbwe.modularshoot.registry.shooter.ShooterDefinition;
import org.yanbwe.modularshoot.registry.shooter.ShooterRegistry;
import net.minecraft.core.RegistryAccess;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.phys.Vec3;
import java.util.ArrayList;
import java.util.List;

// 1. 加载 shooter 配置（modularshoot:shooters 注册表，数据包或 Java API 注册）
RegistryAccess access = mob.level().registryAccess();
ShooterDefinition shooter = ShooterRegistry.getShooter(
        access, ResourceLocation.parse("examplemod:bone_shooter"))
        .orElseThrow(() -> new IllegalStateException("shooter 未注册"));

// 2. 从源实体（mob）实时读取属性生成快照：
//    attribute_binds 命中的属性取 mob 当前值覆盖模板；读不到（未注册/白名单未命中）保留模板值
BulletSnapshot snapshot = shooter.createSnapshot(mob, access);

// 3. 扇形方向集合——弹幕模式算法由内容模组实现，框架只提供
//    SpreadCalculator.applySpread（随机散布）与 fireBullet（发射入口）
Vec3 baseDir = mob.getLookAngle();
int pellets = 5;
double spreadDeg = 40.0; // 总扇形角 40°
List<Vec3> directions = new ArrayList<>();
for (int i = 0; i < pellets; i++) {
    double offsetDeg = -spreadDeg / 2.0 + spreadDeg * i / (pellets - 1);
    directions.add(baseDir.yRot((float) Math.toRadians(offsetDeg)));
}

// 4. 逐方向发射；mob 的 UUID 标记攻击者归属
for (Vec3 dir : directions) {
    ModularShootAPI.fireBullet(
            mob.level(),
            mob.position().add(0.0, mob.getEyeHeight() * 0.8, 0.0), // 发射位置
            dir.normalize(),
            snapshot, // 框架不改写快照（门面仅在 damageType 为 null 时补默认一次），可跨弹复用
            mob.getUUID()
    );
}

// 5. 音效：fireBullet 不播音效，需要时自行播放
shooter.playShootSound(mob.level(), mob.position());
```

> **框架边界**：`modularshoot:shooters` 只提供"数值模板 + 属性绑定 + 视觉 + 音效"的配置载体；发射入口是 `ModularShootAPI.fireBullet`；方向算法框架只提供 `SpreadCalculator.applySpread(Vec3 lookAngle, double accuracyYaw, double accuracyPitch, RandomSource random)`（椭圆随机散布，`accuracy_yaw`/`accuracy_pitch` 单位为度）。扇形/环形/螺旋等**弹幕模式的方向集合算法由内容模组自行实现**（如上例的 `yRot` 循环）。

### 标记 Java API 注册

```java
import org.yanbwe.modularshoot.registry.ModularShootRegistries;

// 标记某注册表中的条目由 Java API 注册，防止数据包 JSON 冲突
ModularShootAPI.markJavaApiRegistered(
    ModularShootRegistries.GUNS_KEY,
    ResourceLocation.parse("examplemod:my_gun")
);

ModularShootAPI.markJavaApiRegistered(
    ModularShootRegistries.PLUGINS_KEY,
    ResourceLocation.parse("examplemod:my_plugin")
);
```
