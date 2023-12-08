import { auth } from "@clerk/nextjs";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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
    console.log('[CONVERSATION_ERROR]', error);
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

    const createChatCompletionRequest = {
      model: 'gpt-3.5-turbo',
      messages,
    };

    const response = await createChatCompletion(createChatCompletionRequest);
    

    console.log("Request Payload:", createChatCompletionRequest);

    return NextResponse.json(response.choices[0]?.message?.content || '');
    
  } catch (error) {
    console.log('[CONVERSATION_ERROR]', error);

    const axiosError = error as AxiosError;

  if (axiosError.response && axiosError.response.status === 500) {
    // Handle server error
    console.error('Internal Server Error. Please try again later.');
    // You may want to log more details or notify the user
  } else {
    // Handle other errors
    console.error('Failed to create chat completion. Axios Error:', axiosError);
  }

    return new NextResponse("Internal Error", { status: 500 });
  }
}