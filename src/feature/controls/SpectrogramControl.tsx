import {CircularProgress, ToggleButton} from "@mui/material";
import {ControlType} from "../plugins/plugin.types.ts";
import {useState} from "react";
import SpectrogramIcon from "@mui/icons-material/WaterfallChartRounded";
import {StyledControlWrapper} from "./index.styled.ts";

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
        <StyledControlWrapper>
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
        </StyledControlWrapper>
    )
}
