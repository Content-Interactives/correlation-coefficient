# Correlation Coefficient

Static **Next.js** app: users enter a target correlation in **[-1, 1]**, press **Enter**, and the UI regenerates a **synthetic scatter plot** plus an **ordinary least squares** regression line overlaid in **Recharts**.

**Live site:** [https://content-interactives.github.io/correlation-coefficient](https://content-interactives.github.io/correlation-coefficient)

Standards, CK-12 links, and lesson placement: [Standards.md](Standards.md).

---

## Stack

| Layer | Notes |
|--------|--------|
| Framework | Next.js (Pages Router), `output: 'export'` → static files in `out/` |
| UI | React, TypeScript |
| Charts | Recharts (`ScatterChart`, `Scatter`, `Line`, `ResponsiveContainer`) |
| Styling | Tailwind utility classes, `styles/globals.css`, `styled-jsx` global overrides for `.recharts-scatter-symbol` |

---

## Layout

```
next.config.js           # export mode; production basePath/assetPrefix
pages/
  _app.tsx               # Global CSS import
  index.tsx              # Page shell → <CorrelationExplorer />
components/
  CorrelationExplorer.tsx   # State, data generation, chart
styles/globals.css
.github/workflows/deploy.yml   # build → out/ + .nojekyll → gh-pages
```

The README previously mentioned root `index.html` and `js/`/`css/` folders; this repo is **not** structured that way—the entry is **`pages/index.tsx`** and the export lands in **`out/`**.

---

## Behavior (`CorrelationExplorer.tsx`)

### Input

- Controlled text field `inputValue`; **Enter** parses a float, clamps to **[-1, 1]**, rounds to **two decimals**, then sets `correlation` and syncs the field.

### Data generation

- `generateData(correlation, n = 50)` builds points with `x ~ Uniform(0,1)` (scaled ×100 for display) and a **hand-tuned** `y` formula using `correlation`, uniform noise shaped by three `Math.random()` calls. This produces a **visual** relationship keyed off the slider; the **empirical correlation** of the sample is **not** guaranteed to equal the typed value (pedagogical approximation, not Monte Carlo calibration to *r*).

### Regression line

- `calculateRegressionLine` applies standard OLS on the current `{x, y}` cloud and returns two endpoints at **x = 0** and **x = 100** for drawing the line.

### Chart

- Axes ticks use `fill: 'transparent'` (minimal axis labeling).
- Purple scatter, red regression `Line`, `Tooltip` on hover.

### Copy

- `getCorrelationDescription` maps `correlation` (the **requested** value, not the sample statistic) to qualitative labels (weak / moderate / strong, sign).

---

## Build and deploy

### `next.config.js`

In **production** builds only, `basePath` and `assetPrefix` are set to **`/correlation-coefficient`**, matching GitHub Pages project hosting. Local `next dev` omits them (`NODE_ENV !== 'production'`).

`images.unoptimized: true` is required for static export when using `next/image` patterns.

### Scripts (`package.json`)

| Script | Role |
|--------|------|
| `npm run dev` | `next dev` |
| `npm run build` | `next build` → writes **`out/`** (static export) |
| `npm run start` | `next start` (SSR server; not used for GitHub Pages) |
| `npm run export` | `next build && next export` — **`next export` is removed in newer Next**; prefer `next build` alone when `output: 'export'` is set |
| `npm run deploy` | Local convenience: `next build` + `touch out/.nojekyll` (stops Jekyll from ignoring `_next`) |

### CI

`.github/workflows/deploy.yml` runs on **`master`**: `npm ci`, `npm run build`, `touch out/.nojekyll`, deploys **`out`** to **`gh-pages`** via `JamesIves/github-pages-deploy-action`.

---

## Embedding

- Fixed chart height **400px** inside a max-width card; test inside your iframe width.
- No `postMessage` or LMS hooks.

---

## Maintenance

- **`package.json` duplicates** `tailwindcss` under `dependencies` and `devDependencies` with different semver ranges—worth consolidating.
- To make the **sample correlation** match the input (stricter math), replace `generateData` with a proper simulation (e.g. bivariate Gaussian with target *ρ*) and optionally show both requested and sample *r*.
