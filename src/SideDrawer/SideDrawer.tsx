import {PropsWithChildren} from "react";
import {Box, styled} from "@mui/material";
import SideDrawerHeader from "./Header.tsx";
import SideDrawerSideMenu from "./SideMenu.tsx";
import SideDrawerContent from "./SideDrawerContent.tsx";

const StyledDrawer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > :nth-child(1) {
    border: solid red;
  }

  > :nth-child(2) {
    border: solid blue;
  }

  > :nth-child(3) {
    border: solid greenyellow;
  }
`
export default function SideDrawer(props: PropsWithChildren) {

    return (
        <StyledDrawer>
            {props.children}
        </StyledDrawer>
    )
}

SideDrawer.Header = SideDrawerHeader;
SideDrawer.SideMenu = SideDrawerSideMenu
SideDrawer.Content = SideDrawerContent
