import {Button} from "@mui/material";

interface ISubmitButton {
    bgcolor?: string;
    children: string;
    sx?: {[x: string]: any};
    [x: string]: any;
}
export const SubmitButton = ({bgcolor, children, sx, ...props}: ISubmitButton) => {
    return (
        <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{mt: '24px', bgcolor: bgcolor, ...sx}}
            {...props}
        >
            {children}
        </Button>
    )
}