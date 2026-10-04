# Secondary AI announcements

The visuals remain intact. The AI voice is a separate Remotion track, disabled in the original silent render. No primary narration is replaced.

## Current status

The initial environment has no OPENAI_API_KEY. No real raw TTS clips, processed speech, AI-voice MP4 or voice-only WAV can be created until a credential or provider-generated raw WAVs are supplied. No browser speech or substitute voice is used. Temporary test tones are used only for pipeline verification, never final assets.

## Generate and render

From the repository root, install the processing dependency if needed:

```bash
.venv/bin/python -m pip install -r video/scripts/ai-voice-requirements.txt
cd video
```

Create `video/.env` locally from `.env.example` and set OPENAI_API_KEY, or export it in your shell. The Python script loads .env server-side; the file is ignored by Git. Never put keys in React source, public/, VITE_ variables or chat. TTS uses OpenAI's speech endpoint, WAV output, gpt-4o-mini-tts, onyx, speed 0.9 and restrained AI voice instructions. Requests are made only by ai:generate / ai:build, never Studio or rendering.

```bash
npm run ai:build
npm run ai:verify
npm run preview
npm run render:ai
```

`ai:build` generates eleven clips, processes them, validates their timing and mixes the AI-only timeline. `render:ai` validates again before rendering `MoeNeuroAIResearchTikTok` with ai-voice-props.json. The final output is `out/moe-neuroai-research-ai-voice.mp4`; the AI-only timeline is `out/neuroai-ai-voice-track.wav`. Both paths are relative to the repository root.

If actual speech runs longer than the allocated gaps, verification reports the conflicting clips. Adjust startFrame in aiVoice.config.json or scene lengths in timing.ts; rerun ai:process. Long lines are not automatically sped up, truncated or overlapped. The closing line starts at 56 seconds to allow it to carry into the 57-second outro; move it later only if measured duration fits. If all announcements cannot fit naturally into 60 seconds, extend the relevant scenes.

To supply clips from another provider, place correctly named PCM16 WAV files in raw/, then run `npm run ai:process` and `npm run render:ai`. ai:process needs no API key. No proprietary SDK is required.

## Files

All audio paths below are inside `video/public/audio/ai/`. Every ID has BOTH `raw/<id>.wav` and `processed/<id>.wav`:

| ID | Spoken line | Start seconds |
|---|---|---|
| research-project-001 | Research Project Zero Zero One. | 0 |
| neuroai-protocol | NeuroAI research protocol initiated. | 4 |
| eeg-analysis | Analyzing EEG motor imagery. | 15 |
| left-right-comparison | Comparing left-hand and right-hand neural activity. | 28 |
| preprocessing-complete | Signal preprocessing complete. | 21 |
| feature-extraction | Feature extraction initiated. | 25 |
| machine-learning-online | Machine learning analysis online. | 34 |
| accuracy-question | Accuracy is not the final question. | 39 |
| explainability | Explainability analysis initiated. | 46 |
| generalization | Cross-subject generalization remains under investigation. | 49 |
| research-in-progress | Research Project Zero Zero One. In progress. | 56 |

`src/video/data/aiVoice.ts` exports the requested manifest (text, rawFile, processedFile, startFrame, volume), plus measured durationInFrames from aiVoice.generated.json. Edit aiVoice.config.json, not generated metadata. Readiness is invalidated if configuration changes.

## Voice, pitch, processing, volume and timing

- **Voice:** change voice, speed or instructions in aiVoice.config.json, or set OPENAI_TTS_VOICE / OPENAI_TTS_MODEL in .env. Run `npm run ai:generate -- --force`, then ai:process. Existing raw files are reused unless --force is supplied.
- **Pitch:** processing.pitchSemitones defaults to −0.65; zero disables pitch lowering. FFmpeg compensates tempo after the pitch shift.
- **Processing:** settings include bassGainDb, clarityGainDb, reverbMix and targetLUFS. The reusable implementation is scripts/ai-voice.py, with scripts/process-ai-voice.sh as a convenient entry point. It adds a high-pass filter, gentle 2:1 compression, tiny 24 ms ambience, −18 LUFS normalization and a conservative limiter. Processed files are 48 kHz PCM16 stereo. Raw speech is preserved separately. Set FFMPEG_PATH to use your own full binary; Remotion's reduced FFmpeg does not include the required EQ/compression filters.
- **Volume:** each clip's volume defaults to 0.8 in config. aiVoiceVolume in ai-voice-props.json multiplies the whole track; humanVoiceVolume controls your recording independently. aiVoiceVariant selects raw or processed.
- **Timing:** startFrame is global, 30 frames per second. Scene lengths are in timing.ts. Clip positions do not move automatically when scenes change: update both and rerun ai:process to validate / rebuild the combined WAV.

## Human narration and ducking

Put your recording at `video/public/audio/voiceover/moe-voiceover.wav`. Set voiceoverSrc to `audio/voiceover/moe-voiceover.wav` in ai-voice-props.json. The older audio/voiceover.mp3 input remains supported through normal props.

Edit humanSpeechWindows in src/video/data/aiVoice.ts with GLOBAL timeline speech intervals (end inclusive). AudioDucking.tsx smoothly reduces AI gain to 22% while human speech is active. Without annotated windows, AI gain is conservatively reduced to 42% of its configured level whenever a human voiceover is supplied. Your voice is never ducked by default. Listening and timing review are still necessary: gain reduction cannot make simultaneous words fully intelligible.

Record pauses for announcements, or move announcements into existing pauses; the code does not cut your narration or invent gaps. Captions remain optional. No music or sci-fi effects are added. The render mixes tracks only at export; source WAVs and controls stay separate.

## Research context and disclosure

The exact requested announcements describe a DEMO workflow, not verified classification success. A visible 'SYNTHETIC AI VOICE · DEMO WORKFLOW' disclosure appears when AI voice is enabled. Existing demo labels remain on scientific panels. In particular, 'machine learning analysis online' is a system-style cue over a planned model phase, not a claim a model has been fitted.

Official API reference: https://developers.openai.com/api/docs/guides/text-to-speech

## Verification

```bash
npm run typecheck
npm run ai:test
npm run ai:test-render
../.venv/bin/python scripts/test_ai_voice.py
npm run ai:verify
```

The offline tests process temporary tones, create an eleven-input 60-second WAV and check missing/overlapping/out-of-bounds timing guards. They cannot assess speech quality. ai:verify checks real file availability, PCM duration, processing provenance, overlap and video bounds. Listen to both real raw and processed clips in Studio before publishing.

The short Remotion test-tone export is `out/verification/ai-audio-test.mp4`. It verifies the real AIVoiceClip component, Sequence placement, volume callback and AAC export. It is explicitly a test, not an AI voice video.
