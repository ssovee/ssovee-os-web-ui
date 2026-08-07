import { useCallback } from "react";

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
  click: new URL("../assets/sounds/click-tone.wav", import.meta.url).href,
  alert: new URL("../assets/sounds/error-tone.wav", import.meta.url).href,
  notification: new URL("../assets/sounds/notification-tone.wav", import.meta.url).href,
  error: new URL("../assets/sounds/error-tone.wav", import.meta.url).href,
  success: new URL("../assets/sounds/success-tone.wav", import.meta.url).href,
  swipe: new URL("../assets/sounds/swipe-tone.wav", import.meta.url).href,
};

type PendingPlayback = {
  type: SoundType;
  options?: PlaySoundOptions;
};

let pendingPlaybackQueue: PendingPlayback[] = [];
let interactionListenersBound = false;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const resolveSoundSrc = (soundSrc: string) => {
  if (!soundSrc) return soundSrc;

  if (
    soundSrc.startsWith("http://") ||
    soundSrc.startsWith("https://") ||
    soundSrc.startsWith("data:") ||
    soundSrc.startsWith("blob:")
  ) {
    return soundSrc;
  }

  try {
    return new URL(soundSrc, import.meta.url).href;
  } catch {
    return soundSrc;
  }
};

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
  const audio = new window.Audio(resolveSoundSrc(soundSrc));
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
  const playSound = useCallback((type: SoundType, options?: PlaySoundOptions) => {
    bindInteractionListeners();

    void playNativeAudio(type, options).then((played) => {
      if (!played) {
        pendingPlaybackQueue.push({ type, options });
      }
    });
  }, []);

  return { playSound };
};
