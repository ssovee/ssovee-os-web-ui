import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDeviceSupport, useSound } from "../index";
import { useDeviceSupport as useDeviceSupportFromSdk, useSound as useSoundFromSdk } from "../sdk";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hook exports and sound behavior", () => {
  it("exports the device and sound hooks from the library entrypoint", () => {
    expect(useDeviceSupport).toBeTypeOf("function");
    expect(useSound).toBeTypeOf("function");
  });

  it("exports the hooks through the sdk entrypoint", () => {
    expect(useDeviceSupportFromSdk).toBeTypeOf("function");
    expect(useSoundFromSdk).toBeTypeOf("function");
  });

  it("uses the correct notification sound asset path", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const AudioMock = vi.fn(function (this: { src: string; play: typeof play; currentTime: number; volume: number; preload: string }, src: string) {
      this.src = src;
      this.play = play;
      this.currentTime = 1;
      this.volume = 1;
      this.preload = "none";
    });

    vi.stubGlobal("Audio", AudioMock as unknown as typeof Audio);

    const { result } = renderHook(() => useSound());
    result.current.playSound("notification", { volume: 0.25 });
    result.current.playSound("notification");

    await Promise.resolve();

    expect(AudioMock).toHaveBeenCalledWith(expect.stringContaining("notification-tone.wav"));
    expect(AudioMock).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledTimes(2);
  });
});
