import {useState} from "react";

import {Alert, Box, Portal, Snackbar} from "@mui/material";

interface ISnackBar {
    children: string
    autoHideDuration?: number
    severity: any
    sx?: {[x: string]: any }
    [x: string]: any
}
export const SideAlert = ({children, autoHideDuration=5000, sx, severity, ...props}: ISnackBar) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const borderColor = severity === 'error' ? '#ffcdcc' : severity === 'success' ? 'green' : 'white'

    return (
        <Portal>
            <Snackbar
                onClick={(e) => e.stopPropagation()}
                onClose={() => setIsOpen(false)}
                open={isOpen}
                autoHideDuration={autoHideDuration}
                sx={{...sx}}
                {...props}
            >
                <Box>
                    <Alert severity={severity} sx={{border: `1px solid ${borderColor}`}}>
                        {children}
                    </Alert>
                </Box>
            </Snackbar>
        </Portal>
    )
}