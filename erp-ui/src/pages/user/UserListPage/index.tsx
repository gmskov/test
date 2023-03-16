import React from "react";
import {IResourceComponentsProps, useCan, useResource} from "@pankod/refine-core";
import {
    useTable,
    List,
    Table,
    EmailField,
    ImageField, EditButton, Space, DeleteButton,
} from "@pankod/refine-antd";

export const UserListPage: React.FC<IResourceComponentsProps> = () => {
    const {data: canCreate} = useCan({
        action: "edit",
        resource: useResource().resourceName,
    });

    const {tableProps} = useTable({
        syncWithLocation: true,
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex={["photo"]}
                    title="Фото"
                    render={(value: any) => (
                        <ImageField
                            preview={false}
                            style={{maxWidth: "100px", maxHeight: "32px"}}
                            value={value}
                        />
                    )}
                />
                <Table.Column dataIndex="login" title="Логин"/>
                <Table.Column dataIndex="first_name" title="Имя"/>
                <Table.Column dataIndex="last_name" title="Фамилия"/>
                <Table.Column dataIndex="phone" title="Телефон"/>
                <Table.Column
                    dataIndex={["email"]}
                    title="Email"
                    render={(value: any) => <EmailField value={value}/>}
                />
                {canCreate && <Table.Column
                    render={(_, record: any) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />}
            </Table>
        </List>
    );
};
