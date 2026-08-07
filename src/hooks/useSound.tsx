import { useCallback } from "react";
import clickTone from "../assets/sounds/click-tone.wav";
import errorTone from "../assets/sounds/error-tone.wav";
import notificationTone from "../assets/sounds/notification-tone.wav";
import successTone from "../assets/sounds/success-tone.wav";
import swipeTone from "../assets/sounds/swipe-tone.wav";

type SoundType =
  | "click"
  | "error"
  | "success"
  | "alert"
  | "notification"
  | "swipe";

const soundMap: Record<SoundType, string> = {
  click: clickTone,
  alert: errorTone,
  notification: notificationTone,
  error: errorTone,
  success: successTone,
  swipe: swipeTone,
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