"use client"
  
import { ChatCompletionRequestMessage } from 'openchat';
import { useRouter } from "next/navigation";
import { Code2} from "lucide-react";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from '@/lib/utils';
  
import { formSchema } from "./constants";
  
import ReactMarkdown from "react-markdown"
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
  
  const CodePage = () => {
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
        const response = await axios.post("/api/code", { messages: newMessages });      
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
        console.log("Code Error(Page.tsx)",error);
        
      } finally {
        router.refresh();
      }
      
    };
    
    return (
      <div>
        <Heading
          title="Code Generation"
          description="Most advanced code generation model."
          icon={Code2}
          iconColor="text-green-700"
          bgColor="bg-green-700/10"
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
                          placeholder="Let's start code"
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
                <Empty label='No code generation started.' />            
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
                    <ReactMarkdown
                      components={{
                        pre: ({node, ...props}) =>(
                          <div className='overflow-auto w-full my-2 bg-black/20 p-2 rounded-lg'>
                            <pre {...props}/>
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code className='bg-black/10 rounded-lg p-1' {...props} />
                        )
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {message.content}
                    </ReactMarkdown>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }  
export default CodePage;
  