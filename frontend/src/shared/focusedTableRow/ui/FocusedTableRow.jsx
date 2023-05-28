import {TableRow} from "@mui/material";

export const FocusedTableRow = ({children, sx, ...props}) => {
    return (
        <TableRow
            {...props}
            sx={{
                '&:hover': {cursor: 'pointer', bgcolor: '#f5f5f5'}
            }}
        >
            {children}
        </TableRow>
    )
}