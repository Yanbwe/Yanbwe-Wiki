# API Reference

StylizedDamage provides a Java API for other mods to register styles and selectors.

## Entry Point

```java
StylizedDamageAPI api = StylizedDamageAPI.getInstance();
```

## Style Registration

```java
api.createStyle("my_style")
    .color("#FF4444")
    .fontSize(1.2)
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
        .enter("normal", 8, easeInOut())
        .startOffset(direction(90, 12))
        .targetOffset(xy(0, 0))
        .exitNone()
    .size()
        .enter("normal", 6, easeInOut(), 0.3, 0)
        .exit("normal", 10, easeInOut(), -0.5)
    .opacity()
        .enter("normal", 4, easeInOut(), 0, 1)
        .exit("normal", 12, easeInOut(), 0)
    .done();
```

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

## Dependency

**Hard dependency** in `mods.toml`:
```toml
[[dependencies.yourmod]]
    modId="stylizeddamage"
    mandatory=true
```

**Soft dependency**: Check for class existence before calling API.
