import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useDeviceSupport, useSound } from "../index";
import { useDeviceSupport as useDeviceSupportFromSdk, useSound as useSoundFromSdk } from "../sdk";
import useGridClasses from "../hooks/useGridClasses";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("hook exports and sound behavior", () => {
  it("exports the device and sound hooks from the library entrypoint", () => {
    expect(useDeviceSupport).toBeTypeOf("function");
    expect(useSound).toBeTypeOf("function");
  });

  it("falls back to the full-width span when no grid span rule is provided", () => {
    const { result } = renderHook(() =>
      useGridClasses(
        { width: 375, height: 812 },
        { card: {} },
      ),
    );

    expect(result.current.deviceType).toBe("mobile");
    expect(result.current.gridClasses.card).toBe("col-span-mobile-12");
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
    result.current.playSound("notification");
    result.current.playSound("notification");

    await Promise.resolve();

    expect(AudioMock).toHaveBeenCalledWith(expect.stringContaining("notification-tone.wav"));
    expect(AudioMock).toHaveBeenCalledTimes(2);
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("uses different asset paths based on the requested sound type", async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const calls: string[] = [];

    const AudioMock = vi.fn(function (
      this: { src: string; play: typeof play; currentTime: number; volume: number; preload: string },
      src: string,
    ) {
      this.src = src;
      calls.push(src);
      this.play = play;
      this.currentTime = 0;
      this.volume = 1;
      this.preload = "none";
    });

    vi.stubGlobal("Audio", AudioMock as unknown as typeof Audio);

    const { result } = renderHook(() => useSound());
    result.current.playSound("click");
    result.current.playSound("error");
    result.current.playSound("success");
    result.current.playSound("alert");
    result.current.playSound("notification");
    result.current.playSound("swipe");

    await Promise.resolve();

    expect(calls).toHaveLength(6);
    expect(calls[0]).toContain("click-tone.wav");
    expect(calls[1]).toContain("error-tone.wav");
    expect(calls[2]).toContain("success-tone.wav");
    expect(calls[3]).toContain("error-tone.wav");
    expect(calls[4]).toContain("notification-tone.wav");
    expect(calls[5]).toContain("swipe-tone.wav");
  });
});
