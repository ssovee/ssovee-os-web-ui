import { useCallback } from "react";
import clickTone from "../assets/sounds/click-tone.wav";
import errorTone from "../assets/sounds/error-tone.wav";
import notificationTone from "../assets/sounds/notification-tone.wav";
import successTone from "../assets/sounds/success-tone.wav";
import swipeTone from "../assets/sounds/swipe-tone.wav";

export type SoundType =
  | "click"
  | "error"
  | "success"
  | "alert"
  | "notification"
  | "swipe";

const soundMap: Record<SoundType, unknown> = {
  click: clickTone,
  alert: errorTone,
  notification: notificationTone,
  error: errorTone,
  success: successTone,
  swipe: swipeTone,
};

const DEFAULT_SOUND_TYPE: SoundType = "click";

const getAssetUrl = (asset: unknown) => {
  if (typeof asset === "string") return asset;

  if (asset && typeof asset === "object") {
    const record = asset as Record<string, unknown>;
    const candidate = record.default ?? record.src ?? record.url ?? record.href;
    if (typeof candidate === "string") return candidate;
  }

  return "";
};

const resolveSoundCandidates = (src: string) => {
  if (!src) return [];

  const candidates = [src];
  if (!/^https?:|^data:|^blob:/.test(src)) {
    try {
      candidates.push(new URL(src, import.meta.url).href);
    } catch {
      // Keep raw source if URL resolution fails.
    }
  }

  return [...new Set(candidates)];
};

const isSoundType = (type: string): type is SoundType => {
  return type in soundMap;
};

export const useSound = () => {
  const playSound = useCallback((type: SoundType | string) => {
    if (typeof window === "undefined" || typeof window.Audio === "undefined") {
      return;
    }

    const requestedType = isSoundType(type) ? type : DEFAULT_SOUND_TYPE;
    const soundSrc = getAssetUrl(soundMap[requestedType]);
    const sourceCandidates = resolveSoundCandidates(soundSrc);

    if (sourceCandidates.length === 0) {
      console.error(`Sound playback failed: no source found for "${requestedType}"`);
      return;
    }

    void (async () => {
      let lastError: unknown;

      for (const source of sourceCandidates) {
        try {
          const audio = new window.Audio(source);
          audio.preload = "auto";
          audio.currentTime = 0;
          await audio.play();
          return;
        } catch (err) {
          lastError = err;
        }
      }

      console.error("Sound playback failed:", lastError);
    })();
  }, []);

  return { playSound };
};