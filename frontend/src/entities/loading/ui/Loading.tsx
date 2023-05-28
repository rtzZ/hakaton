import {CenteredBox} from "../../../shared/centeredBox";
import {CircularProgress} from "@mui/material";

export const Loading = () => {
    return (
        <CenteredBox position='absolute'>
            <CircularProgress color='inherit'/>
        </CenteredBox>
    )
}