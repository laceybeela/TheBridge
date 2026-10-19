import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

// Mock the supabase server client
const mockSignInWithPassword = vi.fn();
const mockSignUp = vi.fn();
const mockSignOut = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock("../lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signOut: mockSignOut,
      resetPasswordForEmail: mockResetPasswordForEmail,
      updateUser: mockUpdateUser,
    },
  })),
}));

// Must import after mocks
const { signIn, signUp, signOut, resetPassword, updatePassword } = await import(
  "../lib/auth-actions"
);

function makeFormData(entries: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value);
  }
  return fd;
}

describe("auth-actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signIn", () => {
    it("returns error when email is missing", async () => {
      const result = await signIn(makeFormData({ password: "test123" }));
      expect(result).toEqual({ error: "Email and password are required" });
    });

    it("returns error when password is missing", async () => {
      const result = await signIn(makeFormData({ email: "test@test.com" }));
      expect(result).toEqual({ error: "Email and password are required" });
    });

    it("returns error from supabase on failure", async () => {
      mockSignInWithPassword.mockResolvedValue({
        error: { message: "Invalid credentials" },
      });
      const result = await signIn(
        makeFormData({ email: "test@test.com", password: "wrong" })
      );
      expect(result).toEqual({ error: "Invalid credentials" });
    });
  });

  describe("signUp", () => {
    it("returns error when passwords do not match", async () => {
      const result = await signUp(
        makeFormData({
          email: "test@test.com",
          password: "test123",
          confirmPassword: "different",
        })
      );
      expect(result).toEqual({ error: "Passwords do not match" });
    });

    it("returns error when password is too short", async () => {
      const result = await signUp(
        makeFormData({
          email: "test@test.com",
          password: "short",
          confirmPassword: "short",
        })
      );
      expect(result).toEqual({ error: "Password must be at least 6 characters" });
    });

    it("returns success on valid signup", async () => {
      mockSignUp.mockResolvedValue({ error: null });
      const result = await signUp(
        makeFormData({
          email: "test@test.com",
          password: "test123",
          confirmPassword: "test123",
        })
      );
      expect(result).toEqual({
        success: "Check your email for a confirmation link.",
      });
    });

    it("returns error from supabase on failure", async () => {
      mockSignUp.mockResolvedValue({
        error: { message: "User already exists" },
      });
      const result = await signUp(
        makeFormData({
          email: "test@test.com",
          password: "test123",
          confirmPassword: "test123",
        })
      );
      expect(result).toEqual({ error: "User already exists" });
    });
  });

  describe("resetPassword", () => {
    it("returns error when email is missing", async () => {
      const result = await resetPassword(makeFormData({}));
      expect(result).toEqual({ error: "Email is required" });
    });

    it("returns success on valid email", async () => {
      mockResetPasswordForEmail.mockResolvedValue({ error: null });
      const result = await resetPassword(
        makeFormData({ email: "test@test.com" })
      );
      expect(result).toEqual({
        success: "Check your email for a password reset link.",
      });
    });
  });

  describe("updatePassword", () => {
    it("returns error when password is missing", async () => {
      const result = await updatePassword(makeFormData({}));
      expect(result).toEqual({ error: "Password is required" });
    });

    it("returns error when passwords do not match", async () => {
      const result = await updatePassword(
        makeFormData({
          password: "newpass123",
          confirmPassword: "different",
        })
      );
      expect(result).toEqual({ error: "Passwords do not match" });
    });

    it("returns error when password is too short", async () => {
      const result = await updatePassword(
        makeFormData({
          password: "short",
          confirmPassword: "short",
        })
      );
      expect(result).toEqual({ error: "Password must be at least 6 characters" });
    });

    it("returns error from supabase on failure", async () => {
      mockUpdateUser.mockResolvedValue({
        error: { message: "Session expired" },
      });
      const result = await updatePassword(
        makeFormData({
          password: "newpass123",
          confirmPassword: "newpass123",
        })
      );
      expect(result).toEqual({ error: "Session expired" });
    });
  });
});
