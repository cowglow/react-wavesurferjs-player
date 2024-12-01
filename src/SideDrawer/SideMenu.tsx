import {Box, styled} from "@mui/material";
import {PropsWithChildren} from "react";


const StyledDrawerSideMenu = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export default function SideDrawerSideMenu(props: PropsWithChildren) {
    return <StyledDrawerSideMenu>{props.children}</StyledDrawerSideMenu>
}
