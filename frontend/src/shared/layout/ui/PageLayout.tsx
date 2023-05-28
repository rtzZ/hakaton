import Box from "@mui/material/Box";
import '../css/pageLayout.css';

interface IPageWrapper {
    sx?: {[x: string]: any}
    [x: string]: any;
}

export const PageLayout = ({sx, ...props}: IPageWrapper) => {
    return (
        <Box sx={{...sx}} className='page-wrapper'>
            {props.children}
        </Box>
    )
}