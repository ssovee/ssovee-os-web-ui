import React, { useState, useEffect } from "react";
import { cn } from "../utils/helpers";

export interface ImageWithPlaceholderProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
    src,
    alt,
    fallbackSrc = "",
    className,
    onError,
    ...props
}) => {
    const isValidSrc = (s: string | object | undefined | null) => {
        if (!s) return false;
        if (typeof s === "object") return true;
        if (typeof s === "string") {
            const trimmed = s.trim();
            if (trimmed === "") return false;
            if (trimmed.startsWith("data:")) return true;
            if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) return true;
            try {
                new URL(trimmed);
                return true;
            } catch {
                return false;
            }
        }
        return true;
    };

    const initialSrc = isValidSrc(src) ? src : fallbackSrc;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(!isValidSrc(src));

    useEffect(() => {
        if (isValidSrc(src)) {
            setImgSrc(src);
            setHasError(false);
        } else {
            setImgSrc(fallbackSrc);
            setHasError(true);
        }
    }, [src, fallbackSrc]);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
        }
        if (onError) {
            onError(e);
        }
    };

    return (
        <img
            {...props}
            src={typeof imgSrc === "string" ? imgSrc : undefined}
            alt={alt}
            className={cn(className)}
            onError={handleError}
        />
    );
};

export default ImageWithPlaceholder;
