import {WaveSurferOptions} from "wavesurfer.js";
import {
    AUDIO_FILE_PATH,
    AUDIO_FILE_SAMPLE_RATE,
    CURSOR_COLOR,
    DEFAULT_ZOOM_MAX,
    PROGRESS_COLOR,
    WAVE_COLOR
} from "./constants.ts";

export const audioPlayerOptions: Partial<WaveSurferOptions> = {
    height: 90,
    autoScroll: true,
    cursorColor: CURSOR_COLOR,
    minPxPerSec: DEFAULT_ZOOM_MAX,
    backend: 'MediaElement',
    normalize: true,
    progressColor: PROGRESS_COLOR,
    waveColor: WAVE_COLOR,
    cursorWidth: 3,

    barAlign: "bottom",
    barGap: 1,
    barHeight: 1,
    barRadius: 3,
    barWidth: 3,

    autoCenter: true,
    fillParent: true,
    hideScrollbar: false,
    mediaControls: false,
    sampleRate: AUDIO_FILE_SAMPLE_RATE,
    url: AUDIO_FILE_PATH,
}