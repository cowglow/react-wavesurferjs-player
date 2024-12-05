import {Box, Button, Menu, Paper, Slider, styled, ToggleButton, Typography} from "@mui/material";
import WaveSurfer, {WaveSurferOptions} from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import RewindIcon from '@mui/icons-material/FastRewindRounded';
import PauseIcon from '@mui/icons-material/PauseRounded';
import PlayIcon from '@mui/icons-material/PlayArrowRounded';
import ForwardIcon from '@mui/icons-material/FastForwardRounded';
import SpectrogramIcon from '@mui/icons-material/WaterfallChartRounded';
import ZoomIcon from '@mui/icons-material/ZoomInRounded';
import { useEffect, useMemo, useState} from "react";
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";

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
const AUDIO_FILE_PATH = `${import.meta.env.BASE_URL}/155735-HUTCH-HD-SFX-2014-0059.mp3`
const DEFAULT_ZOOM_LEVEL = 100

export default function AudioPlayer() {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
    const [zoomMenuEl, setZoomMenuEl] = useState<HTMLElement | null>(null)
    const [timestamp, setTimestamp] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showSpectrogram, setShowSpectrogram] = useState(false)
    const [zoom, setZoom] = useState(DEFAULT_ZOOM_LEVEL)

    const createInstance = (ws: WaveSurfer) => {
        if (!wavesurfer) setWavesurfer(ws)

        // Plugins
        createTimelinePluginInstance(ws)
        createSpectrogramPluginInstance(ws)
    }

    const playerOptions: Partial<WaveSurferOptions> = {
        waveColor: 'rgb(200, 0, 200)',
        progressColor: 'rgb(100, 0, 100)',
        height: 128, // default value
        url: AUDIO_FILE_PATH,
        sampleRate: 44100,
    }

    useEffect(() => {
        if (wavesurfer) {
            wavesurfer.zoom(zoom / 10)
        }
    }, [zoom])

    const timestampLabel = useMemo(() => new Date(timestamp * 1000).toISOString().replace("T", " "), [timestamp])

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer {...playerOptions} onReady={createInstance} onTimeupdate={(ws) => setTimestamp(ws.getCurrentTime())}/>
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
                    <Typography>{timestampLabel}</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <ToggleButton
                        value="showSpectrogram"
                        selected={showSpectrogram}
                        onClick={() => setShowSpectrogram(prevState => !prevState)}
                    >
                        <SpectrogramIcon/>
                    </ToggleButton>
                    <ToggleButton value="showZoom" onClick={(event) => setZoomMenuEl(event.currentTarget)}>
                        <ZoomIcon/>
                    </ToggleButton>
                    <Menu
                        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                        transformOrigin={{vertical: "top", horizontal: "right"}}
                        anchorEl={zoomMenuEl}
                        open={Boolean(zoomMenuEl)}
                        onClose={() => setZoomMenuEl(null)}
                    >
                        <Box display="flex" justifyContent="center" alignItems="flex-end" width={345} height={67}
                             overflow="visible" paddingX={4} paddingY={1}>
                            <Slider
                                valueLabelDisplay="auto"
                                defaultValue={DEFAULT_ZOOM_LEVEL}
                                value={zoom}
                                shiftStep={50}
                                step={10}
                                marks
                                min={DEFAULT_ZOOM_LEVEL}
                                max={200}
                                onChange={(_, value) => setZoom(Number(value))}
                            />
                        </Box>
                    </Menu>
                </Box>
            </WavesurferFooter>
        </WavesurferWrapper>
    );
}
