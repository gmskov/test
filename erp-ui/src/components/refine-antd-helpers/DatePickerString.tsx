import {DatePicker, DatePickerProps} from "@pankod/refine-antd";
import dayjs from "dayjs";
import {useCallback} from "react";

export type DatePickerStringProps = Omit<DatePickerProps, "value" | "onChange"> & {
    value?: string;
    onChange?: (value: string | null) => void
    valueFormat: string;
};

export const DatePickerString = (props: DatePickerStringProps) => {
    const {value, onChange, valueFormat, ...rest} = props;
    const changeHandler = useCallback(
        (value: dayjs.Dayjs | null) => {
            const result = value != null ? value.format(valueFormat) : null;
            console.log({value, result});
            if (onChange != null) {
                onChange(result);
            }
        },
        [onChange]
    );

    return (
        <DatePicker
            {...rest}
            value={value != null ? dayjs(value) : null}
            onChange={changeHandler}
        />
    )
};
