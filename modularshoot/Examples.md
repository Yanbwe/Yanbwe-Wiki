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
import org.yanbwe.modularshoot.registry.gun.ShootTextureMode;
import net.minecraft.resources.ResourceLocation;
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
        Optional.of(new BulletStyle(                        // bulletStyle
            Map.of(
                "billboard", ResourceLocation.parse("examplemod:textures/bullet/rifle_bullet.png")
            ),
            RenderMode.BILLBOARD
        ))
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

// 按 UUID 拆卸指定插件
UninstallResult result = ModularShootAPI.uninstallPlugin(
    gunStack,
    instanceUuid,
    player,
    false,    // force: false = 不强制拆锁定插件
    true,     // returnItems: true = 返还插件物品
    level.registryAccess()
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
    true,
    level.registryAccess()
);

// 拆卸全部插件
List<UninstallResult> allResults = ModularShootAPI.uninstallAllPlugins(
    gunStack,
    player,
    false,    // force: false = 跳过锁定插件
    true,
    level.registryAccess()
);

// 随机拆卸一个
UninstallResult randomResult = ModularShootAPI.uninstallRandomPlugin(
    gunStack,
    player,
    false,
    true,
    level.registryAccess()
);
```

### 锁定/解锁插件

```java
// 锁定插件（不可拆卸，除非 force=true）
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, true);

// 查询锁定状态
boolean locked = ModularShootAPI.isPluginLocked(gunStack, instanceUuid);

// 解锁
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, false);
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
import org.yanbwe.modularshoot.event.*;

@EventBusSubscriber(modid = "examplemod")
public class EventListeners {

    // 射击前：取消射击（如安全区禁枪）
    @SubscribeEvent
    public static void onPreShoot(PreShootEvent event) {
        if (isInSafeZone(event.getEntity())) {
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

    // 换弹键（R）：实现换弹
    @SubscribeEvent
    public static void onReload(ReloadEvent event) {
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
import org.yanbwe.modularshoot.bullet.BulletManager;
import org.yanbwe.modularshoot.bullet.BulletSnapshot;
import org.yanbwe.modularshoot.bullet.BulletRecord;
import net.minecraft.world.phys.Vec3;

// 构造子弹快照
BulletSnapshot snapshot = new BulletSnapshot();
snapshot.setStat(ModularShootAttributes.HIT_DAMAGE, 10.0);
snapshot.setStat(ModularShootAttributes.BULLET_SPEED, 30.0);
snapshot.setStat(ModularShootAttributes.RANGE, 80.0);
snapshot.setStat(ModularShootAttributes.BULLET_SIZE, 0.3);
snapshot.setStat(ModularShootAttributes.BLOCK_PENETRATION, 3);
snapshot.setDamageType(level.registryAccess().holderOrThrow(ModularShootDamageTypes.BULLET));

// 从炮塔位置发射
BulletManager manager = BulletManager.get(level);
BulletRecord bullet = manager.fireBullet(
    level,
    turretPosition,     // Vec3 发射位置
    turretDirection,    // Vec3 飞行方向
    snapshot,
    null                // UUID 发射者（null = 无主发射源）
);
```

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
