import {StyledControlWrapper} from "./index.styled.ts";
import {ControlType} from "../plugins/plugin.types.ts";
import {CircularProgress, ToggleButton} from "@mui/material";
import {useState} from "react";
import PushPinIcon from '@mui/icons-material/PushPin';

type AddMarkerControlProps = ControlType & {
    onChange: (value: boolean) => void
}
export default function AddMarkerControl({
                                             isReady,
                                             onChange,
                                         }: AddMarkerControlProps) {
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
                        isReady && onChange(!selected)
                    }}>
                    <PushPinIcon/>
                </ToggleButton>
            }

        </StyledControlWrapper>
    )
}
