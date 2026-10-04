# One of Moe’s Research Projects

Complete silent Remotion video: `MoeNeuroAIResearchTikTok`, 1080×1920, 30 FPS, 1800 frames / 60 seconds. Eleven scenes with dashboard colors, local branding, deterministic animated scientific graphics. No music, narration, or synthesized speech.

From the project root:

```bash
cd video
npm ci
npm run preview
npm run typecheck
npm run render
```

Studio: http://localhost:3001. Output: `../out/moe-neuroai-research-tiktok.mp4`.
The render script uses H.264. CLI reference: https://www.remotion.dev/docs/cli/render.

## Add your recorded voiceover

Put the file at `video/public/audio/voiceover.mp3` (relative to the repository root).
Run from `video/`:

```bash
npm run render -- --props=voiceover-props.json
```

`voiceover-props.json` enables the recording. `voiceoverStartFrame` delays it (30 frames = 1 second). In Studio, change `voiceoverSrc` to `audio/voiceover.mp3` in composition props to preview audio. Default props use null, so the silent composition never requests a missing audio file.

## Timing after recording

Edit `src/video/data/timing.ts`. Each scene has a duration in seconds; sequence starts and total composition duration update automatically. Current boundaries:

| Scene | Seconds |
|---|---|
| Hook | 0–4 |
| Background / bridge | 4–9 |
| Research question | 9–15 |
| EEG | 15–20 |
| Preprocessing | 20–28 |
| Left vs right | 28–34 |
| Machine learning | 34–39 |
| Beyond accuracy | 39–46 |
| Explainability | 46–52 |
| Platform | 52–57 |
| Outro | 57–60 |

The supplied voiceover is approximately 290 words; a natural recording may exceed 60 seconds. Record and measure first, then either shorten the script for the 60-second cut or extend scene durations. No audio has been generated. Local animations use scene-relative frames, so longer scenes retain their established visuals. Keep scenes at least 3 seconds to allow staggered reveals to finish. Audio beyond the composition end is trimmed by the export; increase scene durations if needed.

## Optional captions

Add `{startFrame, endFrame, text}` entries to `src/video/data/captions.ts` using global video frames, with end exclusive. Set `showCaptions` to true in Studio props or voiceover-props.json. Keep each cue to two short lines. Captions are off and empty by default. Caption panel begins at y=1390; its height depends on text. Keep cues concise and check the preview for overlap with lower scene text. `showSafeGuides` enables the critical-content safe rectangle for editing; turn off for export.

## Connect real scientific outputs

Mock inputs live in `src/video/data/mockEEG.ts` and `mockMetrics.ts`. Charts live in `src/video/components/Charts.tsx`; scenes in `src/video/scenes/Scenes.tsx`.

Export verified Python artifacts to JSON with subject/run IDs, channel order, units, sampling rate, preprocessing settings and provenance. Replace `signal()` with fixed downsampled voltage arrays (µV), `psd` with actual condition PSD values (µV²/Hz), and trial schematics with measured epoch samples. Update chart scaling and axes to reflect those units. Use actual electrode coordinates / measured scalp values instead of radial gradients for measured topography.

CSP, importance, metrics, confusion counts and predictions must stay illustrative until a run-aware held-out experiment produces them. Replace them together with consistent results from one evaluation; feature bars must reflect a defined analysis, not raw arbitrary CSP weights. Retain visible provenance and remove demo labels only for individually verified panels. Model evaluation and cross-subject generalization remain planned in the current project.

The platform reveal uses the supplied IMG_1303.png and IMG_9179.png screenshots, copied from Downloads into public/assets. Both appear together with a subtle vertical pan. Their scientific panels are demo data; the scene labels them accordingly. It does not connect to a backend or claim measured model performance.

## Layout and reproducibility

Critical content uses x=84–900 and y=190–1530. Reserved areas accommodate upper UI, right controls and lower app overlays. Typeface uses the dashboard's Inter/Arial/system sans-serif stack; rendering is deterministic on the same environment, while installed font differences can change wrapping on another computer. Reused project assets are local in public/assets. Dependencies are captured in package-lock.json. Scientific visuals use deterministic functions, no random frame state or remote assets.

## Secondary AI voice
See [AI-VOICE.md](AI-VOICE.md) for OpenAI TTS generation, conservative FFmpeg processing, eleven announcement clips, optional human narration and ducking. Generation requires your local OPENAI_API_KEY; no final speech assets exist until it is supplied.
