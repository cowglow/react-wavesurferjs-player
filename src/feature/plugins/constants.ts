import colormap from "colormap";

export const WAVE_COLOR = [
    'rgb(255, 0, 0)',   // red
    'rgb(255, 127, 0)', // orange
    'rgb(255, 255, 0)', // yellow
    'rgb(127, 191, 0)', // lime
    'rgb(0, 128, 0)',   // green
]
export const PROGRESS_COLOR = [
    'rgb(0, 128, 0)',   // green
    'rgb(127, 191, 0)', // lime
    'rgb(255, 255, 0)', // yellow
    'rgb(255, 127, 0)', // orange
    'rgb(255, 0, 0)',   // red
]
export const CURSOR_COLOR = "#4353FF"
export const COLOR_MAP = colormap({
    colormap: [
        {index: 0, rgb: [255, 255, 255]},   // white
        {index: 0.33, rgb: [255, 0, 0]},    // red
        {index: 0.66, rgb: [255, 255, 0]},  // yellow
        {index: 1, rgb: [0, 128, 0]}        // green
    ],
    nshades: 256,
    format: "float",
})

export const AUDIO_FILE_PATH = `${import.meta.env.BASE_URL}/155735-HUTCH-HD-SFX-2014-0059.mp3`
export const AUDIO_FILE_SAMPLE_RATE = 44100
export const DEFAULT_ZOOM_MIN = 1
export const DEFAULT_ZOOM_MAX = 100
