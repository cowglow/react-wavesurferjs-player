import {Box, Button, CircularProgress, Paper, styled, ToggleButton, Typography} from "@mui/material";
import WaveSurfer, {WaveSurferOptions} from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";
import RewindIcon from '@mui/icons-material/FastRewindRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import PlayIcon from '@mui/icons-material/PlayArrowRounded';
import ForwardIcon from '@mui/icons-material/FastForwardRounded';
import {useEffect, useState} from "react";
import {
    AUDIO_FILE_PATH,
    AUDIO_FILE_SAMPLE_RATE,
    CURSOR_COLOR,
    DEFAULT_ZOOM_MAX,
    DEFAULT_ZOOM_MIN,
    PROGRESS_COLOR,
    WAVE_COLOR
} from "./plugins/constants.ts";
import SpectrogramIcon from '@mui/icons-material/WaterfallChartRounded';
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import {ZoomControl} from "./ZoomControl.tsx";
import {GenericPlugin} from "wavesurfer.js/dist/base-plugin";

const WavesurferWrapper = styled(Paper)`
    max-width: 800px;
    margin: ${({theme}) => theme.spacing(1)} auto;
    border: thin solid ${({theme}) => theme.palette.common.black};
    display: flex;
    flex-direction: column;
    gap: ${({theme}) => theme.spacing(1)};
`
const WavesurferFooter = styled(Box)`
    display: flex;
    justify-content: space-between;
    gap: ${({theme}) => theme.spacing(1)};
    padding: ${({theme}) => theme.spacing(1)};
`

export default function AudioPlayer() {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
    const [wavesurferPlugins, setWavesurferPlugins] = useState<Record<string, GenericPlugin>>({})

    // Timeline
    const [readyTimeline, setReadyTimeline] = useState(false)
    // Spectrogram
    const [showSpectrogram, setShowSpectrogram] = useState(false)
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX);

    const createInstance = (ws: WaveSurfer) => {
        console.log("Create Instance!")
        if (!wavesurfer) setWavesurfer(ws)
        // Plugins
        const spectrogram = createSpectrogramPluginInstance({ws, onReady: setReadySpectrogram})
        const timeline = createTimelinePluginInstance({ws, onReady: setReadyTimeline})
        const newWavesurferPlugins = {...wavesurferPlugins, spectrogram, timeline}
        setWavesurferPlugins(newWavesurferPlugins)
    }

    const pluginKeys = Object.keys(wavesurferPlugins)

    const toggleSpectrogram = async () => {
        if (!wavesurfer) return
        if (pluginKeys.includes("spectrogram")) {
            // remove the old own
            setWavesurferPlugins(prevState => {
                delete prevState["spectrogram"]
                return prevState
            })
            setShowSpectrogram(false)
        } else {
            // add the new one
            const spectrogram = createSpectrogramPluginInstance({ws: wavesurfer, onReady: setReadySpectrogram})
            setWavesurferPlugins(prevState => ({...prevState, spectrogram} as Record<string, GenericPlugin>))
            setShowSpectrogram(true)
        }
    }

    const playerOptions: Partial<WaveSurferOptions> = {
        height: 90,
        autoScroll: true,
        cursorColor: CURSOR_COLOR,
        minPxPerSec: DEFAULT_ZOOM_MAX,
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

    // Register Plugin by effect
    useEffect(() => {
        // Create the Plugins
        Object.values(wavesurferPlugins).forEach(plugin => wavesurfer?.registerPlugin(plugin))
    }, [wavesurferPlugins]);

    // State Changes should execute action on the wavesurfer instance
    useEffect(() => {
        wavesurfer?.zoom(Number(zoom))
    }, [zoom]);

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer
                {...playerOptions}
                onReady={createInstance}
            />
            <WavesurferFooter>
                <Box display="flex" gap={1}>
                    <Button variant="contained" onClick={() => wavesurfer?.skip(-2)}><RewindIcon/></Button>
                    <Button variant="contained" onClick={() => wavesurfer?.playPause()}>
                        {!wavesurfer?.isPlaying() ? <PlayIcon/> : <PauseIcon/>}
                    </Button>
                    <Button variant="contained" onClick={() => wavesurfer?.skip(2)}><ForwardIcon/></Button>
                    <Typography>{wavesurfer ? new Date(wavesurfer?.getCurrentTime() * 1000).toLocaleTimeString() : "..."}</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    {!readySpectrogram
                        ? <CircularProgress/>
                        : <ToggleButton
                            value="showSpectrogram"
                            selected={showSpectrogram}
                            onClick={toggleSpectrogram}
                        >
                            <SpectrogramIcon/>
                        </ToggleButton>
                    }
                    <ZoomControl
                        value={zoom}
                        isReady={readyTimeline}
                        max={DEFAULT_ZOOM_MAX}
                        min={DEFAULT_ZOOM_MIN}
                        onChange={setZoom}
                    />
                </Box>
            </WavesurferFooter>
            <Box display="flex" padding={5} alignItems="center" overflow="auto">
                <pre>{
                    JSON.stringify({
                        isPlaying: wavesurfer?.isPlaying(),
                        showSpectrogram,
                        readyTimeline,
                        readySpectrogram,
                        zoom
                    }, null, 2)
                }</pre>
            </Box>
        </WavesurferWrapper>
    );
}
