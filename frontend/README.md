# NeuroAI Research Platform

A React + TypeScript + Vite scientific research interface for the separate Python
motor-imagery project. Tailwind CSS supplies styling support; Recharts renders
scientific plots, Lucide supplies interface icons. No fake backend, cloud deployment,
model training, or new Python processing is performed by this front end.

## Run locally

Use Node.js 22.12+ (verified with Node 24.5.0) and npm.

```bash
cd /Users/morganbrown/neuroai-motor-imagery/frontend
npm ci
npm run dev -- --port 5173
```

Open http://127.0.0.1:5173/explore. Vite prints the exact URL; if that port is occupied
it may choose the next available port. To build: `npm run build`.
To open in VS Code: `code /Users/morganbrown/neuroai-motor-imagery/frontend`.

## Structure

```text
src/
  assets/          # local artwork, branding, backgrounds, empty-state icons
  charts/          # reusable Recharts and SVG scientific visualizations
  components/      # cards, navigation, controls, tables, experiment/prediction UI
  data/mock/       # all synthetic scientific datasets and demo research records
  features/        # assembled signal-analysis and results panels
  hooks/           # shared research-selection/data context
  layouts/         # persistent application layout
  pages/           # eight route-level views
  services/api/    # mock/live API abstraction
  types/           # scientific TypeScript interfaces
  utils/           # formatting helpers
```

Routes: `/explore`, `/data`, `/preprocess`, `/models`, `/visualizations`, `/results`,
`/research`, `/export`. Root redirects to Explore. The sidebar links to page sections.
A production static host will need an SPA fallback to index.html for direct routes.

## Demonstration provenance

Every generated signal, epoch, PSD, map, CSP pattern, model prediction, metric,
comparison and ROC point is **UI demonstration data**, not a scientific finding.
Signals are deterministic rhythm mixtures, not EDF recordings or MNE-filtered output.
Changing subject/run and pressing Load Data updates the shared selection and synthetic
signal fixtures. Condition filters signal/PSD/epoch/map displays. Classifier results
remain fixed illustrative examples. No classifier is fitted by the interface.

`src/data/mock/` includes `mockEEG.ts`, `mockEpochs.ts`, `mockPSD.ts`,
`mockTopography.ts`, `mockCSP.ts`, `mockMetrics.ts`, `mockResearch.ts`.
Charts receive typed data through services and contain no embedded scientific mock
fixtures. CSP component transformations are display-only. Coordinates and interpolation
are illustrative, not individual anatomy or anatomical source localization.
The mock PSD/ROC/metrics are independent fixtures, not computed from EEG. The requested
metric values are not all derivable from the requested confusion counts; the UI
explicitly discloses this. Mu display shading uses 8–12 Hz as requested; the Python
feature definition is 8–13 Hz and must be reconciled before a measured analysis.
The epoch display is −1 to +1 s; the backend protocol remains 1–4 s.

Preprocessing controls validate a configuration and report that no EEG was processed.
Model controls validate folds/seed and add a configuration-preview history entry,
without claiming training. Exports and research-summary actions are disabled until
measured backend artifacts exist. Research notes save in browser localStorage;
new demo experiments live only in memory for this session and reset on reload.
No user text is executed or injected as HTML.

## Visual assets

Local, optimized supporting artwork in `src/assets/neuroscience/`:

- `neuroai-hero.webp` (1672×941; about 159 KiB)
- `ai-neuroscience-bridge.webp` (1672×941; about 92 KiB)
- `neural-network-background.webp` (1672×941; about 121 KiB)

These were generated using built-in image_gen and optimized to WebP; no stock photos
or remote image hotlinks. `src/assets/generation-prompts.json` stores the prompts.
The SVG waveform and original circuit/brain mark are in `backgrounds/` and `branding/`.
Scalp maps remain application-generated data visualizations. Artwork is conceptual
and must not be interpreted as measured neural activation. The Downloads dashboard
image was used as aesthetic inspiration, not incorporated into the application.

## Future Python API boundary

All backend access goes through `src/services/api/`. `client.ts` selects mock mode
by default. Copy `.env.example` to `.env.local`, configure `VITE_API_MODE=live` and
`VITE_API_BASE_URL=http://127.0.0.1:8000/api`, then restart Vite **after** implementing
and verifying the contracts. HTTP errors are surfaced, never silently replaced with
mock data. Vite environment variables are public client configuration, never secrets.
Current demo labels remain conservative in live mode; provenance-aware rendering
must be completed before claiming measured outputs. `demo` fields are placeholders
for explicit response provenance, not a security guarantee.

| Service | Proposed endpoint |
| --- | --- |
| datasetService | GET /api/datasets; GET /api/subjects?dataset=eegmmidb |
| eegService | GET /api/eeg/{subject}/{run}?condition=left-right |
| preprocessingService | POST /api/preprocess |
| modelService | POST /api/models/train; POST /api/models/predict; GET /api/results/{experimentId} |
| experimentService | GET /api/experiments; POST /api/experiments |

Response interfaces are in `src/types/scientific.ts` and `modelService.ts`. The EEG
endpoint currently expects an assembled DashboardData response, including raw/filtered
traces, epochs, events, PSD, topography and CSP. For real incremental work, split these
into artifact endpoints with explicit unavailable states rather than generating fake
CSP/results when the pipeline has not produced them.

## Backend connection TODOs

1. Build a Python API around the verified MNE modules without changing scientific scope.
2. Define runtime-validated response schemas with units, channel ordering, event labels,
   sampling rate, subject/run IDs, montage/reference, parameters and artifact provenance.
3. Return recorded EEG in µV for plots, PSD in µV²/Hz, and actual event/epoch metadata;
   do not display all 64 channels if only five previews have been supplied.
4. Separate demo and measured artifacts with explicit per-response provenance. Remove
   fixed 87% fallback predictions and fixed filter labels when connecting real data.
5. Return unavailable states for models, CSP and results until a formal experiment
   produces them; compute internally consistent metrics/ROC from held-out predictions.
6. Implement run-aware validation, fold-local CSP/scaling and training-job status only
   after a prespecified experiment. Confidence needs explicit meaning/calibration.
7. Connect real research documents/logs, persist experiments/notes, and enable exports
   with hashes, software versions, protocol and validation metadata.
8. Configure local CORS and error/time-out/cancellation handling for long-running jobs.
9. Add API-contract checks and integration tests when these real endpoints exist.

The interface optionally registers a `load_neuroai_preview` WebMCP tool when the browser
supports that proposed API. It uses the same load action and validates selection input.
Supported-context registration/execution validation was unavailable in this session;
ordinary UI controls are the supported, verified interaction path.
