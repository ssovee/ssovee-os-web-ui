import { useCallback } from "react";

type SoundType =
  | "click"
  | "error"
  | "success"
  | "alert"
  | "notification"
  | "swipe";

const soundMap: Record<SoundType, string> = {
  click: "/sounds/click-tone.wav",
  alert: "/sounds/error-tone.wav",
  notification: "/sounds/notification-tone.wav",
  error: "/sounds/error-tone.wav",
  success: "/sounds/success-tone.wav",
  swipe: "/sounds/swipe-tone.wav",
};

export const useSound = () => {
  const playSound = useCallback((type: SoundType) => {
    if (typeof window === "undefined" || typeof window.Audio === "undefined") {
      return;
    }

    const soundSrc = soundMap[type];
    const audio = new window.Audio(soundSrc);
    audio.play().catch((err) => {
      console.error("Sound playback failed:", err);
    });
  }, []);

  return { playSound };
};
