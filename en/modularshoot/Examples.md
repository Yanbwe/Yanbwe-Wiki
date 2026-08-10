# Examples

All code examples in one place.

## Java API Examples

### Check Item Types

```java
import org.yanbwe.modularshoot.ModularShootAPI;

// Check if it's a gun
if (ModularShootAPI.isGun(stack)) {
    System.out.println("This is a gun");
}

// Check if it's a plugin
if (ModularShootAPI.isPlugin(stack)) {
    System.out.println("This is a plugin");
}
```

### Query Data

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;
import java.util.UUID;

// Get gun ID
ResourceLocation gunId = ModularShootAPI.getGunId(gunStack);
if (gunId != null) {
    System.out.println("Gun ID: " + gunId);
}

// Get full gun data
ModularShootAPI.getGunData(gunStack).ifPresent(data -> {
    UUID instanceUuid = data.gunInstanceUuid();
    int version = data.modifierVersion();
    System.out.println("Instance UUID: " + instanceUuid + ", Version: " + version);
});

// Get plugin ID
ModularShootAPI.getPluginId(pluginStack).ifPresent(id -> {
    System.out.println("Plugin ID: " + id);
});

// Get installed plugin list
List<PluginInstance> installed = ModularShootAPI.getInstalledPlugins(gunStack);
for (PluginInstance pi : installed) {
    System.out.println("  Plugin: " + pi.pluginId() + "  Type: " + pi.installedTypeId());
}
```

### Register a Gun

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

// Register a gun
ModularShootAPI.registerGun(
    ResourceLocation.parse("examplemod:assault_rifle"),
    new GunDefinition(
        Optional.of("§aAssault Rifle"),                          // name
        ResourceLocation.parse("examplemod:textures/gun/ar.png"),  // texture
        Optional.of(ResourceLocation.parse("examplemod:textures/gun/ar_shoot.png")), // shootTexture
        ShootTextureMode.WHILE_FIRING,                     // shootTextureMode
        TextureScaleMode.AUTO,                             // textureScale (geometry scales with texture resolution)
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
            Optional.of(new BulletStyle.Base(
                RenderMode.BILLBOARD,
                Optional.of(ResourceLocation.parse("examplemod:textures/bullet/rifle_bullet.png")),
                Optional.empty()
            )),
            List.of(new ScaleModifier(1.0f))
        )),
        Map.of(),                                           // variants (variant id → base weight)
        Map.of(),                                           // extraValues (namespaced numeric extension fields)
        Optional.empty()                                    // soundRange (empty = use the sound event's own range)
    )
);
```

### Register a Plugin Validator

```java
ModularShootAPI.registerPluginValidator((gun, pluginId) -> {
    if (pluginId.getPath().contains("rocket")
            && ModularShootAPI.getGunId(gun).getPath().contains("pistol")) {
        return ValidationResult.error("Pistols cannot equip rocket ammo");
    }
    return ValidationResult.success();
});
```

### Register a Shoot Predicate

```java
import org.yanbwe.modularshoot.shooting.ShootPredicateResult;

ModularShootAPI.registerShootPredicate((player, gun) -> {
    // Check ammo (handled by your own ammo system)
    if (!hasAmmo(player)) {
        return ShootPredicateResult.failure("Out of ammo");
    }
    return ShootPredicateResult.success();
});
```

### Register a Shoot Effect (registerShootEffect)

Effects run inside the pellet loop, right after each pellet's snapshot `copy()` and right before spread application, in registration order; a later effect sees all mutations made by earlier ones (`pelletIndex` may serve as a per-pellet differentiation seed). **Usage red lines**: recommended mutations are `setTrait` (boolean traits stack naturally) / `multiplyStat` (multiplicative scaling composes) / `setStat` (deliberate, deterministic overwrite); **forbidden** are `setDamageType` and visual `base` overrides — exclusive single-value fields, whose exclusive scenarios must go through the variant pool (technically not blocked, but the result is field-level fragmentation).

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;

