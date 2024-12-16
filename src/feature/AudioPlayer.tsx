import {Box, Paper, styled, Typography} from "@mui/material";
import WaveSurfer from "wavesurfer.js";
import WavesurferPlayer from "@wavesurfer/react";
import {useEffect, useMemo, useState} from "react";
import {DEFAULT_ZOOM_MAX, DEFAULT_ZOOM_MIN} from "./plugins/constants.ts";
import createSpectrogramPluginInstance from "./plugins/create-spectrogram-plugin-instance.ts";
import createTimelinePluginInstance from "./plugins/create-timeline-plugin-instance.ts";
import {GenericPlugin} from "wavesurfer.js/dist/base-plugin";
import {audioPlayerOptions} from "./plugins/audio-player-options.ts";
import {PlaybackControls, ZoomControl} from "./controls";
import SpectrogramControl from "./controls/SpectrogramControl.tsx";

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
    const [wavesurferPlugins, setWavesurferPlugins] = useState<Record<string, GenericPlugin | null>>({
        timeline: null,
        spectrogram: null
    })

    // State reflects current state of the player
    const [isPlaying, setIsPlaying] = useState(false)

    // Ready States
    const [readySpectrogram, setReadySpectrogram] = useState(false)
    const [readyTimeline, setReadyTimeline] = useState(false)
    // Show States
    const showSpectrogram = useMemo(() => Boolean(wavesurferPlugins["spectrogram"]), [readySpectrogram])


    const [zoom, setZoom] = useState(DEFAULT_ZOOM_MAX);

    const createInstance = (ws: WaveSurfer) => {
        console.log("Create Instance!")
        if (!wavesurfer) setWavesurfer(ws)
        setWavesurferPlugins({
            timeline: createTimelinePluginInstance({ws, onReady: setReadyTimeline}),
            spectrogram: null
        })
    }

    const toggleSpectrogram = async () => {
        if (!wavesurfer) return
        if (!wavesurferPlugins["spectrogram"]) {
            // Create Spectrogram
            setWavesurferPlugins(prevState => ({
                ...prevState,
                spectrogram: createSpectrogramPluginInstance({ws: wavesurfer, onReady: setReadySpectrogram})
            }))
        } else {
            // Remove Spectrogram
            setWavesurferPlugins(prevState => {
                prevState.spectrogram?.destroy()
                return {
                    ...prevState,
                    spectrogram: null
                }
            })
            //     const spectrogram = createSpectrogramPluginInstance({ws: wavesurfer, onReady: setReadySpectrogram})
            //     setWavesurferPlugins(prevState => ({...prevState, spectrogram}))
        }
        console.log(wavesurferPlugins)
        // setShowSpectrogram(prevState => !prevState)
    }

    // Register plugin by effect
    useEffect(() => {
        if (wavesurfer) {
            // Remove the Active Plugins
            [...wavesurfer.getActivePlugins()].forEach(plugin => plugin.destroy())
            Object.keys(wavesurferPlugins).forEach(key => {
                wavesurferPlugins[key] && wavesurfer.registerPlugin(wavesurferPlugins[key])
            })
        }
    }, [wavesurferPlugins]);

    // State changes should execute actions on the wavesurfer instance
    useEffect(() => {
        wavesurfer?.zoom(Number(zoom))
    }, [zoom]);

    return (
        <WavesurferWrapper variant="elevation">
            <WavesurferPlayer
                {...audioPlayerOptions}
                onReady={createInstance}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
            <WavesurferFooter>
                <Box display="flex" gap={1}>
                    <PlaybackControls
                        onSkip={(step) => wavesurfer?.skip(step)}
                        onPlayPause={() => wavesurfer?.playPause()}
                    />
                    <Typography
                        variant="h3">{wavesurfer ? new Date(wavesurfer?.getCurrentTime() * 1000).toLocaleTimeString() : "..."}</Typography>
                </Box>
                <Box display="flex" gap={1}>
                    <SpectrogramControl
                        isReady={true}
                        isDisabled={false}
                        value={showSpectrogram}
                        onChange={toggleSpectrogram}
                    />
                    <ZoomControl
                        isReady={readyTimeline}
                        isDisabled={false}
                        value={zoom}
                        onChange={setZoom}
                        max={DEFAULT_ZOOM_MAX}
                        min={DEFAULT_ZOOM_MIN}
                    />
                </Box>
            </WavesurferFooter>
            <Box display="flex" padding={5} alignItems="center" overflow="auto">
                <pre>{
                    JSON.stringify({
                        isPlaying,
                        readyTimeline,
                        readySpectrogram,
                        showSpectrogram,
                        zoom,
                        wavesurferPlugins: Object
                            .keys(wavesurferPlugins)
                            .filter(plugin => wavesurferPlugins[plugin] !== null)
                    }, null, 2)
                }</pre>
            </Box>
        </WavesurferWrapper>
    );
}
