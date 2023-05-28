import {useEffect, useState} from "react";

import {
    Autocomplete, Checkbox,
    TextField,
} from "@mui/material";

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import {InputText} from "../../../entities/inputText";

interface ISuggestInput {
    data: any[];
    label: string;
    dataKey?: string | null;
    onSave: (param: any[]) => void;
    needClearInput?: boolean
    sx?: { [x: string]: any }

    [x: string]: any
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small"/>;
const checkedIcon = <CheckBoxIcon fontSize="small"/>;

export const SuggestInput = ({data, label, dataKey = null, needClearInput, onSave, sx, ...props}: ISuggestInput) => {
    const [value, setValue] = useState<any[]>([])
    const hangleChange = (e: any, value: any[]) => {
        onSave(value)
        setValue(value)
    }

    useEffect(() => {
        setValue([])
    }, [needClearInput])

    return (
        <Autocomplete
            sx={{...sx}}
            multiple
            size="small"
            options={data}
            value={value}
            disableCloseOnSelect
            getOptionLabel={(option) => dataKey ? option[dataKey] : option}
            renderOption={(props, option, {selected}) => (
                <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{marginRight: 8}}
                        checked={selected}
                    />
                    {dataKey ? option[dataKey] : option}
                </li>
            )}
            noOptionsText='Не найдено'
            onChange={hangleChange}
            {...props}
            renderInput={(params) => (
                <>
                    <InputText label={label}/>
                    <TextField {...params}/>
                </>
            )}
        />
    )
}