// 10% chance to trigger "critical hit": enable a trait (its visual_modifiers
// tint the bullet red) and double the damage
ModularShootAPI.registerShootEffect((player, gun, snapshot, pelletIndex, totalPellets) -> {
    if (player.getRandom().nextFloat() < 0.10f) {
        // Inside the red lines: setTrait (boolean, co-exists) / multiplyStat
        // (multiplicative) / setStat (deterministic overwrite)
        snapshot.setTrait(ResourceLocation.parse("examplemod:critical_hit"), true);
        snapshot.multiplyStat(ResourceLocation.parse("modularshoot:hit_damage"), 2.0);
        // Outside the red lines: do NOT setDamageType or override the visual
        // base here — they are exclusive single-value fields; exclusive
        // scenarios must go through the variant pool (modularshoot:variants)
    }
});
```

### Register a Variant Contributor (registerVariantContributor)

Declares "variant id → weight modifier" pairs, collected fresh every shot when the per-shot pool is assembled (never persisted). Modifiers reuse the vanilla `AttributeModifier` record and its `Operation` three-stage semantics.

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.ai.attributes.AttributeModifier;

// Give the "fireball" variant a 2x weight modifier
ModularShootAPI.registerVariantContributor(sink -> {
    // ADD_MULTIPLIED_BASE: multiplies only the base weight. If the gun
    // declares fireball base weight 1.0, the final weight = 1.0 × (1 + 1.0)
    // = 2.0; with a zero base and no ADD_VALUE modifier the result stays 0
    // — "a fire trinket is useless on a non-fire gun"
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

### Register a Trait Hook (ON_HIT Example)

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.trait.TraitHookType;
import net.minecraft.resources.ResourceLocation;
import net.minecraft.world.entity.LivingEntity;

// Register onHit hook: ignite target for 3 seconds
ModularShootAPI.registerTraitHook(
    ResourceLocation.parse("examplemod:ignite"),
    TraitHookType.ON_HIT,
    (bullet, snapshot, entity) -> {
        if (snapshot.getTrait(ResourceLocation.parse("examplemod:ignite"))) {
            if (entity instanceof LivingEntity living) {
                living.setRemainingFireTicks(60); // 3 seconds = 60 ticks
            }
        }
    }
);
```

### Register a Damage Handler

```java
import org.yanbwe.modularshoot.ModularShootAPI;

ModularShootAPI.registerDamageHandler((bullet, target, damage) -> {
    // PvP: reduce damage by 50% when above 20
    if (target instanceof Player && damage > 20) {
        return damage * 0.5;
    }
    return damage;
});
```

### Uninstall Plugins

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.plugin.UninstallResult;
import java.util.List;

// Uninstall by UUID
// Preferred 5-arg overloads: RegistryAccess is derived internally from player.level().registryAccess().
// The old 6-arg overloads with an explicit RegistryAccess parameter are @Deprecated.
UninstallResult result = ModularShootAPI.uninstallPlugin(
    gunStack,
    instanceUuid,
    player,
    false,    // force: false = don't force-uninstall locked plugins
    true      // returnItems: true = return plugin item
);

if (result.success()) {
    System.out.println("Uninstalled: " + result.pluginId());
}

// Uninstall all plugins of a specific type
List<UninstallResult> results = ModularShootAPI.uninstallPluginsByType(
    gunStack,
    player,
    ResourceLocation.parse("examplemod:barrel"),
    true,     // force: true = uninstall even locked plugins
    true
);

// Uninstall all plugins
List<UninstallResult> allResults = ModularShootAPI.uninstallAllPlugins(
    gunStack,
    player,
    false,    // force: false = skip locked plugins
    true
);

// Uninstall a random plugin
UninstallResult randomResult = ModularShootAPI.uninstallRandomPlugin(
    gunStack,
    player,
    false,
    true
);
```

### Lock / Unlock Plugins

```java
// Lock plugin (can't be uninstalled unless force=true)
// The 4-arg overload refreshes the ATTRIBUTE_MODIFIERS component;
// the old 3-arg overload is @Deprecated and does not refresh it.
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, true, level.registryAccess());

// Query lock status
boolean locked = ModularShootAPI.isPluginLocked(gunStack, instanceUuid);

// Unlock
ModularShootAPI.setPluginLocked(gunStack, instanceUuid, false, level.registryAccess());
```

### Access State

```java
import org.yanbwe.modularshoot.ModularShootAPI;
import org.yanbwe.modularshoot.state.GunState;
import org.yanbwe.modularshoot.state.PlayerState;

// per-gun state: read/write kill count on the gun
GunState gunState = ModularShootAPI.getState(gunStack, player);
int kills = gunState.getInt(ResourceLocation.parse("examplemod:kill_count"));
gunState.setInt(ResourceLocation.parse("examplemod:kill_count"), kills + 1);

// per-player state: read/write headshot streak on the player
PlayerState playerState = ModularShootAPI.getPlayerState(player);
int headshots = playerState.getInt(ResourceLocation.parse("examplemod:headshot_streak"));
playerState.setInt(ResourceLocation.parse("examplemod:headshot_streak"), headshots + 1);

// String state (e.g. damage type preset)
gunState.setString(
    ResourceLocation.parse("modularshoot:ammo_damage_type"),
    "minecraft:in_fire"
);

// Check if state exists
if (gunState.hasState(ResourceLocation.parse("examplemod:heat"))) {
    double heat = gunState.getDouble(ResourceLocation.parse("examplemod:heat"));
}

