import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionRequestMessage } from "openchat";

// Custom message for instruction  
const instructionMessage : ChatCompletionRequestMessage =  {
  role : "system",
  content: "you are a code generater, you should must always send a response only in markdown code snippets using comments for explanations  and very precise. "
}

// Configuration for OpenAI API key
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};

// Create an instance of OpenAI with the configuration
const openai = new OpenAI(configuration);

// Function to create chat completion
async function createChatCompletion(request: any): Promise<any> {
  try {
    // Use the create method for chat completions
    const response = await openai.chat.completions.create(request);

    return response;
  } catch (error) {
    console.log('[CODE_ERROR]', error);
    throw new Error("Failed to create chat completion");
  }
}

// Main API route handler
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 404 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const messagesWithInstruction = [...messages, instructionMessage];

    const createChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages: messagesWithInstruction,
    };
    const response = await createChatCompletion(createChatCompletionRequest);
    return NextResponse.json(response.choices[0]?.message?.content || '');
    
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}