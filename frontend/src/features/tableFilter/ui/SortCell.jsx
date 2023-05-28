import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";

import {IconButton} from "@mui/material";
import {BaseCell} from "./BaseCell";

// Ячейка для сортировки страницы по возрастанию - убыванию
const SortCell = ({isDataCell = false, keyName, topic, activeName, onSort, sortOrderBy, sx, ...props}) => {
    const getFilterIcon = () => {
        return (
            <IconButton onClick={() => onSort(keyName, isDataCell)} sx={{p: '5px'}}>
                {
                    (keyName === activeName && sortOrderBy === 'asc')
                        ? <ExpandLessOutlinedIcon/>
                        : <ExpandMoreOutlinedIcon/>
                }
            </IconButton>
        )
    }

    return (
        <BaseCell
            sx={sx}
            topic={topic}
            filterIcon={getFilterIcon()}
            {...props}
        />
    )
}

SortCell.customFuncName = 'SortCell'

export {SortCell}