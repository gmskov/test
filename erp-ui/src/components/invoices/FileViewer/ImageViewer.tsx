import {createRef, useEffect, useState} from "react";

export type ImageViewerProps = {
    file: File;
}
export const ImageViewer = ({file}: ImageViewerProps) => {
    const [imgUrl, setImgUrl] = useState<string>();
    const [origSize, setOrigSize] = useState<{ x: number, y: number }>();
    const [imgScale, setImgScale] = useState(1);
    const [scale, setScale] = useState(1);
    const imgRef = createRef<HTMLImageElement>();
    const containerRef = createRef<HTMLDivElement>();

    const onImgLoaded = (e: any) => {
        const x = e.target.naturalWidth;
        const y = e.target.naturalHeight;
        setOrigSize({x, y});
        if (containerRef.current == null) {
            setImgScale(1);
        }
        else {
            setImgScale(Math.max(
                containerRef.current.offsetWidth / x,
                containerRef.current.offsetHeight / y,
            ));
        }
    }

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setImgUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    return (
        <div
            style={{
                width: "100%",
                height: "80vh",
                border: "1px solid lightgray",
                position: "relative",
            }}
        >
            <div
                ref={containerRef}
                style={{
                    overflow: "auto",
                    width: "100%",
                    height: "100%",
                    textAlign: "center"
                }}
            >
                {imgUrl && <img
                    alt=""
                    src={imgUrl}
                    ref={imgRef}
                    onDragStart={(e) => e.preventDefault()}
                    onClick={() => setScale(scale === 1 ? 1.5 : 1)}
                    style={{
                        width: (origSize?.x ?? 0) * imgScale * scale,
                        height: (origSize?.y ?? 0) * imgScale * scale,
                        cursor: scale === 1 ? "zoom-in" : "zoom-out",
                    }}
                    onLoad={onImgLoaded}
                />}
            </div>
        </div>
    );
};
