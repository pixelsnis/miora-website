## Typography

### Font families

- **Display / body:** Aileron
  - Regular — 400
  - SemiBold — 600
- **Monospace:** Geist Mono
  - Regular — 400
  - SemiBold — 600
- **Base font size:** 16px mobile / 14px desktop

### Type scale

The desktop scale applies at the unchanged `sm` breakpoint (640px) and above.

| Style | Font | Weight | Mobile size | Desktop size | Line height | Letter spacing |
|---|---|---:|---:|---:|---:|---:|
| **XS** | Aileron | 400 | 14px | 12px | 20px / 16px | 0% |
| **SM** | Aileron | 400 | 16px | 14px | 24px / 20px | 0% |
| **Base** | Aileron | 400 | 16px | 14px | 155% | 0% |
| **H1** | Aileron | 600 | 32px | 32px | 115% | -2.5% |
| **H2** | Aileron | 600 | 24px | 24px | 120% | -2.5% |
| **H3** | Aileron | 600 | 20px | 18px | 130% | -2.5% |
| **H4** | Aileron | 600 | 16px | 14px | 140% | -2.5% |
| **Paragraph** | Aileron | 400 | 16px | 14px | 155% | 0% |
| **Caption** | Aileron | 400 | 13px | 11px | 140% | 0% |
| **Mono** | Geist Mono | 400 | 15px | 13px | 150% | 0% |
| **Mono emphasis** | Geist Mono | 600 | 15px | 13px | 150% | 0% |

Use headings sparingly. The visual hierarchy should come as much from whitespace and composition as from type size.

## Colors

### Monochrome

| Token | Hex | Use |
|---|---|---|
| `ink` | `#171717` | Primary text, dark buttons, strong icons |
| `text` | `#343432` | Standard body text |
| `text-secondary` | `#74746F` | Supporting copy, metadata |
| `text-muted` | `#A3A39D` | Low-priority or disabled text |
| `line` | `#E3E3DE` | Borders, dividers |
| `line-subtle` | `#ECECE7` | Very light separators |
| `white` | `#FFFFFF` | Text on dark surfaces |

### Surfaces

| Token | Hex | Use |
|---|---|---|
| `background` | `#FAFAF8` | Main page background |
| `surface-1` | `#F5F5F1` | Cards, subtle panels |
| `surface-2` | `#EEEEEA` | Selected or raised regions |
| `surface-dark` | `#1B1C1A` | Dark CTA / contrast surface |

### Accent hues

| Token | Hex | Role |
|---|---|---|
| `moss` | `#7F927C` | Miora / autonomous system activity |
| `clay` | `#A17F72` | Warm agent/activity accent |
| `dusty-blue` | `#788A99` | Technical / sync activity |
| `violet` | `#8C8095` | Agent / intelligence activity |

Use accent colors sparingly. `moss` should be the clearest semantic color for Miora-controlled or autonomous behavior; the other hues can represent external agents or transient activity.

