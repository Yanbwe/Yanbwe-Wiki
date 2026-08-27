# Command Reference

`/onegun` is the root command for OneGunLifetime. The player-facing subcommands `bind`, `stat`, `trait`, and `info` do not require op permissions; the admin subcommand `unbind` requires op permission level 2.

## Subcommand Reference

| Subcommand | Arguments | Description |
|------------|-----------|-------------|
| `bind <gunId>` | `gunId` — a registered ModularShoot gun ID (e.g. `modularshoot:demo_pistol`); must be an entity definition in `getAllGunIds` | Binds the executor's soul to that gun template, once per lifetime; creates the first projection gun on success |
| `stat set <attributeId> <value>` | `attributeId` — a logical attribute ID from the `attribute_meta` registry; `value` — any finite number | Overrides the base value of a logical attribute |
| `stat reset [attributeId]` | `attributeId` optional | Without arguments, clears all stat overrides; with an argument, removes only that override |
| `trait add <traitId>` | `traitId` — a registered trait ID | Adds a trait to the soul gun |
| `trait remove <traitId>` | `traitId` — a registered trait ID | Removes a trait from the soul gun |
| `info` | None | Shows the current binding: template, overrides, traits, plugins, version, and stable gun ID |
| `unbind <player>` | `player` — an online player | Admin only: clears the target's binding and projection guns. Requires op 2 |

## Usage Examples

| Action | Command |
|--------|---------|
| Bind the demo pistol | `/onegun bind modularshoot:demo_pistol` |
| Override `modularshoot:hit_damage` to 20 | `/onegun stat set modularshoot:hit_damage 20` |
| Clear all stat overrides | `/onegun stat reset` |
| Add the `modularshoot:auto` trait | `/onegun trait add modularshoot:auto` |
| Inspect your soul binding | `/onegun info` |
| Admin unbind player Steve | `/onegun unbind Steve` |

## Errors

- Unbound players receive a "bind first" message for `stat`/`trait`/`info`.
- Already-bound players are rejected when using `bind` again.
- `bind` only accepts gun definitions from the framework entity registry; dynamically generated player-specific gun IDs cannot be bound.
- Failed parameter validation never leaves a half-applied state.