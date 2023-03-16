import {BaseRecord} from "@pankod/refine-core";
import React from "react";
import {ReferenceColumn} from "./components/ReferenceColumn";
import {RenderType} from "./normalizeColumns";

export function renderReferenceColumn<T extends BaseRecord>(renderValue: RenderType<T> = (v) => v): RenderType<T> {
    return (value: any, record: T, index) => {
        return (
            <ReferenceColumn recordItemId={record.id!}>
                {renderValue(value, record, index)}
            </ReferenceColumn>
        )
    }
}
