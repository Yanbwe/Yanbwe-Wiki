# Command Reference

`/modularshoot` debug command. Requires op level 2 (`modularshoot.command` permission node).

## Subcommand Quick Reference

| Subcommand | Parameters | Description |
|------------|------------|-------------|
| `stats` | None | Queries the **final calculated attribute values** of your main-hand gun (includes gun base + plugin modifiers + buff/equipment sources combined) |
| `plugins` | None | Lists all installed plugins on your main-hand gun. Shows: plugin ID, installed type ID, instance UUID, lock status |
| `gun <id>` | `id` — gun registry ID (e.g. `modularshoot:test_gun`) | Gives yourself a specified gun item |
| `plugin <id> [count]` | `id` — plugin registry ID; `count` — optional, quantity to give (default 1, clamped to 1–64) | Gives yourself one or more specified plugin items |
| `bullets` | None | Queries the current world's active bullet count and brief status |
| `debug <on|off>` | `on` or `off` | Toggles debug mode. When on, continuously shows key attribute values of your main-hand gun on the action bar |
| `variants` | None | Previews your main-hand gun's **variant pool** (computed server-side, includes trinket contributor modifiers): one line per candidate with variant ID, final weight and probability percentage; guns declaring no variant pool show a "Normal bullet (default fallback)" entry (spec §6.4 v1.2) |

## Usage Examples

| Operation | Command |
|-----------|---------|
| View all attributes of held gun | `/modularshoot stats` |
| View installed plugins on held gun | `/modularshoot plugins` |
| Get a test gun | `/modularshoot gun modularshoot:test_gun` |
| Get 5 rapid-fire barrel plugins | `/modularshoot plugin modularshoot:rapid_fire_barrel 5` |
| View active bullet count in world | `/modularshoot bullets` |
| Enable debug HUD | `/modularshoot debug on` |
| View held gun's variant pool probabilities | `/modularshoot variants` |
