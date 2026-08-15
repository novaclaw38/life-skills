import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

import { generateImage } from "@/lib/images/nvidia-provider";

describe("generateImage", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    process.env.NVIDIA_API_KEY = "fake-key";
  });

  it("returns image bytes decoded from a base64 API response", async () => {
    const base64Payload = Buffer.from("fake-image-bytes").toString("base64");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ image: base64Payload }),
    });

    const result = await generateImage("a hand loosening a lug nut with a wrench, diagram");

    expect(result.toString()).toBe("fake-image-bytes");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws a friendly error when the API responds with a failure", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500 });

    await expect(generateImage("prompt")).rejects.toThrow(
      "NVIDIA image generation failed"
    );
  });
});
