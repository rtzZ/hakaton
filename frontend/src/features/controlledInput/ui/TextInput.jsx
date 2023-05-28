import {Controller} from "react-hook-form";

import {InputText} from "../../../entities/inputText";

import {TextField} from "@mui/material";

export const TextInput = ({name, control, label, sx = {}, errors, ...props}) => {

    return (
        <Controller
            name={name}
            control={control}
            render={({field: {ref, value, ...field}}) => (
                <>
                    <InputText
                        errors={errors}
                        name={name}
                        label={label}
                    />
                    <TextField
                        {...props}
                        inputRef={ref}
                        value={value}
                        sx={{...sx}}
                        {...field}
                        error={!!errors[name]}
                        fullWidth
                        size='small'
                        variant="outlined"
                    />
                </>
            )}
        />
    )
}
