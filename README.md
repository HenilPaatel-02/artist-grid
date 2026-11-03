# ArtistGrid

**Turn a photo into a drawing-ready grid.**

ArtistGrid is a mobile-first drawing reference tool for artists who transfer an image onto paper, canvas, or another physical surface. It calculates a practical grid from the chosen surface and reference image, previews the result, and helps the artist save or export a reusable project.

> **Project status:** MVP in development. This report describes the current workspace and a realistic, tightly scoped three-day MVP plan; it is not a claim that the app is production-ready.

## Product report

### The problem

Artists often need to reproduce a reference at a different size. Estimating proportions by eye is difficult, while manually laying out a consistent grid takes time and can introduce measurement errors.

### The proposed value

ArtistGrid turns that process into a guided workflow:

1. Select a reference image.
2. Choose the drawing surface and its dimensions.
3. Set the number of grid rows and columns.
4. Adjust image and grid appearance.
5. Preview, save, and export the reference.

The core promise is **a clear, correctly measured transfer guide without leaving the phone**.

### Intended audience

- Beginners learning the traditional grid drawing method.
- Illustrators and painters scaling references onto paper or canvas.
- Muralists and other artists who need to transfer a composition to a larger surface.

The best initial audience is artists already using the square-grid method. Avoid broadening the MVP to a general-purpose art editor.

## Current functionality

The following inventory is based on the source currently in this workspace. Some files have local, uncommitted changes, so confirm the intended release version before shipping.

### Implemented or represented in the current code

- **Image selection:** choose a gallery image, preview it, replace it, or remove it.
- **Drawing surface:** A5–A1 paper presets and portrait/landscape selection, with measurement and conversion utilities.
- **Grid calculation:** calculate rows and columns for a millimetre-based surface, validate settings, and report cell dimensions.
- **Grid preview:** render the reference and grid using React Native Skia.
- **Grid styling:** toggle the grid and labels; adjust opacity, stroke width, label size, and preset colors.
- **Image effects:** brightness, contrast, saturation, grayscale, and opacity controls.
- **Local projects:** create, update, list, open, and delete projects using AsyncStorage; copy project images into app-managed storage.
- **Draft recovery:** debounce autosave and offer recovery of an unfinished project.
- **Export workflow in the current workspace:** configure image/grid content, labels, background, and output size; capture a PNG, then save it to the photo library or share it.

### Gaps and release caveats

- **Fit-grid mode is not implemented.** The calculation utility explicitly throws for this mode; do not present it as a working option.
- **Doodle grids are not implemented.** They are mentioned in the original product description but no working doodle-grid workflow was found in the current source.
- **Custom surface dimensions are a placeholder.** Selecting “Custom” displays a notice; there are no dimension-entry fields yet.
- The grid settings screen currently exposes row and column counts. Do not claim every calculation mode is available in the UI.
- No backend, account system, cloud backup, or cross-device synchronization is present. Projects are local to the device.
- The editor is a long, vertically stacked form. It can feel dense and makes the main preview/export action harder to discover.
- The export canvas/settings are present in local workspace changes; verify their behavior on supported devices before treating export as release-ready.
- There are utility/repository tests, but no end-to-end user-flow suite was identified.
- The project has Expo start, platform, lint, and Jest scripts; a production build/release pipeline is not documented here.

## MVP definition

### MVP outcome

A new user can pick an image, configure a physical drawing surface, generate an accurate grid, see a useful preview, save the project locally, reopen it, and export/share the finished reference without data loss.

### Must work for launch

1. **Onboarding-free start:** a clear home screen with one primary “Create a grid” action and a route to saved projects.
2. **Reliable setup:** image selection, surface dimensions/orientation, and valid row/column settings with inline errors.
3. **Live, legible preview:** image and grid update consistently with the selected settings.
4. **Trustworthy measurements:** show the surface size, grid count, cell dimensions, and units together.
5. **Persistence:** save, reopen, update, and delete a project; recover an interrupted draft.
6. **Useful output:** export a readable PNG and offer gallery save/share with clear permission and failure states.
7. **Release hygiene:** test the full journey on at least one iOS and one Android target (or clearly state which platforms were validated), handle empty/loading/error states, and verify no user image is lost on save/update.

### Explicitly defer

To keep three days achievable, defer doodle-grid generation, cloud accounts/sync, collaboration, social/community features, advanced image editing, paid plans, and complex multi-export templates. Do not attempt a full redesign and major feature expansion at the same time.

