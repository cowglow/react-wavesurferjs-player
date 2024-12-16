import {Box, Button, CircularProgress, Paper, styled, ToggleButton, Typography} from "@mui/material";
import WaveSurfer, {WaveSurferOptions} from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";
import RewindIcon from '@mui/icons-material/FastRewindRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import PlayIcon from '@mui/icons-material/PlayArrowRounded';
import ForwardIcon from '@mui/icons-material/FastForwardRounded';
import {useCallback, useMemo, useState} from "react";
import {
    AUDIO_FILE_PATH,
    AUDIO_FILE_SAMPLE_RATE,
    CURSOR_COLOR,
    DEFAULT_ZOOM_MAX, DEFAULT_ZOOM_MIN,
    PROGRESS_COLOR,
    WAVE_COLOR
} from "./plugins/constants.ts";
import SpectrogramIcon from '@mui/icons-material/WaterfallChartRounded';
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import {ZoomControl} from "./ZoomControl.tsx";
import SpectrogramPlugin from "wavesurfer.js/plugins/spectrogram";

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
    const [spectrogramPlugin, setSpectrogramPlugin] = useState<SpectrogramPlugin | null>(null)

    const defaultPlugins = useMemo(() => ([]), [wavesurfer])

    const [isPlaying, setIsPlaying] = useState(false)
    // Spectrogram
    const [showSpectrogram, setShowSpectrogram] = useState(false)
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    // Timeline
    const [readyTimestamp, setReadyTimestamp] = useState(false)

    const [timestamp, setTimestamp] = useState(0)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX);

    const createInstance = async (ws: WaveSurfer) => {
        const wavesurferInstance = ws
        if (!wavesurfer) setWavesurfer(wavesurferInstance)
        // Plugins
        const spectrogram = await createSpectrogramPluginInstance({
            ws: wavesurferInstance,
            onReady: (ready) => {
                setShowSpectrogram(ready)
                setReadySpectrogram(ready)
            }
        })
        setSpectrogramPlugin(spectrogram)
        await createTimelinePluginInstance({ws: wavesurferInstance, onReady: setReadyTimestamp})
    }

    const toggleSpectrogram = () => {
        const newState = !showSpectrogram
        if (spectrogramPlugin && !newState) {
            spectrogramPlugin.destroy()
            setSpectrogramPlugin(null)
        }
        setShowSpectrogram(newState)
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

    const timestampLabel = useMemo(() => new Date(timestamp * 1000), [timestamp])

    const onSliderChange = useCallback((value: number) => {
        wavesurfer?.zoom(Number(value))
        setZoom(Number(value))
    }, [wavesurfer]);

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer
                {...playerOptions}
                onReady={createInstance}
                plugins={defaultPlugins}
                onTimeupdate={(ws) => setTimestamp(ws.getCurrentTime())}
            />
            <WavesurferFooter>
                <Box display="flex" gap={1}>
                    <Button variant="contained" onClick={() => wavesurfer?.skip(-2)}><RewindIcon/></Button>
                    <Button variant="contained" onClick={() => {
                        setIsPlaying(prevState => !prevState)
                        wavesurfer?.playPause()
                    }}>
                        {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
                    </Button>
                    <Button variant="contained" onClick={() => wavesurfer?.skip(2)}><ForwardIcon/></Button>
                    <Typography>{timestampLabel.toLocaleTimeString()}</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <ToggleButton
                        value="showSpectrogram"
                        selected={showSpectrogram}
                        onClick={toggleSpectrogram}
                        disabled={!readySpectrogram}
                    >
                        {readySpectrogram ? <SpectrogramIcon/> : <CircularProgress size="1.4rem"/>}
                    </ToggleButton>
                    <ZoomControl
                        defaultValue={Number(wavesurfer) ?? DEFAULT_ZOOM_MAX}
                        value={zoom}
                        isReady={readyTimestamp}
                        max={DEFAULT_ZOOM_MAX}
                        min={DEFAULT_ZOOM_MIN}
                        onChange={onSliderChange}
                    />
                </Box>
            </WavesurferFooter>
            <Box display="flex" padding={5} alignItems="center" overflow="auto">
                <pre>{
                    JSON.stringify({
                        isPlaying,
                        timestampLabel,
                        showSpectrogram,
                        readyTimestamp,
                        readySpectrogram
                    }, null, 2)
                }</pre>
            </Box>
        </WavesurferWrapper>
    );
}
