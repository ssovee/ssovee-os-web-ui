import { useCallback, useRef } from "react";
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

const soundMap: Record<SoundType, string> = {
  click: clickTone,
  error: errorTone,
  success: successTone,
  alert: errorTone,
  notification: notificationTone,
  swipe: swipeTone,
};

const DEFAULT_SOUND_TYPE: SoundType = "click";

const isSoundType = (type: string): type is SoundType => {
  return type in soundMap;
};

export const useSound = () => {
  const audioCache = useRef<Partial<Record<SoundType, HTMLAudioElement>>>({});

  const playSound = useCallback((type: SoundType | string) => {
    if (typeof window === "undefined") {
      return;
    }

    const requestedType = isSoundType(type)
      ? type
      : DEFAULT_SOUND_TYPE;

    const src = soundMap[requestedType];

    if (!src) {
      console.error(
        `Sound playback failed: no source found for "${requestedType}"`
      );
      return;
    }

    try {
      let audio = audioCache.current[requestedType];

      if (!audio) {
        audio = new Audio(src);
        audio.preload = "auto";

        audioCache.current[requestedType] = audio;
      }

      // Allow the same sound to be played repeatedly.
      audio.pause();
      audio.currentTime = 0;

      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error(
            `Sound playback failed for "${requestedType}":`,
            error
          );
        });
      }
    } catch (error) {
      console.error(
        `Sound playback failed for "${requestedType}":`,
        error
      );
    }
  }, []);

  return {
    playSound,
  };
};