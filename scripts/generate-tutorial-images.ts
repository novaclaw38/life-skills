import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma";
import { generateImage } from "../src/lib/images/nvidia-provider";

async function main() {
  const force = process.argv.includes("--force");

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "tutorial-images";
  if (!supabaseUrl || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  }
  const supabase = createClient(supabaseUrl, serviceKey);

  const steps = await prisma.tutorialStep.findMany({
    where: force ? {} : { imageUrl: null },
    include: { tutorial: true },
  });

  console.log(`Generating images for ${steps.length} step(s)...`);

  for (const step of steps) {
    const prompt = `${step.tutorial.title} — ${step.title}: ${step.contentStandard}`;
    console.log(`- ${step.tutorial.slug} / step ${step.order}: ${step.title}`);

    try {
      const imageBuffer = await generateImage(prompt);
      const path = `${step.tutorialId}/${step.id}.png`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, imageBuffer, { contentType: "image/png", upsert: true });

      if (uploadError) {
        console.error(`  upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

      await prisma.tutorialStep.update({
        where: { id: step.id },
        data: { imageUrl: publicUrlData.publicUrl },
      });

      console.log(`  done -> ${publicUrlData.publicUrl}`);
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