## Three-day execution plan

This schedule assumes a working development environment, the current core code, one decision-maker, and no store-review submission deadline. It is an aggressive implementation target—not a guarantee of production readiness.

### Day 1 — Lock scope and finish the core loop

- Agree on the MVP acceptance criteria and supported platforms.
- Walk the fresh-install flow: create image → surface → grid → preview → save → reopen.
- Fix blockers in grid validation, surface sizing, autosave/recovery, and project image persistence.
- Remove, hide, or clearly mark unfinished options such as fit mode and doodle grids.
- Make the preview update predictably when inputs change.

**Day 1 exit check:** a valid project can be created, saved, closed/reopened, and remains correct.

### Day 2 — Make the workflow obvious and complete output

- Restructure the editor into a short, staged flow (see UX proposal below).
- Put the preview and key measurements near the top-level decision points.
- Finish export PNG capture, file writing, save-to-gallery permissions, and native share behavior on target devices.
- Add empty, loading, saving, success, and failure feedback; prevent accidental duplicate actions.
- Verify draft recovery and export behavior with realistic large images.

**Day 2 exit check:** a first-time user can reach a usable exported drawing guide without coaching.

### Day 3 — Validate, polish, and release-candidate

- Run utility/repository tests and lint; fix regressions caused by the MVP work.
- Exercise the complete happy path plus cancel image selection, invalid grid values, app interruption, denied photo permission, and export failure.
- Test at representative small and large screen sizes and on the chosen iOS/Android targets.
- Check accessibility labels, touch targets, text contrast, keyboard behavior, and scroll/focus behavior.
- Freeze scope; fix launch-blocking defects only; document known limitations and the tested build.

**Day 3 exit check:** release candidate passes the agreed acceptance checklist with no known data-loss or unusable-export issue.

## UI/UX direction: “The Artist’s Light Table”

### Distinctive product idea

Make ArtistGrid feel like a calm studio tool rather than a settings form: a warm, paper-like workspace with a precise, high-contrast grid overlay. The visual signature is an **“on the light table” preview**—the selected reference sits on a soft paper card, while the grid stays crisp and legible.

### Suggested visual language

- **Canvas:** warm ivory / paper neutral for the app background; pure white reserved for the export preview when selected.
- **Ink:** deep charcoal for text and strong grid visibility.
- **Accent:** one energetic pigment color (for example, ultramarine or teal) for primary actions and selected controls; use it consistently rather than coloring every button.
- **Materials:** subtle paper-card surfaces and thin borders. Avoid skeuomorphic textures that reduce contrast or compete with the reference image.
- **Typography:** expressive but restrained display treatment for screen titles; highly readable numeric text for measurements and grid controls.
- **Motion:** brief, purposeful transitions when switching steps or changing grid density; respect reduced-motion preferences.

Keep the palette and type choices centralized in design tokens before applying them across screens.

### Proposed navigation and editor flow

**Home**

- Replace the two-button-only landing page with a welcoming “Studio” dashboard.
- One prominent **Create a grid** action.
- A compact “Continue draft” card when a draft exists.
- A small recent-project row with thumbnails and “View all”.
- Keep project management visible but secondary to the main creation task.

**Create flow**

1. **Reference** — select an image; show a crop/orientation-aware preview and replace action.
2. **Surface** — choose a paper preset or custom dimensions; pick portrait/landscape; state the unit clearly.
3. **Grid** — set rows/columns with stepper controls or direct numeric entry; show a live cell-size summary and validation next to the inputs.
4. **Preview & export** — make the image/grid the hero; use collapsible “Image” and “Grid” controls; make export the persistent primary action.

For a three-day MVP, these can remain in one route with clear numbered sections rather than introducing a full navigation rewrite. Preserve form values when users move backward.

### High-impact interaction improvements

- **Show, don’t explain:** update the preview as grid values or styling change; remove “Calculate” as a required extra step if safe and predictable.
- **Use meaningful control names:** stepper buttons for rows/columns, labeled values for sliders, and selected-state styling for swatches.
- **Keep measurements together:** e.g. “A4 · Landscape · 297 × 210 mm” and “8 × 10 cells · 37.1 × 21.0 mm each.” Clearly label whether dimensions describe the surface or a cell.
- **Make export obvious:** preview the actual export settings and show an explicit completion state with Save and Share actions.
- **Protect user work:** persist a draft quietly, indicate “Saved just now” in a low-noise way, and make recovery/discard choices understandable.
- **Design all states:** empty projects, no image, image loading, invalid dimensions, no grid yet, saving, export in progress, permission denied, and recoverable errors.
- **Accessibility:** minimum comfortable touch targets, labels/roles/states, screen-reader-friendly measurement summaries, scalable text, and contrast-tested grid controls.

