## What

<!-- One or two sentences. Link the backlog item: BACKLOG.md #ID -->

## Why

## How

<!-- Main files touched and the approach. Note anything reused from global/. -->

## Screenshots

<!-- Before / after for any UI change, desktop and phone width. -->

## Checklist

- [ ] `npm run lint` and `npx tsc --noEmit` pass
- [ ] No file over ~150 lines; one component per file
- [ ] Mutations go through a server action; no Supabase calls outside `global/data/`
- [ ] No repeated code; existing `global/` pieces reused
- [ ] Colors from theme variables only
- [ ] JSDoc on every new export

### Accessibility

- [ ] Real elements (`button`, `a`, `label`, …); keyboard reachable
- [ ] Labels on all inputs; `aria-label` on icon-only buttons
- [ ] Visible focus styles
- [ ] Contrast checked on glass
- [ ] Status is not color-only
