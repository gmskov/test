import {useMemo} from "react";
import {Button, Space} from "@pankod/refine-antd";
import {CloseOutlined} from "@ant-design/icons";

import "./FileViewer.scss";
import {PdfViewer} from "./PdfViewer";
import {ImageViewer} from "./ImageViewer";

export type FileViewerProps = {
    file: File;
    onDelete: () => void;
}
export const FileViewer = ({file, onDelete}: FileViewerProps) => {
    const fileType = useMemo(() => {
        const {name} = file;
        const parsed = /\.([^.]+)$/.exec(name);
        const ext = parsed?.[1]?.toLowerCase();
        if (ext === "pdf") {
            return "pdf";
        }
        else if (["png", "jpg"].includes(ext as any)) {
            return "image";
        }
        else {
            return "unknown";
        }
    }, [file]);

    return (
        <div className="file-viewer">
            <div className="file-viewer__container">
                {fileType === "pdf" && <PdfViewer file={file}/>}
                {fileType === "image" && <ImageViewer file={file}/>}
            </div>
            <div className="file-viewer__toolbar">
                <Space style={{width: "100%", justifyContent: "end"}}>
                    <Button icon={<CloseOutlined/>} onClick={onDelete}></Button>
                </Space>
            </div>
        </div>
    )
};
