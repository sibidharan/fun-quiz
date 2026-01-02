---
name: miocene-css-art
description: Julia Miocene CSS art animation techniques. Use when creating CSS-only illustrations, scene backgrounds, and animations. Reference for quiz theme backgrounds.
---

# Julia Miocene CSS Art Techniques

This skill documents the pure CSS art techniques used by Julia Miocene (github.com/Miocene/animations) for creating stunning CSS-only illustrations and animations.

## Core Principles

### 1. Universal Element Setup
```css
.scene *,
.scene *::before,
.scene *::after {
    content: '';
    position: absolute;
}
```
- ALL elements use `position: absolute`
- ALL pseudo-elements have `content: ''` by default
- This allows precise pixel positioning

### 2. CSS Variables for Theming
```css
:root {
    --sky-top: #87CEEB;
    --sky-mid: #B4E1F2;
    --mountain-far: #90A4AE;
    --mountain-near: #455A64;
    --tree-dark: #1B5E20;
    --tree-light: #43A047;
}
```
- Define color palettes as CSS variables
- Group related colors (sky, ground, objects)
- Use descriptive names with depth indicators (far, near, dark, light)

## Shape Techniques

### Mountains/Triangles Using Borders
```css
.mountain {
    width: 0;
    height: 0;
    border-left: 150px solid transparent;
    border-right: 150px solid transparent;
    border-bottom: 120px solid #607D8B;
}
```
- Creates perfect triangles without images
- Adjust base width via border-left/right
- Adjust height via border-bottom
- Asymmetric mountains: use different left/right values

### Trees (Pine/Conical) Using Borders
```css
.pine-tree {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 50px solid #1B5E20;
}
```
- Same technique as mountains, smaller scale
- Layer multiple triangles for fuller trees

### Circles/Sun/Clouds Using border-radius
```css
.sun {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FFE082;
    box-shadow:
        0 0 60px 30px rgba(255, 224, 130, 0.8),
        0 0 100px 60px rgba(255, 241, 118, 0.3);
}

.cloud {
    width: 120px;
    height: 40px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.9);
}
.cloud::before {
    top: -20px;
    left: 25px;
    width: 60px;
    height: 35px;
    border-radius: 35px;
    background: inherit;
}
```
- Sun: circular with glowing box-shadow
- Clouds: combine multiple rounded rectangles

### Organic Shapes Using Combined border-radius
```css
.leaf {
    border-radius: 50% 50% 50% 20%;  /* asymmetric corners */
}

.tree-canopy {
    border-radius: 50%;
    box-shadow:
        -50px 10px 0 10px green,
        50px 10px 0 10px green,
        0 -35px 0 20px lightgreen;
}
```

## Box-Shadow Multiplication Technique

The most powerful technique - creates multiple identical elements from one:

```css
/* Create a row of trees from one element */
.tree-row {
    border-bottom: 50px solid green;
    box-shadow:
        40px 10px 0 0 green,
        80px 5px 0 0 green,
        120px 12px 0 0 green,
        160px 8px 0 0 green;
}

/* Create grass blades */
.grass::before {
    border-bottom: 25px solid green;
    box-shadow:
        10px 5px 0 0 darkgreen,
        20px 2px 0 0 lightgreen,
        30px 6px 0 0 green;
}

/* Create fireflies/stars */
.particles::before {
    width: 4px;
    height: 4px;
    background: yellow;
    border-radius: 50%;
    box-shadow:
        100px 50px 0 0 yellow,
        200px -30px 0 0 yellow,
        /* Add glow with second shadow */
        0 0 6px 2px rgba(255, 255, 0, 0.6),
        100px 50px 6px 2px rgba(255, 255, 0, 0.6);
}

/* Create birds in formation */
.birds::before {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 6px solid #455A64;
    box-shadow:
        25px 8px 0 0 #455A64,
        50px 3px 0 0 #455A64;
}
```

### Box-Shadow Syntax
```
box-shadow: offset-x offset-y blur spread color;
```
- `offset-x/y`: Position relative to original
- `blur`: 0 for sharp copies
- `spread`: Increase/decrease size
- Stack multiple shadows with commas

## Animation Patterns

### Gentle Sway (Trees/Grass)
```css
@keyframes tree-sway {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(2deg); }
}
.tree {
    animation: tree-sway 6s ease-in-out infinite;
}
```

### Pulsing Glow (Sun/Stars)
```css
@keyframes sun-pulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 60px 30px rgba(255, 224, 130, 0.8);
    }
    50% {
        transform: scale(1.05);
        box-shadow: 0 0 80px 40px rgba(255, 224, 130, 0.9);
    }
}
```

### Drifting Movement (Clouds)
```css
@keyframes cloud-drift {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 200px)); }
}
.cloud {
    animation: cloud-drift 60s linear infinite;
}
```

### Flapping Wings (Birds/Butterflies)
```css
@keyframes wing-left {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(70deg); }
}
.wing-left {
    animation: wing-left 0.15s ease-in-out infinite alternate;
    transform-origin: right center;
}
```

