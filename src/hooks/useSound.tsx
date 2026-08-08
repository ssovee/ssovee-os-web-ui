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

const soundMap: Record<SoundType, string> = {
  click: clickTone,
  error: errorTone,
  success: successTone,
  alert: errorTone,
  notification: notificationTone,
  swipe: swipeTone,
};

const DEFAULT_SOUND_TYPE: SoundType = "click";
const audioBufferCache = new Map<string, Promise<AudioBuffer>>();

let sharedAudioContext: AudioContext | null = null;

const isSoundType = (type: string): type is SoundType => {
  return type in soundMap;
};

export const useSound = () => {
  const getAudioContext = () => {
    if (typeof window === "undefined") {
      return null;
    }

    const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextCtor) {
      return null;
    }

    if (!sharedAudioContext || sharedAudioContext.state === "closed") {
      sharedAudioContext = new AudioContextCtor();
    }

    return sharedAudioContext;
  };

  const loadAudioBuffer = async (source: string) => {
    const cached = audioBufferCache.get(source);

    if (cached) {
      return cached;
    }

    const promise = (async () => {
      if (typeof fetch !== "function") {
        throw new Error("Fetch is not available");
      }

      const response = await fetch(source);

      if (!response.ok) {
        throw new Error(`Failed to load sound source: ${response.status} ${response.statusText}`);
      }

      const context = getAudioContext();

      if (!context) {
        throw new Error("Web Audio API is not available");
      }

      const arrayBuffer = await response.arrayBuffer();
      return await context.decodeAudioData(arrayBuffer.slice(0));
    })().catch((error) => {
      audioBufferCache.delete(source);
      throw error;
    });

    audioBufferCache.set(source, promise);
    return promise;
  };

  const playWithAudioBuffer = async (buffer: AudioBuffer) => {
    const context = getAudioContext();

    if (!context) {
      throw new Error("Web Audio API is not available");
    }

    if (context.state === "suspended") {
      await context.resume();
    }

    await new Promise<void>((resolve, reject) => {
      const sourceNode = context.createBufferSource();
      sourceNode.buffer = buffer;
      sourceNode.connect(context.destination);
      sourceNode.onended = () => resolve();

      try {
        sourceNode.start(0);
      } catch (error) {
        reject(error);
      }
    });
  };

  const playWithAudioElement = async (source: string) => {
    const audio = new Audio(source);
    audio.preload = "auto";
    audio.currentTime = 0;
    await audio.play();
  };

  const playSound = useCallback((type: SoundType | string) => {
    if (typeof window === "undefined") {
      return;
    }

    const requestedType = isSoundType(type)
      ? type
      : DEFAULT_SOUND_TYPE;

    const src = soundMap[requestedType];

    if (!src) {
      console.error(`Sound playback failed: no source found for "${requestedType}"`);
      return;
    }

    void (async () => {
      let lastError: unknown;

      if (getAudioContext()) {
        try {
          const buffer = await loadAudioBuffer(src);
          await playWithAudioBuffer(buffer);
          return;
        } catch (error) {
          lastError = error;
        }
      }

      try {
        await playWithAudioElement(src);
        return;
      } catch (error) {
        lastError = error;
      }

      console.error(`Sound playback failed for "${requestedType}":`, lastError);
    })();
  }, []);

  return {
    playSound,
  };
};