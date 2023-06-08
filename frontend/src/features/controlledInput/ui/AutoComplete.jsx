import {Controller} from "react-hook-form";
import {Autocomplete} from "@mui/material";

export const AutoComplete = (
    {
        options,
        renderInput,
        getOptionLabel,
        control,
        name,
    }) => {
    return (
        <Controller
            render={({onChange, ...props}) => (
                <Autocomplete
                    options={options}
                    getOptionLabel={getOptionLabel}
                    renderInput={renderInput}
                    onChange={(e, data) => onChange(data)}
                    {...props}
                />
            )}
            onChange={([, data]) => data}
            name={name}
            control={control}
        />
    );
}