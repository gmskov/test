import React from "react";
import {EmailField, Table, TableColumnProps} from "@pankod/refine-antd";

export type EmailColumnProps<T> = Omit<TableColumnProps<T>, "render">

export function EmailColumn<T>(props: EmailColumnProps<T>) {
    return (
        <Table.Column
            {...props}
            render={(value: any) => <EmailField value={value}/>}
        />
    )
}
