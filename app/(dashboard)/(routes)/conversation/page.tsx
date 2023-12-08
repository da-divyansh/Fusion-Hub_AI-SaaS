"use client"
  
  import { ChatCompletionRequestMessage } from 'openchat';
  import { useRouter } from "next/navigation";
  import { MessageSquare } from "lucide-react";
  import axios, { AxiosError } from "axios";
  import * as z from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  
  import { formSchema } from "./constants";
  
  import { useForm } from "react-hook-form";
  import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
  import Heading from "@/components/heading";
  import { Input } from "@/components/ui/input";
  import { Button } from "@/components/ui/button";
  import { useState } from "react";
  
  const ConversationPage = () => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: ""
      }
    });
  
    const isLoading = form.formState.isSubmitting;
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        const userMessage: ChatCompletionRequestMessage = {
          role: "user",
          content: values.prompt,
        };
        
        const newMessages = [...messages, userMessage];
        const response = await axios.post("/api/conversation", { messages: newMessages });      
        let responseContent = response.data;
        if (typeof responseContent === "string") {
          responseContent = {
            role: "bot",
            content: responseContent,
          };
        } else {
          responseContent.role = "bot";
        }

        setMessages((current) => [...current, ...newMessages, {...responseContent,}]);
      
        form.reset();
      } catch (error) {
        console.log('[CONVERSATION_ERROR]', error);
      } finally {
        router.refresh();
      }
      
    };
  
    return (
      <div>
        <Heading
          title="Conversation"
          description="Most advanced conversation model."
          icon={MessageSquare}
          iconColor="text-violet-500"
          bgColor="bg-violet-500/10"
        />
        <div className="px-4 lg:px-8">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="rounded-lg border w-full p-4 px-3 md:px-4 focus-within:shadow-sm grid grid-cols-12 gap-2"
              >
                <FormField
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="col-spaan-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-fit"
                          disabled={isLoading}
                          placeholder="Let's start conversation"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                  Generate
                </Button>
              </form>
            </Form>
          </div>
          <div className="space-y-4 mt-4">
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div key={message.content}>
                  {message.role === "user" && (
                    <span>
                      User:
                      <span className="text-gray-600 text-sm font-medium pl-2">{message.content.charAt(0).toUpperCase() + message.content.slice(1)}</span>
                    </span>
                    )}
                  {message.role === "bot" && (
                    <span>
                      Bot:
                      <span className="text-gray-700 text-sm font-bold pl-2">{message.content}</span>
                    </span>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default ConversationPage;
  