const NVIDIA_IMAGE_ENDPOINT =
  "https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-3-medium";

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
      cfg_scale: 5,
      aspect_ratio: "16:9",
      seed: 0,
      steps: 30,
    }),
  });

  if (!response.ok) {
    throw new Error(`NVIDIA image generation failed with status ${response.status}`);
  }

  const data = (await response.json()) as { image: string };
  return Buffer.from(data.image, "base64");
}
