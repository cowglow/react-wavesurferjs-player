import {Box, CircularProgress, Menu, Slider, styled, ToggleButton} from "@mui/material";
import ZoomIcon from "@mui/icons-material/ZoomInRounded";
import {useState} from "react";
import {ControlType} from "../plugins/plugin.types.ts";
import {StyledControlWrapper} from "./index.styled.ts";

const SliderWrapper = styled(Box)`
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    width: 102px;
    height: 345px;
    padding-top: ${({theme}) => theme.spacing(4)};
    padding-bottom: ${({theme}) => theme.spacing(3)};
    padding-right: ${({theme}) => theme.spacing(2)};
    padding-left: ${({theme}) => theme.spacing(1)};
`;

type ZoomControlProps = ControlType & {
    value: number
    onChange: (value: number) => void
    max: number
    min: number
}

export default function ZoomControl({
                                        isReady,
                                        onChange,
                                        value,
                                        max = 100,
                                        min = 1,
                                    }: ZoomControlProps) {
    const [selected, setSelected] = useState(false)
    const [zoomMenuEl, setZoomMenuEl] = useState<HTMLElement | null>(null)

    return (
        <StyledControlWrapper>
            {!isReady
                ? <CircularProgress/>
                : <ToggleButton
                    value="showZoom"
                    selected={selected}
                    onClick={(event) => {
                        setSelected(!selected)
                        isReady && setZoomMenuEl(event.currentTarget)
                    }}
                >
                    <ZoomIcon/>
                </ToggleButton>
            }
            <Menu
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
                transformOrigin={{vertical: "top", horizontal: "right"}}
                anchorEl={zoomMenuEl}
                open={Boolean(zoomMenuEl)}
                onClose={() => {
                    setZoomMenuEl(null)
                    setSelected(false)
                }}
            >
                <SliderWrapper>
                    <Slider
                        valueLabelDisplay="auto"
                        orientation="vertical"
                        shiftStep={50}
                        step={10}
                        value={value}
                        marks
                        min={min}
                        max={max}
                        onChange={(_, value) => onChange(Number(value))}
                        onChangeCommitted={(_, value) => onChange(Number(value))}
                    />
                </SliderWrapper>
            </Menu>
        </StyledControlWrapper>
    );
}
