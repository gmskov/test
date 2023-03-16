import {BaseRecord} from "@pankod/refine-core";
import {EditButton, ShowButton, Space} from "@pankod/refine-antd";
import React from "react";

export const renderRowActions = (_: any, record: BaseRecord) => (
    <Space>
        <EditButton
            hideText
            size="small"
            recordItemId={record.id}
        />
        <ShowButton
            hideText
            size="small"
            recordItemId={record.id}
        />
    </Space>
);
