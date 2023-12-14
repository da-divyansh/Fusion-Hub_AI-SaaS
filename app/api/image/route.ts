import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { incrementApiLimit, checkApiLimit } from "@/lib/api-limit";

// Configuration for OpenAI API key
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
// Create an instance of OpenAI with the configuration
const openai = new OpenAI(configuration);
// Function to generate images
async function generateImage(request: any): Promise<any> {
  try {
    const response = await openai.images.generate(request);
    return response;
  } catch (error) {
    console.error('[IMAGE_GENERATION_ERROR]', error);
    throw new Error("Failed to generate image");
  }
}
// Main API route handler
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = '512x512' } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 404 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }
    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }
    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();

    if(!freeTrial) {
      return new NextResponse("Free trial is expired.", {status: 403});
    }


    const imageRequest = {
      model: 'dall-e-2',
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    };

    await incrementApiLimit();

    const response = await generateImage(imageRequest);

    if (Array.isArray(response.data) && response.data.length > 0) {
      const imageUrls = response.data.map((item: { url: any; }) => item.url);
      return NextResponse.json({ imageUrls });
    } else {
       return new NextResponse('Invalid response structure', { status: 500 });
      }
    } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
