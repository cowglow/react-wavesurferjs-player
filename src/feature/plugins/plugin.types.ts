import WaveSurfer from "wavesurfer.js";
import {GenericPlugin} from "wavesurfer.js/dist/base-plugin";

export interface WavesurferCustomPlugin {
    ws: WaveSurfer,
    onReady: (vaUe: boolean) => void
}

export interface ControlType {
    isDisabled: boolean
    isReady: boolean
    onChange: (value: any) => void
    value: any
}


export type WavesurferPlugins = Record<string, GenericPlugin | null>
