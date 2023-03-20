import {ColumnsType} from "antd/es/table/interface";
import * as React from "react";
import {RenderedCell, DataIndex} from "rc-table/lib/interface";

export type RenderType<RecordType> = (value: any, record: RecordType, index: number) => React.ReactNode | RenderedCell<RecordType>;
export type Columns<T> = Array<[DataIndex, string | null, RenderType<T>?]>

export function normalizeColumns<T>(columns: Columns<T>): ColumnsType<T> {
    return columns.map(([dataIndex, title, render]) => ({
        dataIndex,
        title: title == null ? undefined : title,
        render
    }));
}
