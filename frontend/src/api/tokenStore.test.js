import { beforeEach, describe, expect, it } from "vitest";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
  readTokenFromStorage,
} from "./tokenStore.js";

describe("tokenStore", () => {
  beforeEach(() => {
    localStorage.clear();
    clearAccessToken();
  });

  it("persists the access token to localStorage so checkout can attach Bearer", () => {
    setAccessToken("abc.def.ghi");
    expect(getAccessToken()).toBe("abc.def.ghi");
    expect(localStorage.getItem("wm_access_token")).toBe("abc.def.ghi");
    expect(readTokenFromStorage()).toBe("abc.def.ghi");
  });

  it("reads a token that was already in localStorage (e.g. after a refresh)", () => {
    localStorage.setItem("wm_access_token", "stored-token");
    // getAccessToken falls back to storage when memory is empty
    expect(readTokenFromStorage()).toBe("stored-token");
  });

  it("also recognises the generic 'token' / 'accessToken' keys", () => {
    localStorage.setItem("token", "legacy-token");
    expect(readTokenFromStorage()).toBe("legacy-token");
  });

  it("clears both memory and every known storage key", () => {
    localStorage.setItem("token", "a");
    localStorage.setItem("accessToken", "b");
    setAccessToken("c");
    clearAccessToken();
    expect(getAccessToken()).toBeNull();
    expect(readTokenFromStorage()).toBeNull();
  });
});
