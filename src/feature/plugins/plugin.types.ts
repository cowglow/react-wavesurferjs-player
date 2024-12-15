import WaveSurfer from "wavesurfer.js";

export interface WavesurferCustomPlugin {
    ws: WaveSurfer,
    onReady: (vaUe: boolean) => void
}
