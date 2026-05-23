# ColorTooltips

Highly customizable tooltips with silky-smooth animations.

Say goodbye to vanilla's dull gray box. ColorTooltips lets you style tooltips the way you style your items. Border color, background opacity, title bar height, color flow speed, fade duration, flash length—it's all yours, defined in JSON. Tweak a file, type `/colortooltips reload`, and see the change instantly. No restart.

Pairs perfectly with [RarityCore](/en/raritycore/) to automatically assign different styles to different rarity tiers. Without it, vanilla rarity colors work just as well.

## 🎨 Deep Customization

Everything is configurable, down to the pixel and the frame:

- **Free color choice** — Use rarity theme colors (`@rarityCore`, `@vanillaRarity`) or any hex color (`#FF5500`), with optional brightness and saturation tweaks on top
- **Per-zone control** — Border, background, and title bar are configured independently. Each gets its own color list, opacity, flow direction, and flow speed
- **Style selector** — Different items and rarities can automatically load different style files. Commons get one look, rares another, and you can pin specific items to specific styles
- **Hot reload** — Edit the JSON in-game, hit `/colortooltips reload`, and see the change immediately. No restart. No waiting

Four preset styles to get you started: **Vanilla** (clean white), **VanillaRarity** (rarity colors), **RarityCoreStyles** (full rarity spectrum), **RGB** (rainbow gradients). Ready to write your own? The [Style Guide](/en/colorTooltips/StyleGuide) has you covered.

## 🎬 Silky Animations

Every animation is individually toggleable and tunable:

- **Fade in/out** — Smooth appearance, graceful disappearance. Adjustable delay and duration. Turn it off for instant pop-in if that's your thing
- **Position easing** — Non-linear cursor tracking with a natural slide when the tooltip flips sides. Speed multiplier is yours to set
- **Size transition** — Smooth scaling as dimensions change. No jarring jumps
- **Color flow** — Colors continuously drift along borders and title bars. Speed, direction, on or off—up to you
- **Item model animation** — Icons scale from small to normal. Switching and appearing each have independent start sizes
- **Switch flash** — A streak of light sweeps the border when you hover a different item. Color, length, segmentation—all configurable
- **Cross-style blending** — When a style change happens mid-hover, old colors fade out as new ones fade in. Seamless

See the [Config Guide](/en/colorTooltips/ConfigGuide) for details.

## 🔗 Compatibility

- Compatible with SearchCarefully
- Compatible with Apotheosis
- Not compatible with mods that modify tooltip styles, but compatible with mods that add content to tooltips
