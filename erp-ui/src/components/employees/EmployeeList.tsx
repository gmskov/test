import React from "react";
import {IResourceComponentsProps} from "@pankod/refine-core";
import {
    useTable,
    List,
    Table,
} from "@pankod/refine-antd";
import {renderEmail} from "../refine-antd-helpers/renderEmail";
import {renderFullName} from "../refine-antd-helpers/renderFullName";
import {renderRowActions} from "../refine-antd-helpers/renderRowActions";
import {normalizeColumns} from "../refine-antd-helpers/normalizeColumns";
import {renderReferenceColumn} from "../refine-antd-helpers/renderReferenceColumn";

const columns = normalizeColumns([
    ["person", "Имя", renderReferenceColumn(renderFullName)],
    ["taxId", "Личный код"],
    ["address", "Адрес"],
    ["phone", "Телефон"],
    ["email", "Email", renderEmail],
    ["actions", "Actions", renderRowActions]
])

export const EmployeeList: React.FC<IResourceComponentsProps> = () => {
    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} columns={columns} rowKey="id"/>
        </List>
    );
};
