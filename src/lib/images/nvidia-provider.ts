const NVIDIA_IMAGE_ENDPOINT = "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev";

// flux.1-dev only accepts these fixed dimensions; 1344x768 is the closest to 16:9.
const WIDTH = 1344;
const HEIGHT = 768;

export async function generateImage(prompt: string): Promise<Buffer> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not set.");
  }

  const response = await fetch(NVIDIA_IMAGE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `simple, clear, friendly instructional illustration: ${prompt}`,
      width: WIDTH,
      height: HEIGHT,
      seed: 0,
      steps: 30,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`NVIDIA image generation failed with status ${response.status}: ${detail}`);
  }

  const data = (await response.json()) as { artifacts: { base64: string }[] };
  const artifact = data.artifacts[0];
  if (!artifact) {
    throw new Error("NVIDIA image generation returned no artifacts.");
  }
  return Buffer.from(artifact.base64, "base64");
}
