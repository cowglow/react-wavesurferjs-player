import RewindIcon from "@mui/icons-material/FastRewindRounded";
import {Box, Button} from "@mui/material";
import ForwardIcon from "@mui/icons-material/FastForwardRounded";
import PlayIcon from "@mui/icons-material/PlayArrowRounded";
import PauseIcon from "@mui/icons-material/PauseRounded";
import {useCallback, useState} from "react";

type PlaybackControlsProps = {
    onSkip?: (seconds: number) => void
    onPlayPause?: () => void
}

export default function PlaybackControls({
                                             onSkip,
                                             onPlayPause
                                         }: PlaybackControlsProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const togglePlayPause = useCallback(() => {
        onPlayPause && onPlayPause()
        setIsPlaying(!isPlaying)
    }, [isPlaying, onPlayPause])
    return (
        <Box display="contents">
            <Button variant="contained" onClick={() => onSkip && onSkip(-2)}><RewindIcon/></Button>
            <Button variant="contained" onClick={togglePlayPause}>
                {!isPlaying ? <PlayIcon/> : <PauseIcon/>}
            </Button>
            <Button variant="contained" onClick={() => onSkip && onSkip(2)}><ForwardIcon/></Button>
        </Box>
    )
}
