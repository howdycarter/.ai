# Design System: {Project Name}

## Brand personality
{2-3 adjectives. What does this product feel like?}
Inspired by: {2-3 reference products or brands}

## Colors

### Core palette
| Token           | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| --primary       | #         | Primary actions, links, active states    |
| --primary-hover | #         | Hover state for primary elements         |
| --secondary     | #         | Secondary text, labels, metadata         |
| --accent        | #         | Success states, positive indicators      |
| --warning       | #         | Caution states                           |
| --danger        | #         | Errors, destructive actions              |
| --surface       | #FFFFFF   | Card and component backgrounds           |
| --background    | #F8FAFC   | Page background                          |
| --border        | #E2E8F0   | Dividers, card borders, input borders    |
| --text-primary  | #0F172A   | Headings, primary content                |
| --text-secondary| #475569   | Supporting text, descriptions            |
| --text-muted    | #94A3B8   | Placeholder text, disabled states        |

## Typography

### Font stack
- **Primary:** {font} (fallback: -apple-system, system-ui, sans-serif)
- **Monospace:** {font} (fallback: Menlo, Consolas, monospace)

### Scale
| Name        | Size   | Weight | Line height | Usage                    |
|-------------|--------|--------|-------------|--------------------------|
| h1          | 24px   | 600    | 1.3         | Page titles              |
| h2          | 20px   | 600    | 1.35        | Section headers          |
| h3          | 16px   | 600    | 1.4         | Card titles              |
| body        | 14px   | 400    | 1.5         | Default text             |
| body-sm     | 13px   | 400    | 1.5         | Dense UI, table cells    |
| caption     | 12px   | 500    | 1.4         | Labels, metadata         |

## Spacing (base unit: 4px)
| Token | Value | Usage                              |
|-------|-------|------------------------------------|
| xs    | 4px   | Inline element gaps                |
| sm    | 8px   | Icon-to-label gaps, tight padding  |
| md    | 12px  | Default padding inside components  |
| lg    | 16px  | Section spacing, card padding      |
| xl    | 24px  | Between card groups                |
| 2xl   | 32px  | Major section breaks               |

## Borders and corners
| Context           | Radius | Border                       |
|-------------------|--------|------------------------------|
| Cards             | 12px   | 1px solid --border           |
| Buttons           | 8px    | None (filled) or 1px --border|
| Inputs            | 8px    | 1px solid --border           |
| Modals            | 16px   | None (shadow only)           |

## Component patterns

### Cards
Container: --surface background, radius-12, padding-lg
Header: h3 title left-aligned
Content: body text, --text-secondary for supporting info
Hover: elevation change, transition 150ms

### Buttons
Primary: --primary bg, white text, weight 500, padding sm/lg, radius-8
Secondary: transparent bg, --primary text, 1px --border border
Danger: --danger bg, white text — destructive actions only
Disabled: opacity 0.5, cursor not-allowed

### Empty states
Container: centered, max-width 400px, padding-2xl
Icon: 48px, --text-muted
Headline: h2, --text-primary
Description: body, --text-secondary, max 2 lines
Action: primary button

## Animation
- Duration: 150ms micro-interactions, 300ms transitions
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Respect prefers-reduced-motion: disable non-essential animation

<!-- TIP: Generate this file from Google Stitch (stitch.withgoogle.com)
     or extract from any existing site using Stitch's URL extraction. -->
