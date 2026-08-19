import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma";
import { generateImage } from "../src/lib/images/nvidia-provider";

const STYLE_PREFIX =
  "modern flat vector illustration style, bright educational illustration, clean line art, white background: ";

interface ImageStore {
  save(relativePath: string, imageBuffer: Buffer): Promise<string>;
}

class SupabaseImageStore implements ImageStore {
  constructor(
    private supabase: ReturnType<typeof createClient>,
    private bucket: string
  ) {}

  async save(relativePath: string, imageBuffer: Buffer): Promise<string> {
    const { error: uploadError } = await this.supabase.storage
      .from(this.bucket)
      .upload(relativePath, imageBuffer, { contentType: "image/png", upsert: true });

    if (uploadError) {
      throw new Error(`upload failed: ${uploadError.message}`);
    }

    const { data: publicUrlData } = this.supabase.storage.from(this.bucket).getPublicUrl(relativePath);
    return publicUrlData.publicUrl;
  }
}

class LocalImageStore implements ImageStore {
  private root = path.join(process.cwd(), "public", "tutorials");

  async save(relativePath: string, imageBuffer: Buffer): Promise<string> {
    const filePath = path.join(this.root, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, imageBuffer);
    return `/tutorials/${relativePath}`;
  }
}

function getImageStore(): ImageStore {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "tutorial-images";

  if (supabaseUrl && serviceKey) {
    console.log(`Storing images in Supabase bucket "${bucket}".`);
    return new SupabaseImageStore(createClient(supabaseUrl, serviceKey), bucket);
  }

  console.log("SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set — storing images in public/tutorials/.");
  return new LocalImageStore();
}

async function main() {
  const force = process.argv.includes("--force");
  const store = getImageStore();

  const steps = await prisma.tutorialStep.findMany({
    where: force ? {} : { imageUrl: null },
    include: { tutorial: true },
  });

  console.log(`Generating images for ${steps.length} step(s)...`);

  for (const step of steps) {
    const prompt = `${STYLE_PREFIX}${step.tutorial.title} — ${step.title}: ${step.contentStandard}`;
    console.log(`- ${step.tutorial.slug} / step ${step.order}: ${step.title}`);

    try {
      const imageBuffer = await generateImage(prompt);
      const relativePath = `${step.tutorialId}/${step.id}.png`;
      const imageUrl = await store.save(relativePath, imageBuffer);

      await prisma.tutorialStep.update({
        where: { id: step.id },
        data: { imageUrl },
      });

      console.log(`  done -> ${imageUrl}`);
    } catch (err) {
      console.error(`  failed: ${err instanceof Error ? err.message : err}`);
    }
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
