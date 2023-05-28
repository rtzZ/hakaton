import {Typography} from "@mui/material";

interface IFocusedTypography {
    focusColor?: string;
    children: any;
    sx?: {[x: string]: any};
    [x: string]: any;
}

export const FocusedTypography = ({sx, children, focusColor = 'black', ...props}: IFocusedTypography) => {
    return (
        <Typography
            {...props}
            sx={{
                ...sx,
                '&:hover': {
                    cursor: 'pointer',
                    color: focusColor,
                }
            }}
        >
            {children}
        </Typography>
    )
}