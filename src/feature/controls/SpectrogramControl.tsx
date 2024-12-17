import {Box, CircularProgress, ToggleButton} from "@mui/material";
import {ControlType} from "../plugins/plugin.types.ts";
import {useEffect, useState} from "react";
import SpectrogramIcon from "@mui/icons-material/WaterfallChartRounded";

type SpectrogramControlProps = ControlType & {
    value: boolean
    onChange: (value: boolean) => void
}
export default function SpectrogramControl({
                                               isReady,
                                               onChange,
                                               value,
                                           }: SpectrogramControlProps) {
    const [, setRenderCount] = useState(0)
    const [selected, setSelected] = useState(false)

    useEffect(() => {
        const pause = setTimeout(() => {
            console.log('spectrogram control rendered')
            setRenderCount(prev => prev + 1)
        }, 1000)
        return () => clearTimeout(pause)
    }, [selected]);

    return (
        <Box sx={{maxWidth: 48, maxHeight: 48}}>
            {!isReady
                ? <CircularProgress/>
                : <ToggleButton
                    value="selected"
                    selected={selected}
                    onClick={() => {
                        setSelected(!selected)
                        isReady && onChange(!value)
                    }}
                >
                    <SpectrogramIcon/>
                </ToggleButton>
            }
        </Box>
    )
}