// Clear state (restore default)
gunState.clearState(ResourceLocation.parse("examplemod:kill_count"));
```

### Listen to Events

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

    // Pre-shoot: cancel shooting (e.g. safe zone no-fire)
    @SubscribeEvent
    public static void onPreShoot(PreShootEvent event) {
        if (isInSafeZone(event.getPlayer())) {
            event.setCanceled(true);
        }
    }

    // Post-shoot: log ballistic data
    @SubscribeEvent
    public static void onPostShoot(PostShootEvent event) {
        System.out.println("Bullet fired: " + event.getBulletRecord().getBulletId());
    }

    // Right-click gun: custom behavior (e.g. ADS)
    @SubscribeEvent
    public static void onGunRightClick(GunRightClickEvent event) {
        // Implement aiming/scope logic
        event.setCanceled(true); // Stop propagation if handled
    }

    // Action key (R): implement reload or other custom actions
    @SubscribeEvent
    public static void onAction(ActionEvent event) {
        if (hasSpareAmmo(event.getEntity(), event.getGun())) {
            doReload(event.getEntity(), event.getGun());
        }
    }

    // Pre-plugin install: add extra condition
    @SubscribeEvent
    public static void onPrePluginInstall(PrePluginInstallEvent event) {
        if (playerLevelTooLow(event.getPlayer())) {
            event.setCanceled(true);
        }
    }

    // Post-plugin install: log
    @SubscribeEvent
    public static void onPostPluginInstall(PostPluginInstallEvent event) {
        System.out.println("Plugin installed: " + event.getPluginId());
    }

    // Pre-plugin uninstall
    @SubscribeEvent
    public static void onPrePluginUninstall(PrePluginUninstallEvent event) {
        if (isQuestItem(event.getGun())) {
            event.setCanceled(true); // Quest items can't be uninstalled
        }
    }

    // Post-plugin uninstall
    @SubscribeEvent
    public static void onPostPluginUninstall(PostPluginUninstallEvent event) {
        System.out.println("Plugin uninstalled: " + event.getPluginId());
    }
}
```

### Independent Bullet Firing (Turrets, etc.)

```java
import org.yanbwe.modularshoot.attribute.ModularShootAttributes;
import org.yanbwe.modularshoot.bullet.BulletManager;
import org.yanbwe.modularshoot.bullet.BulletSnapshot;
import org.yanbwe.modularshoot.bullet.BulletRecord;
import org.yanbwe.modularshoot.damage.ModularShootDamageTypes;
import net.minecraft.world.phys.Vec3;
import java.util.HashMap;

// Build bullet snapshot: the only constructor takes 7 args (stats/traits/
// state are defensively copied). For independent firing, gunId and
// gunInstanceUuid are always null; the shooter uuid is passed via
// fireBullet's last argument (null = ownerless source).
// setStat takes a ResourceLocation; ModularShootAttributes constants are
// DeferredHolder<Attribute, Attribute>, so pass .getKey()
BulletSnapshot snapshot = new BulletSnapshot(
    new HashMap<>(),   // stats (filled below via setStat)
    new HashMap<>(),   // traits
    level.registryAccess().holderOrThrow(ModularShootDamageTypes.BULLET),  // damageType
    null,              // shooter
    null,              // gunId
    null,              // gunInstanceUuid
    new HashMap<>()    // state
);
snapshot.setStat(ModularShootAttributes.HIT_DAMAGE.getKey(), 10.0);
snapshot.setStat(ModularShootAttributes.BULLET_SPEED.getKey(), 30.0);
snapshot.setStat(ModularShootAttributes.RANGE.getKey(), 80.0);
snapshot.setStat(ModularShootAttributes.BULLET_SIZE.getKey(), 0.3);
snapshot.setStat(ModularShootAttributes.BLOCK_PENETRATION.getKey(), 3);

// Fire from turret position
BulletManager manager = BulletManager.get(level);
BulletRecord bullet = manager.fireBullet(
    level,
    turretPosition,     // Vec3 firing position
    turretDirection,    // Vec3 flight direction
    snapshot,
    null                // UUID shooter (null = ownerless source)
);
```

### Mark Java API Registered

```java
import org.yanbwe.modularshoot.registry.ModularShootRegistries;

// Mark an entry in a registry as Java API registered, preventing datapack JSON conflicts
ModularShootAPI.markJavaApiRegistered(
    ModularShootRegistries.GUNS_KEY,
    ResourceLocation.parse("examplemod:my_gun")
);

ModularShootAPI.markJavaApiRegistered(
    ModularShootRegistries.PLUGINS_KEY,
    ResourceLocation.parse("examplemod:my_plugin")
);
```
