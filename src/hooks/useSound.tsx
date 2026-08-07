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

export interface PlaySoundOptions {
  volume?: number;
  restart?: boolean;
}

const soundMap: Record<SoundType, string> = {
  click: clickTone,
  alert: errorTone,
  notification: notificationTone,
  error: errorTone,
  success: successTone,
  swipe: swipeTone,
};

const audioCache = new Map<SoundType, HTMLAudioElement>();

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

export const useSound = () => {
  const playSound = useCallback(async (type: SoundType, options?: PlaySoundOptions) => {
    if (typeof window === "undefined" || typeof window.Audio === "undefined") {
      return false;
    }

    const soundSrc = soundMap[type];
    let audio = audioCache.get(type);

    if (!audio) {
      audio = new window.Audio(soundSrc);
      audio.preload = "auto";
      audioCache.set(type, audio);
    }

    audio.volume = clampVolume(options?.volume ?? 1);

    if (options?.restart !== false) {
      audio.currentTime = 0;
    }

    try {
      await audio.play();
      return true;
    } catch (err) {
      console.error("Sound playback failed:", err);
      return false;
    }
  }, []);

  return { playSound };
};
