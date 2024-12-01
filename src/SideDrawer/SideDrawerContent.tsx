import {PropsWithChildren} from "react";
import {Box, styled} from "@mui/material";

const StyledDrawerContent = styled(Box)`
  border: thin solid greenyellow;
  flex: 1;
  display: flex;
  width: 100%;
`
export default function SideDrawerContent(props: PropsWithChildren) {
    return <StyledDrawerContent>{props.children}</StyledDrawerContent>
}
