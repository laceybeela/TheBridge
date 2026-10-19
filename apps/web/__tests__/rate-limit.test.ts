import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "../lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows requests within the limit", () => {
    const result = checkRateLimit("192.168.1.1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("tracks remaining tokens", () => {
    for (let i = 0; i < 5; i++) {
      checkRateLimit("192.168.1.2");
    }
    const result = checkRateLimit("192.168.1.2");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks after 10 requests", () => {
    for (let i = 0; i < 10; i++) {
      const r = checkRateLimit("192.168.1.3");
      expect(r.allowed).toBe(true);
    }
    const blocked = checkRateLimit("192.168.1.3");
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("isolates rate limits by IP", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("192.168.1.4");
    }
    // Different IP should still be allowed
    const result = checkRateLimit("192.168.1.5");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("continues to block after exhaustion", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("192.168.1.6");
    }
    // Multiple blocked requests
    expect(checkRateLimit("192.168.1.6").allowed).toBe(false);
    expect(checkRateLimit("192.168.1.6").allowed).toBe(false);
    expect(checkRateLimit("192.168.1.6").allowed).toBe(false);
  });

  it("allows exactly 10 requests", () => {
    let allowedCount = 0;
    for (let i = 0; i < 15; i++) {
      if (checkRateLimit("192.168.1.7").allowed) {
        allowedCount++;
      }
    }
    expect(allowedCount).toBe(10);
  });

  it("first request returns 9 remaining", () => {
    const result = checkRateLimit("fresh-ip");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("resets state via resetRateLimits", () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit("192.168.1.8");
    }
    expect(checkRateLimit("192.168.1.8").allowed).toBe(false);

    resetRateLimits();
    expect(checkRateLimit("192.168.1.8").allowed).toBe(true);
  });
});