### Linear Movement (Birds Flying)
```css
@keyframes birds-fly {
    0% { transform: translateX(0); }
    100% { transform: translateX(calc(100vw + 150px)); }
}
.birds {
    left: -50px;
    animation: birds-fly 25s linear infinite;
}
```

### Spinning (Windmill Blades)
```css
@keyframes turbine-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.blades {
    animation: turbine-spin 4s linear infinite;
    transform-origin: center bottom;
}
```

### Fading Appearance (Rainbow)
```css
@keyframes rainbow-appear {
    0%, 70%, 100% { opacity: 0; transform: scale(0.9); }
    80%, 90% { opacity: 0.8; transform: scale(1); }
}
```

## Quiz Theme Scene Structure

Use these elements in `play.php` for quiz backgrounds:

```
.scene-background
├── .elem-0-ultra      (Ultra-far background - distant mountains)
├── .elem-0-far        (Far background - mid mountains)
├── .pine-forest       (Forest tree line)
├── .elem-1            (Main tree left)
├── .elem-1-fg         (Foreground tree right)
├── .elem-2            (Animal - deer/creature)
├── .deer-legs         (Animal legs helper)
├── .elem-3            (Water/stream)
├── .elem-4            (Flying creature 1 - butterfly)
├── .butterfly-2       (Flying creature 2)
├── .butterfly-3       (Flying creature 3)
├── .elem-5            (Sun/light source)
├── .elem-6            (Cloud 1)
├── .cloud-2           (Cloud 2)
├── .cloud-3           (Cloud 3)
├── .elem-7            (Structure - windmill/building)
├── .turbine-blades    (Structure helper)
├── .elem-8            (Special effect - rainbow)
├── .elem-9            (Birds flock 1)
├── .birds-2           (Birds flock 2)
├── .grass             (Ground grass)
├── .scene-particles   (Fireflies/particles)
└── .depth-fog         (Atmospheric fog layer)
```

## Complete Theme Template

```css
/* ============================================
   [THEME NAME] THEME - JULIA MIOCENE STYLE
   [Description]
   ============================================ */

:root {
    /* Sky colors */
    --theme-sky-top: #87CEEB;
    --theme-sky-mid: #B4E1F2;
    --theme-sky-bottom: #D4F1F9;

    /* Feature colors */
    --theme-primary: #4CAF50;
    --theme-secondary: #2196F3;

    /* Ground colors */
    --theme-ground-light: #7CB342;
    --theme-ground-dark: #33691E;
}

/* Base setup */
.theme-[name] .scene-background {
    background: linear-gradient(180deg,
        var(--theme-sky-top) 0%,
        var(--theme-sky-mid) 40%,
        var(--theme-sky-bottom) 60%,
        var(--theme-ground-light) 60%,
        var(--theme-ground-dark) 100%);
    overflow: hidden;
    position: relative;
}

.theme-[name] .scene-background *,
.theme-[name] .scene-background *::before,
.theme-[name] .scene-background *::after {
    content: '';
    position: absolute;
}

/* === SUN === */
.theme-[name] .elem-5 {
    top: 8%;
    right: 15%;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: #FFE082;
    box-shadow: 0 0 60px 30px rgba(255, 224, 130, 0.8);
    animation: [name]-sun-pulse 8s ease-in-out infinite;
    z-index: 5;
}

/* === MOUNTAINS === */
.theme-[name] .elem-0-ultra {
    bottom: 40%;
    left: 0;
    width: 0;
    height: 0;
    border-left: 150px solid transparent;
    border-right: 150px solid transparent;
    border-bottom: 120px solid var(--theme-mountain-far);
    z-index: 7;
}

/* [Continue with other elements...] */
```

## Color Palette Guidelines

### Sky Gradients
- Top: Deep blue (#0277BD to #87CEEB)
- Mid: Light blue (#B4E1F2)
- Horizon: Very light (#D4F1F9 to white)

### Mountain Atmospheric Perspective
- Far: Light gray-blue (#90A4AE) with low opacity
- Mid: Medium gray-blue (#607D8B)
- Near: Dark blue-gray (#455A64)

### Forest/Trees
- Dark (shadows): #1B5E20
- Mid: #2E7D32, #388E3C
- Light (sunlit): #43A047, #66BB6A

### Water
- Deep: #0288D1
- Mid: #29B6F6
- Surface: #81D4FA

## Performance Tips

1. **Limit box-shadow count** - Each shadow adds render cost
2. **Use will-change sparingly** - Only on animated elements
3. **Prefer transform animations** - Better GPU acceleration
4. **Group similar z-index** - Reduces layer count
5. **Use opacity for fading** - More performant than visibility

## Reference Files

The cloned Miocene animations are in `/public/animations/`:
- `2017_06_windmill/` - Windmill with snow scene
- `2021_11_town/` - Complex 3D isometric town
- `2020_04_tractor/` - Farm scene with tractor
- `2017_06_smiling-planet/` - Animated planet
- `2018_04_designers/` - The benchmark CodePen example
