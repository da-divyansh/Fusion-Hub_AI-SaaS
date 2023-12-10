"use client"
  
import { ChatCompletionRequestMessage } from 'openchat';
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
  
import { formSchema } from "./constants";
  
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
  
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
        console.log(error);
        
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
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-full"
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
            { isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                <Loader />
              </div>
            )}
            {messages.length == 0 && !isLoading && (
              <div>
                <Empty label='Conversation not started.' />            
              </div>
            )}
            <div className="flex flex-col-reverse gap-y-4">
              {messages.map((message) => (
                <div 
                  key={message.content}
                  className={cn("p-8 w-full flex items-start gap-x-8 rounded-lg", 
                  message.role === "user" ? "bg-white border border-black/10" : "bg-muted")}
                >
                  {message.role === "user" ? <UserAvatar/> : <BotAvatar/>}
                  {message.role === "user" && (
                      <span className="text-gray-600 text-sm font-medium pl-2">
                        {message.content.charAt(0).toUpperCase() + message.content.slice(1)}
                      </span>
                    )}
                  {message.role === "bot" && (
                      <span className="text-gray-700 text-sm font-bold pl-2">{message.content}</span>
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
  