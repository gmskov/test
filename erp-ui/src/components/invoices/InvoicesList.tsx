import React from "react";
import {IResourceComponentsProps} from "@pankod/refine-core";
import {
    useTable,
    List,
    Table,
} from "@pankod/refine-antd";

import {renderRowActions} from "../refine-antd-helpers/renderRowActions";
import {normalizeColumns} from "../refine-antd-helpers/normalizeColumns";
import {fileUrl} from "../../api";

const columns = normalizeColumns([
    ["invoiceDate", "Дата инвойса"],
    ["amount", "Сума инвойса"],
    ["description", "Описание"],
    [["file", "fileName"], "Счет", (_, record) => {
        if (record.file == null) {
            return _;
        }
        return (<a href={fileUrl(record.file.id)} target="_blank">{_}</a>);
    }],
    ["actions", "Actions", renderRowActions]
])

export const InvoicesList: React.FC<IResourceComponentsProps> = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} columns={columns} rowKey="id"/>
        </List>
    );
};
