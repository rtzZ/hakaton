import {useEffect, useState} from "react";

import {Box, Grid, Menu, MenuItem, TableCell, Typography} from "@mui/material"

import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';

interface ITableEditCell {
    initialOptions: {[x: string]: any };
    options: any[];
    optionKey: string;
}

export const TableEditCell = ({initialOptions, options, optionKey}: ITableEditCell) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [optionChanged, setOptionChanged] = useState<boolean>(false)
    const [chosenOption, setChosenOption] = useState<{ [x: string]: any }>(initialOptions);


    useEffect(() => {
        if (chosenOption[optionKey] !== initialOptions[optionKey]) {
            setOptionChanged(true)
        } else {
            setOptionChanged(false)
        }
    }, [chosenOption, setOptionChanged])
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = (newOption: { [x: string]: any }) => {
        setChosenOption(newOption)
        setAnchorEl(null);
    };

    return (
        <TableCell>
            <Box onClick={handleClick}>
                <Grid container>
                    <Grid item>
                        <Typography>{chosenOption[optionKey]}</Typography>
                    </Grid>
                    <Grid item>
                        {
                            optionChanged
                                ? <DoneIcon/>
                                : <EditIcon/>
                        }
                    </Grid>
                </Grid>
                <Menu
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'left'}}
                    transformOrigin={{vertical: 'top', horizontal: 'left'}}
                >
                    {
                        options.map((option: { [x: string]: any }, i: number) =>
                            <MenuItem onClick={() => handleClose(option)} key={i}>
                                {option[optionKey]}
                            </MenuItem>
                        )
                    }
                </Menu>
            </Box>
        </TableCell>
    )
}