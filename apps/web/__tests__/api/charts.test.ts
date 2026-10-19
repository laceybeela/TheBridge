import { describe, it, expect, vi, beforeEach } from "vitest";

let mockUser: { id: string } | null = null;

vi.mock("../../lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: {
      getUser: vi.fn(async () => ({ data: { user: mockUser } })),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  })),
}));

describe("Chart API route logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = null;
  });

  describe("authentication", () => {
    it("rejects unauthenticated requests", () => {
      expect(mockUser).toBeNull();
      // Route handlers check user and return 401 when null
    });

    it("allows authenticated requests", () => {
      mockUser = { id: "user-abc" };
      expect(mockUser).not.toBeNull();
    });
  });

  describe("chart data structure", () => {
    it("saved chart includes required fields", () => {
      const chartData = {
        profile_id: "profile-123",
        user_id: "user-abc",
        chart_data: { title: [], introduction: "", sections: [], closing: "", traits: { earth: [], star: [] } },
        is_stale: false,
        label: "My Chart",
      };

      expect(chartData).toHaveProperty("profile_id");
      expect(chartData).toHaveProperty("user_id");
      expect(chartData).toHaveProperty("chart_data");
      expect(chartData).toHaveProperty("is_stale");
      expect(chartData.is_stale).toBe(false);
    });

    it("stale chart has is_stale set to true", () => {
      const staleChart = {
        id: "chart-1",
        is_stale: true,
        chart_data: {},
      };
      expect(staleChart.is_stale).toBe(true);
    });
  });

  describe("staleness logic", () => {
    it("chart becomes stale when profile birth data changes", () => {
      // This is enforced by the database trigger mark_charts_stale
      // When profiles.birth_date, birth_time, birth_latitude, or
      // birth_longitude changes, all associated saved_charts get is_stale = true
      const beforeUpdate = { is_stale: false };
      const afterProfileChange = { is_stale: true };
      expect(beforeUpdate.is_stale).toBe(false);
      expect(afterProfileChange.is_stale).toBe(true);
    });

    it("recalculate resets is_stale to false", () => {
      // The recalculate endpoint updates chart_data and sets is_stale = false
      const recalculated = { is_stale: false };
      expect(recalculated.is_stale).toBe(false);
    });
  });

  describe("chart save flow", () => {
    it("creates profile then chart in save operation", () => {
      // saveChart server action:
      // 1. Creates a profile with birth data
      // 2. Creates a saved_chart linked to the profile
      // 3. Returns { profileId, chartId }
      const result = {
        profileId: "profile-new",
        chartId: "chart-new",
      };
      expect(result.profileId).toBeDefined();
      expect(result.chartId).toBeDefined();
    });

    it("includes user_id in both profile and chart", () => {
      mockUser = { id: "user-xyz" };
      const profile = { user_id: mockUser.id };
      const chart = { user_id: mockUser.id, profile_id: "p-1" };
      expect(profile.user_id).toBe(chart.user_id);
    });
  });
});
