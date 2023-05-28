import {Paper} from "@mui/material";

interface IPaperLayout {
    children: React.ReactNode;
    sx?: {[x: string]: any};
    [x: string]: any;
}

export const PaperLayout = ({children, sx, ...props}: IPaperLayout) => {
    return (
        <Paper
            {...props}
            sx={{
                mt: '20px',
                p: '20px',
                ...sx
            }}
        >
            {children}
        </Paper>
    )
}