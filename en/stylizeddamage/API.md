# API Reference

StylizedDamage provides a Java API for other mods to register styles and selectors.

## Entry Point

The full class name is `com.stylizeddamage.common.api.StylizedDamageAPI`.

```java
import com.stylizeddamage.common.api.StylizedDamageAPI;

StylizedDamageAPI api = StylizedDamageAPI.getInstance();
```

## Style Registration

```java
api.createStyle("my_style")
    .color("#FF4444")
    .fontSize(1.2f)
    .fontStyle("bold")
    .shadow(true)
    .outlineColor("#000000")
    .prefix("!")
    .suffix("❤")
    .animation(animConfig)
    .register();
```

## Animation Builder

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

> The helper methods `easeInOut()`, `easeIn()`, `easeOut()`, `linear()`, `direction()`, and `xy()` are static methods on `AnimationBuilder`. Use `AnimationBuilder.xxx()` or add `import static com.stylizeddamage.common.api.AnimationBuilder.*;` before using them directly.

## Selector Binding

```java
api.selectors()
    .in("common")
    .branch("common")
    .match("*").style("my_style")
    .match("minecraft:in_fire").style("fire")
    .register();
```

## Priority Rules

| Source | Priority |
|--------|----------|
| API selectors | Highest (inserted before config) |
| Config selectors | Normal |
| API styles | Same as config, API overrides on name conflict |

## Register Event

The `StylizedDamageRegisterEvent` class exists for future event-bus integration, but current Forge 1.20.1 and NeoForge 1.21.1 builds do **not** post it yet. Third-party mods should call `StylizedDamageAPI.getInstance()` directly during initialization instead.

## Dependency

**Hard dependency** in `mods.toml`:
```toml
[[dependencies.yourmod]]
    modId="stylizeddamage"
    mandatory=true
```

**Soft dependency**: Check for class existence before calling API.
