# KodNest Premium Build System

**Design System for B2C Product**  
Calm, intentional, coherent, confident. One mind. No visual drift.

---

## 1. Design Philosophy

- **Calm** — No visual noise. Space and clarity over density.
- **Intentional** — Every element has a purpose. No decoration for its own sake.
- **Coherent** — Same patterns everywhere. Predictable structure.
- **Confident** — Serif headlines, clear hierarchy, no hedging.

**Out of scope:** Flashy, loud, playful, hackathon-style. No gradients, glassmorphism, neon colors, or animation noise.

---

## 2. Color System

**Maximum 4 colors across the entire system.**

| Role        | Value     | Usage |
|------------|-----------|--------|
| Background | `#F7F6F3` | Page and card backgrounds (off-white) |
| Primary text | `#111111` | Headings, body, labels |
| Accent     | `#8B0000` | Primary actions, links, key highlights (deep red) |
| Success    | Muted green | Success states, completed items |
| Warning    | Muted amber | Warnings, in-progress, attention |

**Rules:**
- No gradients. Solid colors only.
- No neon. Muted success/warning only.
- Accent used sparingly: primary button, active step, critical CTAs.

---

## 3. Typography

**Headings**
- Font: Serif. Large, confident. Generous letter-spacing and line-height.
- No decorative or display fonts. One serif family for all headings.

**Body**
- Font: Clean sans-serif.
- Size: 16–18px.
- Line-height: 1.6–1.8.
- Max width for text blocks: 720px.

**Rules:**
- No random sizes. Use a strict type scale.
- No decorative fonts. Serif for headings, sans-serif for body only.

---

## 4. Spacing System

**Single scale. No arbitrary values.**

| Token | Value |
|-------|--------|
| space-1 | 8px |
| space-2 | 16px |
| space-3 | 24px |
| space-4 | 40px |
| space-5 | 64px |

**Rule:** Never use values like 13px, 27px, etc. Whitespace is part of the design. Use only the scale above.

---

## 5. Global Layout Structure

Every page follows this order, top to bottom:

```
[Top Bar]
    ↓
[Context Header]
    ↓
[Primary Workspace (70%)  |  Secondary Panel (30%)]
    ↓
[Proof Footer]
```

---

### 5.1 Top Bar

- **Left:** Project name (text only, no icon unless essential).
- **Center:** Progress indicator — "Step X / Y" (clear, minimal).
- **Right:** Status badge — one of: **Not Started** | **In Progress** | **Shipped**. Single source of truth for step status.

Styling: Same background as page or one step darker. No heavy borders. Height consistent with spacing scale (e.g. space-4).

---

### 5.2 Context Header

- **Headline:** Large serif. One line. Clear purpose.
- **Subtext:** One line. No hype language. Explains what this step is for.

No taglines, no marketing copy in the header.

---

### 5.3 Primary Workspace (70% width)

- Where the main product interaction happens.
- Clean cards. Predictable components.
- No crowding. Use spacing scale for padding and gaps.

---

### 5.4 Secondary Panel (30% width)

- **Step explanation:** Short. 2–4 lines max.
- **Copyable prompt box:** Monospace or clear font. Copy action obvious.
- **Actions:** Copy | Build in Lovable | It Worked | Error | Add Screenshot. Calm styling; no competing emphasis.
- Same border radius and hover behavior as rest of system.

---

### 5.5 Proof Footer (persistent bottom section)

Checklist style. Each item requires user proof input.

- □ UI Built  
- □ Logic Working  
- □ Test Passed  
- □ Deployed  

Persistent across relevant steps. Clear, scannable. Not decorative.

---

## 6. Component Rules

**Buttons**
- **Primary:** Solid deep red (`#8B0000`). One primary per context.
- **Secondary:** Outlined. Same border radius as primary.
- Same hover effect and border radius everywhere. No mixed styles.

**Inputs**
- Clean borders. No heavy shadows.
- Clear focus state (e.g. border color change). No glow.

**Cards**
- Subtle border. No drop shadows.
- Balanced padding from spacing scale (e.g. space-2, space-3).

**Rule:** One border radius value for buttons, inputs, cards. One hover treatment (e.g. opacity or border). No visual drift.

---

## 7. Interaction Rules

- **Transitions:** 150–200ms, ease-in-out only. No bounce, no parallax.
- **Hover:** Consistent across buttons and links.
- **Focus:** Visible and consistent for accessibility.

---

## 8. Error & Empty States

**Errors**
- Explain what went wrong and how to fix it.
- Never blame the user. Tone: helpful, clear.

**Empty states**
- Provide the next action (e.g. "Add your first item" with a clear CTA).
- Never feel dead. One primary action per empty state.

---

## 9. Summary

- **Colors:** 4 max. Background, primary text, accent (deep red), success/warning muted.
- **Type:** Serif headlines, sans body 16–18px, max 720px text width.
- **Space:** 8, 16, 24, 40, 64 px only.
- **Layout:** Top Bar → Context Header → 70/30 Workspace + Panel → Proof Footer.
- **Components:** One radius, one hover, no shadows, no gradients.
- **Motion:** 150–200ms ease-in-out only.

Everything must feel like one mind designed it. No visual drift.
