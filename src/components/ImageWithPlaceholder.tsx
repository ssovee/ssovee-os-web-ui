import React, { useState, useEffect } from "react";
import { cn } from "../utils/helpers";
import fallbackLogo from "../assets/icon-192x192.svg";

type ImageSource = string | { src: string };

export interface ImageWithPlaceholderProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
    src?: ImageSource;
    fallbackSrc?: string;
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = ({
    src,
    alt,
    fallbackSrc = fallbackLogo,
    className,
    onError,
    ...props
}) => {
    const resolveSrc = (s: ImageSource | undefined | null) => {
        if (s && typeof s === "object" && "src" in s && typeof s.src === "string") {
            return s.src;
        }
        return typeof s === "string" ? s : undefined;
    };

    const isValidSrc = (s: string | undefined | null) => {
        if (!s) return false;
        const trimmed = s.trim();
        if (trimmed === "") return false;
        if (trimmed.startsWith("data:")) return true;

        if (trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../")) {
            return true;
        }

        // Bundlers often emit bare relative asset paths like "Loader-ABC123.gif".
        if (/^[^\s?#]+\.(png|jpe?g|gif|webp|svg|bmp|ico|avif)(\?.*)?(#.*)?$/i.test(trimmed)) {
            return true;
        }

        try {
            new URL(trimmed);
            return true;
        } catch {
            return false;
        }
    };

    const resolvedSrc = resolveSrc(src);
    const initialSrc = isValidSrc(resolvedSrc) ? resolvedSrc : fallbackSrc;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [hasError, setHasError] = useState(!isValidSrc(resolvedSrc));

    useEffect(() => {
        const nextResolvedSrc = resolveSrc(src);
        if (isValidSrc(nextResolvedSrc)) {
            setImgSrc(nextResolvedSrc);
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
