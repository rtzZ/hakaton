import Box from "@mui/material/Box";

import {PageLayout} from "../../../shared/layout";
import {Header} from "./Header";

interface IPageWrapper {
    sx?: {[x: string]: any}
    [x: string]: any
}

export const PageWrapper = ({sx, children,...props}: IPageWrapper) => {
    return (
        <Box sx={{...sx}} {...props}>
            <Header/>
            <PageLayout>
                {children}
            </PageLayout>
        </Box>
    )
}