#!/bin/sh
set -eu
TASK_VIDEO_DIR=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TASK_PYTHON=${AI_VOICE_PYTHON:-"$TASK_VIDEO_DIR/../.venv/bin/python"}
"$TASK_PYTHON" "$TASK_VIDEO_DIR/scripts/ai-voice.py" process
"$TASK_PYTHON" "$TASK_VIDEO_DIR/scripts/ai-voice.py" mix
