import WaveSurfer from "wavesurfer.js";

export interface WavesurferCustomPlugin {
    ws: WaveSurfer,
    onReady: (vaUe: boolean) => void
}

export interface ControlType {
    isReady: boolean
    isDisabled: boolean
    value: any
    onChange: (value: any) => void
}
