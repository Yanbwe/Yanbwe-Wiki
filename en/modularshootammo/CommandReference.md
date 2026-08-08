# Command Reference

The `/modularammo` debug command, requiring op permission level 2.

## Subcommand Reference

| Subcommand | Arguments | Description |
|------------|-----------|-------------|
| `info` | None | Dumps the main-hand gun's ammo state: `uses_ammo`/`infinite_ammo` trait values, bound ammo type, magazine `mag/mag_size`, inventory reserve count, `reload_tick`/`reload_gun`, and the final `reload_time`. Fails when the main hand is not a gun |
| `ammo <ammoType> <count>` | `ammoType` — ammo type registry id (e.g. `modularshootammo:rifle_ammo`); `count` — 1-9999 | Gives yourself ammo items of the specified type (drops when the inventory is full). Fails when the type is not registered |
| `fill` | None | Refills the main-hand gun's magazine to the final `mag_size`. Fails when the main hand is not a gun or has no state data |
| `bind <gun> <ammoType>` | `gun` — gun registry id; `ammoType` — ammo type registry id | Java-binds a gun→ammo (in-memory, not persisted, effective immediately, survives `/reload`) |

## Usage Examples

| Action | Command |
|--------|---------|
| Inspect the held gun's ammo state | `/modularammo info` |
| Get 64 rifle rounds | `/modularammo ammo modularshootammo:rifle_ammo 64` |
| Refill the held gun's magazine | `/modularammo fill` |
| Switch demo_pistol to rifle ammo | `/modularammo bind modularshootammo:demo_pistol modularshootammo:rifle_ammo` |
