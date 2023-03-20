import {pdfjs, Document, Page} from "react-pdf";
import {useMemo, useState} from "react";
// import {useState} from "react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export type PdfViewerProps = {
    file: File;
}
export const PdfViewer = ({file}: PdfViewerProps) => {
    const [pageCount, setPageCount] = useState(0);
    const [scale, setScale] = useState(1);

    const pages = useMemo(() => new Array(pageCount).fill(true), [pageCount])

    return (
        <div style={{
            width: "100%",
            height: "100%",
            overflow: "auto",
            padding: "1rem 1rem 0",
            background: "rgba(0, 0, 0, 0.075)"
        }}>
            <Document
                file={file}
                onLoadSuccess={(pdf) => setPageCount(pdf.numPages)}
                renderMode="canvas"
            >
                {pages.map((_, i) => (
                    <div style={{
                        marginBottom: "1rem",
                        cursor: scale === 1 ? "zoom-in" : "zoom-out",
                    }}>
                        <Page
                            pageNumber={i + 1}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                            scale={scale}
                            onClick={() => setScale(scale === 1 ? 1.5 : 1)}
                            key={i}
                        />
                    </div>
                ))}
            </Document>
        </div>
    )
};