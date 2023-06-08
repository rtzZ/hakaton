import Box from "@mui/material/Box";
import {useEffect} from "react";
import {TextField, Tooltip} from "@mui/material";

// Фильтрация таблицы по поиску
// findIntersection - функция для поиска значений по поиску (принимае дату и поисковое значение)
// tooltipeTitle - подсказка, tooltipePlacement - расположение подсказки
const SearchBanner =
    ({
         tooltipTitle='',
         tooltipPlacement='top',
         filterValue,
         defferFilterValue,
         onSearchInput,
         onFilter,
         findIntersection,
         data,
         children,
     }) => {

        useEffect(() => {
            onFilter(findIntersection(data, defferFilterValue))
        }, [defferFilterValue])

        return (
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: '10px'}}>
                <Tooltip title={tooltipTitle} placement={tooltipPlacement}>
                    <TextField
                        size='small'
                        label='Поиск'
                        value={filterValue}
                        onChange={onSearchInput}
                        sx={{minWidth: '300px'}}
                    />
                </Tooltip>
                <Box sx={{display: 'flex', gap: '10px'}}>
                    {children}
                </Box>
            </Box>
        )
}

SearchBanner.customFuncName = 'SearchBanner'

export {SearchBanner}