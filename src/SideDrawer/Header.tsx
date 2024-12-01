import {PropsWithChildren} from "react";
import {Box, styled} from "@mui/material";

const StyledDrawerHeader = styled(Box)`
  border: thin solid greenyellow;
  flex: auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export default function SideDrawerHeader (props: PropsWithChildren) {
    return (
        <StyledDrawerHeader>
            Header
            {props.children}
        </StyledDrawerHeader>
    )
}