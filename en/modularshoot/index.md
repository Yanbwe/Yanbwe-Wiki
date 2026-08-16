# ModularShoot

ModularShoot is an attribute-driven, modular assembly gun system **framework mod** for NeoForge 1.21.1.

> **Framework positioning**: This mod is a **pure framework and API** — it provides registration APIs, an attribute calculation pipeline, and a shooting engine, with no production content. The bundled datapack ships framework metadata (attribute metadata table) plus example content (example guns, plugins, variants, etc., for reference and testing); production content is added by other mods via the API or datapacks.

## Key Features

| Feature | Description |
|---------|-------------|
| **Single ID + DataComponent** | All guns share a single item ID (`modularshoot:gun`), differentiated via DataComponent. Same for plugins (`modularshoot:plugin`) |
| **Item Binding** | Bind other mods' items (e.g. swords, trinkets) as guns/plugins via datapack JSON (`gun_items`/`plugin_items`) or the Java API (`registerGunItem`/`registerPluginItem`) — converts within 1 tick of entering the inventory, keeping the original item's model visually |
| **Attribute-Driven** | Gun behavior is entirely determined by attributes + traits. No hardcoded logic. `ADD_VALUE → ADD_MULTIPLIED_BASE → ADD_MULTIPLIED_TOTAL` three-stage stacking |
| **Dual Registration** | Supports Java API registration and datapack JSON registration, sharing the same registries. `/reload` hot-reloads JSON; API entries are unaffected |
| **Non-Entity Bullets** | Bullets are lightweight data records managed by BulletManager, supporting thousands of simultaneous projectiles (per-chunk entity-candidate caching + capsule collision) |
| **Fully Event-Driven** | All extension points exposed via events + callback APIs: shoot events, install/uninstall events, trait hooks, damage handlers, right-click/action key events |
| **Server-Authoritative** | Shooting, bullet flight, and hit detection are all server-side. Client is render-only, cheat-resistant |
| **Random Variants** | Guns/plugins declare variant pools; each pellet independently rolls a weighted random variant per shot — the winner merges traits and overrides stats, damage type and visuals |
| **Shoot Visual Feedback** | Shoot textures switch at the moment of firing (`per_shot`/`while_firing` modes); in first person the gun itself plays a short recoil kick (push back + muzzle rise, settling within a few ticks), in third person the arms play the recoil pose. All three are driven by the same shoot-animation timer, pulsing in sync with every accepted shot |

## Quick Navigation

| Doc | For | Content |
|-----|-----|---------|
| [API Reference](./API.md) | Devs calling framework functions in code | Quick-reference tables for all ModularShootAPI public methods |
| [Registry Reference](./Registry.md) | Devs understanding definition fields | All 10 dynamic registries and field details for each definition type |
| [Datapack Registration](./DataPack.md) | Devs using JSON to register content | Datapack JSON file paths, fields, and format reference |
| [Command Reference](./CommandReference.md) | Devs using debug commands | `/modularshoot` subcommand quick reference |
| [Examples](./Examples.md) | Devs wanting to see code directly | All Java API and JSON examples in one place |

## 10 Framework Registries

| Registry ID | Purpose | Registration Method |
|-------------|---------|-------------------|
| `modularshoot:guns` | Gun definitions | Java API / Datapack JSON |
| `modularshoot:plugins` | Plugin definitions | Datapack JSON |
| `modularshoot:plugin_types` | Plugin type (category) definitions | Datapack JSON |
| `modularshoot:traits` | Boolean trait definitions | Datapack JSON |
| `modularshoot:states` | Persistent state definitions | Datapack JSON |
| `modularshoot:variants` | Random variant definitions | Datapack JSON |
| `modularshoot:shooters` | Shooter definitions (independent-firing config templates) | Java API / Datapack JSON |
| `modularshoot:attribute_meta` | Attribute metadata (defaults, display info, bindings) | Datapack JSON |
| `modularshoot:gun_items` | Item → gun bindings (bind other mods' items as guns) | Java API / Datapack JSON |
| `modularshoot:plugin_items` | Item → plugin bindings (bind other mods' items as plugins) | Java API / Datapack JSON |

> Attribute **bodies** (`Attribute` instances) must be registered using vanilla `DeferredRegister` into `BuiltInRegistries.ATTRIBUTE`. They are not in the dynamic registries above.

> An attribute_meta entry's `binds` can be rebound to any registered vanilla attribute (e.g. `minecraft:attack_damage`); all three paths (mount / resolve / display) share it. See the [datapack registration doc](./DataPack.md#attribute-metadata-json).

## Preset Attributes

The framework pre-registers 10 numeric attributes (`modularshoot` namespace):

| Attribute ID | Description | Default |
|-------------|-------------|---------|
| `hit_damage` | Damage per hit | 1.0 |
| `fire_rate` | Shots per second (cap 20, ≤0 disables shooting) | 1.0 |
| `range` | Max bullet flight distance (blocks) | 50.0 |
| `accuracy_yaw` | Horizontal spread angle (degrees) | 10.0 |
| `accuracy_pitch` | Vertical spread angle (degrees) | 10.0 |
| `entity_penetration` | Entities penetrated (0 = no penetration) | 0 |
| `bullet_speed` | Bullet flight speed (blocks/sec) | 20.0 |
| `bullet_size` | Bullet collision sphere radius (0 = raycast) | 0.5 |
| `block_penetration` | Blocks penetrated (0 = no penetration) | 0 |
| `pellet_count` | Pellets per shot (rounded, then clamped to 1~32; over-limit logs a WARN; 0 or unmounted silently degrades to a single pellet) | 1.0 |

> **0.1.3 new feature**: Gun/plugin definitions gained the `extra_values` namespaced numeric extension field (keys must be fully namespaced); `ModularShootAPI.getExtraValueSums` / `getExtraValue` provide one-stop queries for "gun definition base values + accumulated values of installed plugins".

## Key Events Overview

| Event | Fires When | Cancellable |
|-------|-----------|-------------|
| `PreShootEvent` | After shoot conditions pass | Yes |
| `PostShootEvent` | After all pellets are registered (carries every bullet of the shot via `getBullets()`) | No |
| `GunRightClickEvent` | Right-click gun outside GUI | Yes |
| `ActionEvent` | Action key pressed (default R) | Yes |
| `PrePluginInstallEvent` | After install validation passes | Yes |
| `PostPluginInstallEvent` | After plugin written to component | No |
| `PrePluginUninstallEvent` | Before plugin removal | Yes |
| `PostPluginUninstallEvent` | After plugin removed | No |
| `ClientBulletHitEvent` | On the client when a hit packet is received, before the default hit sound plays (client-only, NeoForge.EVENT_BUS) | Yes |

> **Hit-effect hook**: `ClientBulletHitEvent` fires before the default hit sound plays on the client. Its `soundId` field is the hit sound id resolved by the server from the gun definition's `sounds` slots (entity `hit_entity` / block `hit_block` / pierce `hit_pierce`; null when not configured). The framework spawns no default hit particles — visual effects are entirely up to listeners. Cancelling the event skips the default hit sound; when not cancelled, listeners can add custom sounds/particles in their own logic.
