# API Reference

Quick reference for the public static methods of `ModularAmmoAPI`, grouped by function.

## Binding & Queries

| Method signature | Parameters | Returns | Description |
|------------------|-----------|---------|-------------|
| `bindGun(ResourceLocation gunId, ResourceLocation ammoTypeId)` | `gunId` — gun id (`modularshoot:guns` registry); `ammoTypeId` — ammo type id (`modularshootammo:ammo_types` registry) | `void` | Java API binding of gun→ammo. Java bindings take **priority over data packs** and **survive `/reload`**; already-issued guns of that id are affected immediately |
| `getAmmoTypeIdForGun(RegistryAccess ra, ResourceLocation gunId)` | `ra` — runtime registry view; `gunId` — gun id | `Optional<ResourceLocation>` | Queries the bound ammo type id (Java first, data pack fallback); empty when unbound |
| `getAmmoType(RegistryAccess ra, ResourceLocation ammoTypeId)` | `ra` — runtime registry view; `ammoTypeId` — ammo type registry id | `Optional<AmmoType>` | Queries an ammo type definition by id |

## Trait Checks

Traits are **final merged values** (gun base + plugin contributions, merged via the framework's `TraitMergeService`); undeclared traits return `false`.

| Method signature | Parameters | Returns | Description |
|------------------|-----------|---------|-------------|
| `isUsesAmmo(ItemStack gun, RegistryAccess ra)` | `gun` — gun item; `ra` — runtime registry view | `boolean` | Whether the gun has the ammo system enabled (`uses_ammo` trait) |
| `isInfiniteAmmo(ItemStack gun, RegistryAccess ra)` | Same as above | `boolean` | Whether the gun is exempt from ammo deduction (`infinite_ammo` trait, HUD shows ∞) |

## Registry Keys

The data pack dynamic registries are declared in `ModularAmmoRegistries` (registered on the mod bus via `DataPackRegistryEvent.NewRegistry`, support `/reload`, sync to clients):

| Constant | Registry ID | Entry type | Purpose |
|----------|-------------|------------|---------|
| `AMMO_TYPES_KEY` | `modularshootammo:ammo_types` | `AmmoType` | Ammo type definitions (name, color, item, reserve cap, per-shot cost, reload sound) |
| `GUN_AMMO_BINDINGS_KEY` | `modularshootammo:gun_ammo_bindings` | `GunAmmoBinding` | Gun→ammo binding table |

## Data Types

### AmmoType (record)

| Field | Type | Description |
|-------|------|-------------|
| `name()` | `String` | Display name, supports the `lang:` prefix |
| `color()` | `int` | Identifier color ARGB (a `"#RRGGBB"` string in JSON) |
| `item()` | `ResourceLocation` | Ammo item id |
| `reserveLimit()` | `Integer` (nullable) | Reserve cap; `null` when undeclared |
| `perShotCost()` | `int` | Ammo consumed per shot, default 1 |
| `reloadSound()` | `ResourceLocation` (nullable) | Reload sound override; `null` when undeclared |

### GunAmmoBinding (record)

| Field | Type | Description |
|-------|------|-------------|
| `ammoType()` | `ResourceLocation` | The bound ammo type id |

## Usage Example

```java
// Code binding: bind an assault rifle to rifle_ammo
ModularAmmoAPI.bindGun(
        ResourceLocation.fromNamespaceAndPath("mymod", "assault_rifle"),
        ResourceLocation.fromNamespaceAndPath("modularshootammo", "rifle_ammo"));

// Query the held gun's ammo info
ItemStack gun = player.getMainHandItem();
RegistryAccess ra = player.registryAccess();
if (ModularAmmoAPI.isUsesAmmo(gun, ra)) {
    Optional<AmmoType> type = ModularAmmoAPI.getAmmoTypeIdForGun(ra, ModularShootAPI.getGunId(gun))
            .flatMap(id -> ModularAmmoAPI.getAmmoType(ra, id));
    type.ifPresent(t -> System.out.println("ammo item: " + t.item()));
}
```
