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

type PendingPlayback = {
  type: SoundType;
  options?: PlaySoundOptions;
};

let pendingPlaybackQueue: PendingPlayback[] = [];
let interactionListenersBound = false;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const isAutoplayRestrictionError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;

  const maybeError = error as { name?: string; message?: string };
  const message = maybeError.message?.toLowerCase() ?? "";
  return (
    maybeError.name === "NotAllowedError" ||
    message.includes("gesture") ||
    message.includes("user")
  );
};

const playNativeAudio = async (type: SoundType, options?: PlaySoundOptions) => {
  if (typeof window === "undefined" || typeof window.Audio === "undefined") {
    return false;
  }

  const soundSrc = soundMap[type];
  const audio = new window.Audio(soundSrc);
  audio.preload = "auto";
  audio.volume = clampVolume(options?.volume ?? 1);

  if (options?.restart !== false) {
    audio.currentTime = 0;
  }

  try {
    await audio.play();
    return true;
  } catch (err) {
    if (!isAutoplayRestrictionError(err)) {
      console.error("Sound playback failed:", err);
    }
    return false;
  }
};

const flushPendingQueue = () => {
  if (pendingPlaybackQueue.length === 0) return;

  const items = pendingPlaybackQueue;
  pendingPlaybackQueue = [];

  items.forEach(({ type, options }) => {
    void playNativeAudio(type, options);
  });
};

const bindInteractionListeners = () => {
  if (interactionListenersBound || typeof window === "undefined") return;

  interactionListenersBound = true;
  const unlockAndFlush = () => {
    flushPendingQueue();
  };

  window.addEventListener("pointerdown", unlockAndFlush, { passive: true });
  window.addEventListener("keydown", unlockAndFlush, { passive: true });
};

export const useSound = () => {
  const playSound = useCallback(async (type: SoundType, options?: PlaySoundOptions) => {
    bindInteractionListeners();

    const played = await playNativeAudio(type, options);
    if (played) return true;

    pendingPlaybackQueue.push({ type, options });
    return false;
  }, []);

  return { playSound };
};
