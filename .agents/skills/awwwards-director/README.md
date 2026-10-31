# awwwards — elite frontend orchestrator for Claude Code

> The page someone screenshots and shares, not the page that just works.

`awwwards` is a [Claude Code](https://claude.com/claude-code) skill that turns "build me a landing page" into a disciplined 9-phase pipeline for Awwwards-tier UI work. It composes the best frontend skills in the ecosystem — `frontend-design`, `impeccable`, `ui-ux-pro-max`, `design-motion-principles`, `color-expert`, `color-palette-extractor`, `agent-browser`, `remotion-best-practices` — plus a proven runtime stack of **Framer Motion + anime.js + Three.js + 21st.dev** via the Magic MCP.

![Full page preview](screenshots/full-page.png)

---

## Quick install

```text
/plugin marketplace add Ga14ctic/awwwards-skill
/plugin install awwwards@awwwards-skill
```

That's it. The skill is now registered and self-triggering. Start a fresh Claude Code session and ask for "an elite landing page", "blow my mind", "an Awwwards-tier hero", or hit `/awwwards <brief>` directly.

> **Restart Claude Code** after the install so the skill registers in the available-skills list.

### Manual install (no marketplace)

If you'd rather drop the skill straight into your config:

```bash
git clone https://github.com/Ga14ctic/awwwards-skill.git
# Copy the skill folder into your Claude Code skills directory
cp -r awwwards-skill/awwwards/skills/awwwards ~/.claude/skills/
```

Then restart Claude Code.

---

## What it does

| Skill input | What you get back |
|---|---|
| "build me an Awwwards-tier landing page for X" | Brief → palette → composition → motion lens → working code → polish pass → browser verification |
| "make this hero blow my mind" | Iridescent Three.js hero + velocity marquees + magnetic CTAs + anime.js counters |
| "elite portfolio piece" | Single-HTML artifact (no build step) with React islands inside vanilla DOM |
| "client demo that needs to land" | Real palette extracted from the client's live site, not invented colours |
| "Remotion video composition" | Hands off to `remotion-best-practices` and `switchyard-video` |

### Reference build

The canonical output of this skill is the **Calibration Lab** demo — a working showcase that mounts every motion library, every audit pattern, and every 3D recipe documented in this skill into one page.

| Hero (Three.js iridescent icosahedron) | Bento grid (Framer Motion 3D tilt cards) |
|---|---|
| ![Hero](screenshots/hero.png) | ![Bento](screenshots/bento.png) |

| Three lenses (restraint / polish / play) | Audit theatre (ui-ux-pro-max pins) |
|---|---|
| ![Lens lab](screenshots/lens-lab.png) | ![Audit](screenshots/audit-theatre.png) |

| Velocity marquees |
|---|
| ![Routes](screenshots/routes.png) |

---

## The 9-phase pipeline

The skill enforces this order. Skipping phases breaks the bar.

| Phase | Tool | Output |
|---|---|---|
| **1. Brief** | the skill itself | Purpose, audience, register, aesthetic direction, the one unforgettable thing |
| **2. Palette** | `color-palette-extractor` (client) **or** `color-expert` (original) | OKLCH tokens, named roles, commitment level |
| **3. Inspiration** | `ui-ux-pro-max` + Magic MCP (`21st_magic_component_inspiration`, `logo_search`) | Reference patterns, anti-patterns, real logos |
| **4. Composition** | `frontend-design` | Bold, committed layout with a clear conceptual direction |
| **5. Motion calibration** | `design-motion-principles` | One lens picked per surface: restraint / polish / play |
| **6. Implementation** | this skill | Working code with Framer Motion + anime.js + Three.js + 21st.dev pieces |
| **7. Video (optional)** | `remotion-best-practices` | Composition, captions, hero loops |
| **8. Polish & audit** | `impeccable` | Restraint pass, hierarchy, edge cases, accessibility |
| **9. Verification** | `agent-browser` | Real-browser screenshot, 4-viewport sweep, interaction test |

**Phases 1, 2, 4, 6, 8, 9 are mandatory.** Phase 3 fires if you don't have a strong reference in mind. Phase 5 fires the moment you add a single transition.

---

## Best practices

### Use it for the right thing

`awwwards` is **overkill** for utilitarian admin UI, CRUD dashboards, settings pages, or quick patches. Use `frontend-design` or `impeccable` alone for those. The skill detects the misfit and refuses to run.

It **shines** for: landing pages, brand sites, portfolios, hero pieces, client demo deliverables, pitch deck slides, creative coding artifacts, marketing heroes, and Remotion video compositions.

### Commit to one aesthetic

Bland centrism is the enemy. Before you write a line of code, the brief locks ONE direction:

- brutally minimal
- maximalist chaos
- retro-futuristic
- organic / natural
- luxury editorial
- playful toy-like
- art deco
- industrial brutalist
- soft pastel

Mixing two of these inside one surface reads as indecision.

### Palette discipline

- **OKLCH only.** Never `#000` or `#fff`. Tint every neutral toward the brand hue (chroma 0.005–0.01). Reduce chroma as lightness approaches 0 or 100.
- **For client work:** extract the palette from a headless-browser screenshot of the live site. Never invent "tasteful guess" colours.
- **Tokenise as CSS variables.** `--bg`, `--ink`, `--accent`. No hardcoded hex duplicates across the file.

### Typography rules

- **NEVER** Inter, Roboto, Arial, or system fonts as defaults.
- **NEVER** Space Grotesk by reflex (it's the AI-slop default).
- Distinctive display font paired with refined body font. Preconnect both Google Fonts origins. Request only the weights you use.

### Motion library matrix

| Tool | Use for |
|---|---|
| **Framer Motion** | React component motion, layout transitions, scroll/velocity hooks, mouse-tilt cards, magnetic CTAs |
| **anime.js** | Number counters (count-up easing), text scramble, stagger pulses, SVG path morphs |
| **Three.js** | Hero 3D objects with `MeshPhysicalMaterial` (iridescence, clearcoat) and procedural envmap via `PMREMGenerator` on a `CanvasTexture` gradient |
| **CSS-only** | Static decoration, hover micro-interactions, page-load stagger via `animation-delay` |

### Architecture choice — pick before writing a line

- **Branch A — single HTML file, no build step.** Switchyard signature for showcase pages, demos, client pitches. ES import map from esm.sh + `htm` tagged templates for JSX-without-Babel. See [`awwwards/skills/awwwards/reference/architecture-single-html.md`](awwwards/skills/awwwards/reference/architecture-single-html.md).
- **Branch B — Next.js / production framework.** When the build is going into a deployed app.
- **Branch C — Remotion video.** Hand off to `remotion-best-practices`.

### Auto-reject anti-patterns

- Centred, evenly-spaced hero with one heading + one subhead + one button (the "AI slop landing page")
- Purple gradients on white backgrounds
- Even, timid colour distributions
- Flat solid backgrounds when the aesthetic could carry depth
- Animations that don't reinforce meaning ("motion-meaning" rule)
- Fake testimonials, fake logos, fake metrics

---

## What's in this repo

```
awwwards-skill/
├── .claude-plugin/
│   └── marketplace.json          # marketplace manifest
├── awwwards/                      # the plugin
│   ├── .claude-plugin/
│   │   └── plugin.json
│   └── skills/
│       └── awwwards/
│           ├── SKILL.md           # the orchestrator (read this)
│           └── reference/
│               ├── architecture-single-html.md   # single-HTML stack with copy-paste recipes
│               ├── motion-recipes.md             # Framer Motion / anime.js patterns
│               └── gotchas.md                    # 10 known bugs that bite — check before declaring done
├── screenshots/                   # reference output from the canonical build
├── LICENSE                        # MIT
└── README.md
```

---

## Required and recommended companion skills

The skill orchestrates other skills. For the full pipeline to run, install:

| Skill | Source | What it does in the pipeline |
|---|---|---|
| `frontend-design` | [anthropics/claude-code](https://github.com/anthropics/claude-code) (official plugins) | Phase 4 composition |
| `impeccable` | Anthropic plugins | Phase 8 polish & audit |
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max](https://github.com/nextlevelbuilder/ui-ux-pro-max) | Phase 3 inspiration & rules |
| `design-motion-principles` | community | Phase 5 motion calibration |
| `color-expert` + `color-palette-extractor` | community | Phase 2 palette |
| `agent-browser` | community | Phase 9 verification |
| `remotion-best-practices` | community | Phase 7 video (optional) |

**Magic MCP** (for 21st.dev components and logo search) — install via your MCP config. See [21st.dev docs](https://21st.dev/) for the install command.

If a companion skill is missing, `awwwards` still runs — it just degrades that phase to inline guidance rather than delegating.

---

## Gotchas worth knowing upfront

These bite every elite build. Full list in [`reference/gotchas.md`](awwwards/skills/awwwards/reference/gotchas.md).

1. **Italic gradient + character-split = invisible text.** Children inherit `color: transparent` but have no background. Render the whole word as one `motion.span`, not character-split.
2. **Hooks inside helper functions.** Promote any helper that calls `useMotionValue` / `useSpring` to its own component.
3. **Three.js iridescent material looks flat without an envmap.** Bake a procedural envmap from a `CanvasTexture` gradient through `PMREMGenerator`.
4. **Three.js orbit text — back-half visible.** Use `MeshBasicMaterial({ side: THREE.FrontSide })` on the cylinder. `FrontSide` culls the back half automatically.
5. **Velocity marquee jitters on mobile.** Increase `useSpring` `damping` (50 → 80) and lower `stiffness` (400 → 200), or disable velocity factor below 768px.
6. **Three.js + Framer + anime all blocking first paint = LCP > 2.5s.** Render hero text as plain HTML + CSS first; mount the WebGL canvas after first paint.

---

## Triggering phrases

The skill self-fires on:

> elite · blow my mind · Awwwards · absolutely insane · go all out · showcase · something special · don't hold back · jaw-dropping · wow factor · premium feel · hero piece · pitch deck slide · creative coding · brand site · landing hero · portfolio · demo reel · interactive artifact

Or invoke it directly: `/awwwards build me a hero for a luxury bourbon brand`.

---

## License

MIT. See [LICENSE](LICENSE).

Built by [Sam Luker](https://github.com/Ga14ctic) for [Switchyard](https://switchyard.to). If you ship something with it, I'd love to see it.