### Creative differentiators to consider after MVP

Prioritize these only after the core transfer workflow is reliable:

- **Cell-size-first setup:** let an artist choose a desired real-world cell width and clearly explain any remainder/margins. The calculation utility has a cell-size path, but it should not be advertised until its UI and output behavior are complete.
- **Transfer mode:** numbered rows and lettered columns, with a high-contrast print layout and a “start here” indicator.
- **Studio presets:** saved combinations such as “Portrait study,” “Canvas prep,” or “High contrast reference,” each clearly editable.
- **Print-ready export:** page size, margins, and print scaling only after output dimensions and device print behavior are validated.
- **Doodle-grid mode:** a separate, deliberately scoped workflow with a visual explanation; not just another toggle in the square-grid editor.

## Technical overview

### Stack

- React Native 0.81, React 19, and Expo SDK 54
- TypeScript
- Expo Router for file-based routes
- React Native Skia for grid/image canvas rendering
- AsyncStorage for local project and draft data
- Expo Image Picker, File System, Media Library, and Sharing for image selection and output
- Jest with `jest-expo`; ESLint through Expo

### Structure

```text
app/                         Expo Router screens and root layout
src/components/ui/           Shared app-level UI components
src/constants/               Shared design constants
src/features/
  drawing-surface/           Paper sizes, orientation, dimensions, unit conversion
  export/                    Export settings/types
  grid/                      Grid calculation, validation, styling, Skia canvas
  image-effects/             Reference image adjustment models and utilities
  image-orientation/         Image orientation helpers
  image-picker/              Gallery image selection
  project/                   Project model, local persistence, image storage, drafts
```

### Local development

Requirements: Node.js/npm and an Expo-compatible development target (Expo Go or a configured native build).

```bash
npm install
npm start
```

Useful commands:

```bash
npm run android
npm run ios
npm run web
npm run lint
npm test -- --runInBand
```

Platform availability depends on the native APIs and current app configuration; validate on actual target devices before release.

## Product and engineering priorities

| Priority | Improvement | Why it matters | MVP decision |
|---|---|---|---|
| P0 | Verify create → save → reopen → export end-to-end | This is the product’s core promise | Ship only when reliable |
| P0 | Remove/hide unimplemented modes and correct feature claims | Prevents user confusion and dead ends | Required |
| P0 | Validate image persistence, draft recovery, and failure states | Protects user work | Required |
| P1 | Rework the long editor into a clear, progressive flow | Reduces cognitive load and abandonment | Lightweight version in MVP |
| P1 | Improve project cards with thumbnails, dimensions, and clear actions | Makes saved work recognizable | If time permits |
| P1 | Improve control accessibility and live feedback | Makes the tool usable and trustworthy | Required for key controls |
| P2 | Print-ready layout and saved presets | Adds workflow value but expands scope | Defer unless core is complete |
| P3 | Cloud sync, accounts, collaboration, doodle-grid mode | Significant product/backend scope | Defer |

## MVP success measures

Track these in a small manual beta before adding analytics:

- A first-time tester can export a valid guide without help.
- A saved project reopens with the same image, surface, grid, and style.
- Grid and cell measurements match the selected dimensions within the expected rounding tolerance.
- Exported output matches the chosen content, labels, background, and size settings.
- No reproducible user-image loss, draft loss, or app-blocking failure in the test checklist.
- Record where testers hesitate or abandon; prioritize the largest workflow friction before adding features.

## Known limitations and next decisions

- Confirm target platforms and whether the first release is a private beta or public store launch.
- Confirm if “three days” means a clickable prototype, a tested mobile MVP, or a store-submittable release; store review and signing are outside this repository’s demonstrated setup.
- Decide the product policy for custom surfaces, grid margins/remainders, and output page sizing before exposing advanced modes.
- Decide whether local-only projects are sufficient for the first release and communicate that projects do not sync across devices.
- Audit permissions, image sizes/memory behavior, and export quality on real devices.

---

ArtistGrid should win by being **the fastest, clearest path from reference photo to measurable drawing guide**. Protect that promise: make the grid accurate, the preview understandable, and saved work dependable before expanding into a broader artist toolkit.
