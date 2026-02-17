# CCDI UI Components Demo

A **Next.js 16** demo app that showcases reusable UI building blocks for CCDI (Childhood Cancer Data Initiative) products. It uses basic UI components or blocks in the [ccdi-ui-components](https://github.com/CBIIT/ccdi-ui-components) repo.

**Stack:** React 19, TypeScript, Tailwind CSS, Radix UI, Recharts.

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3006](http://localhost:3006). The home page links to each demo section.

---

## Demo Sections

| Route | Description |
|-------|-------------|
| **Home** | Landing page with links to every demo section. |
| **Header and Footer** (`/header-and-footer`) | NCI-style navbar (logo, main nav with dropdowns and multi-level submenus, responsive mobile/tablet menu) and USWDS-style footer (agency info, link groups, contact). Configurable via `header-data.ts` and `footer-data.ts`. |
| **Filter Sidebar** (`/sidebar`) | Collapsible filter categories (accordions), facet checkboxes, optional search, numeric range filter (min/max). Active Filters banner with “Clear all,” wired to the same state. |
| **Charts** (`/charts`) | Dashboard-style chart cards (Recharts): Pie, Line, Bar, Area, Horizontal Bar, and Composed (line + bar). Shared theming and card structure. |
| **Tabbed Table** (`/tabbed-table`) | Tabs: Participants, Studies, Samples, Files. Each tab has its own DataTable with sorting, pagination (e.g. 50/100 per page), column visibility, and download dropdown. |
| **Complete Demo** (`/complete-demo`) | Full experience: banner → header → program stats strip → main content (filter sidebar, Active Filters, charts, tabbed table) → footer. Used to validate layout, responsiveness, and interaction. |

---

## Repo Structure

- **`src/app`** — App Router pages and route-specific data (e.g. `header-and-footer/data/`, `charts/data/`). Each major feature has its own route so you can try it in isolation or in the Complete Demo.
- **`src/components`**
  - **`blocks/`** — Page-level pieces: header, footer, filter sidebar, active-filters banner, tabbed-table component.
  - **`ui/`** — Primitives and controls: buttons, search, banner, icons, tabs, checkboxes, accordions, selects, dropdowns, data-table helpers, etc.
  - **`charts/`** — Shared chart wrapper.
  - Supporting components: `data-table.tsx` (generic table with pagination and column visibility), `back-to-homepage.tsx`.
- **`src/lib`** — Shared utilities (e.g. `utils.ts`).

Routes and page-specific data live under `app`; reusable components and blocks live under `components`.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port **3006**. |
| `npm run build` | Production build. |
| `npm run start` | Start production server. |
| `npm run lint` | Run ESLint. |
