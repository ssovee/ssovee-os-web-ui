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

const fallbackToneMap: Record<SoundType, { frequency: number; durationMs: number }> = {
  click: { frequency: 900, durationMs: 70 },
  swipe: { frequency: 740, durationMs: 90 },
  success: { frequency: 660, durationMs: 140 },
  notification: { frequency: 580, durationMs: 130 },
  error: { frequency: 260, durationMs: 180 },
  alert: { frequency: 300, durationMs: 170 },
};

let pendingPlaybackQueue: PendingPlayback[] = [];
let interactionListenersBound = false;

const clampVolume = (value: number) => Math.min(1, Math.max(0, value));

const getAssetUrl = (asset: unknown) => {
  if (typeof asset === "string") return asset;

  if (asset && typeof asset === "object") {
    const record = asset as Record<string, unknown>;
    const candidate = record.default ?? record.src ?? record.url ?? record.href;
    if (typeof candidate === "string") return candidate;
  }

  return "";
};

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

const playFallbackTone = (type: SoundType, volume: number) => {
  if (typeof window === "undefined") return false;

  const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return false;

  try {
    const context = new Ctx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const { frequency, durationMs } = fallbackToneMap[type];

    oscillator.type = type === "error" || type === "alert" ? "square" : "sine";
    oscillator.frequency.value = frequency;

    const now = context.currentTime;
    const end = now + durationMs / 1000;
    const safeVolume = Math.min(0.12, Math.max(0.01, volume * 0.08));

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(safeVolume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start(now);
    oscillator.stop(end);

    oscillator.onended = () => {
      void context.close();
    };

    return true;
  } catch {
    return false;
  }
};

const playNativeAudio = async (type: SoundType, options?: PlaySoundOptions) => {
  if (typeof window === "undefined" || typeof window.Audio === "undefined") {
    return false;
  }

  const soundSrc = getAssetUrl(soundMap[type]);
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
    if (isAutoplayRestrictionError(err)) {
      return false;
    }

    const fallbackPlayed = playFallbackTone(type, clampVolume(options?.volume ?? 1));
    if (!fallbackPlayed) {
      console.error("Sound playback failed:", err);
    }
    return fallbackPlayed;
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
