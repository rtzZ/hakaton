import {Grid, TableCell} from "@mui/material";

const BaseCell = ({topic, filterIcon, sx, ...props}) => {
    return (
        <TableCell {...props} sx={{...sx}}>
            <Grid container columnSpacing={1} alignItems='center' justifyContent={props.align} flexWrap='nowrap'>
                <Grid item>
                    {topic}
                </Grid>
                <Grid>
                    {filterIcon}
                </Grid>
            </Grid>
        </TableCell>
    )
}

BaseCell.customFuncName = 'BaseCell'

export {BaseCell}