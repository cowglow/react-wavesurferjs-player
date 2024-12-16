import {Box, CircularProgress, ToggleButton} from "@mui/material";
import {ControlType} from "../plugins/plugin.types.ts";
import {useState} from "react";
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
    const [selected, setSelected] = useState(false)

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
