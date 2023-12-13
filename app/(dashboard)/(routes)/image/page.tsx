"use client"
  
import { useRouter } from "next/navigation";
import  Image  from "next/image";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { amountOptions, formSchema, resolutionOptions } from "./constants";
  
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from '@/components/empty';
import { Loader } from '@/components/loader';
import { Card, CardFooter } from "@/components/ui/card";
import { Download, ImageIcon } from "lucide-react";
  
  const ImagePage = () => {
    const router = useRouter();
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        prompt: "",
        amount: "1",
        resolution: "512x512"
      }
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setImages([]);
        const response = await axios.post("/api/image", values);
        if (Array.isArray(response.data.imageUrls) && response.data.imageUrls.length > 0) {
          const urls = response.data.imageUrls;
          setImages(urls);
        } else {
          console.error("Invalid response structure", response.data);
        }
        form.reset();
      } catch (error) {
        console.error("Image_Error", error);
      } finally {
        router.refresh();
      }
    };

    return (
      <div>
        <Heading
          title="Image Generation"
          description="Most advanced image generation model."
          icon={ImageIcon}
          iconColor="text-pink-500"
          bgColor="bg-pink-500/10"
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
                    <FormItem className="col-span-12 lg:col-span-6">
                      <FormControl className="m-0 p-0">
                        <Input
                          className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent w-full "
                          disabled={isLoading}
                          placeholder="Turn your thoughts into image"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select 
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value= {field.value}
                        defaultValue= {field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue  defaultValue = {field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {amountOptions.map((option) =>(
                            <SelectItem
                              key ={option.value}
                              value= {option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resolution"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-2">
                      <Select 
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value= {field.value}
                        defaultValue= {field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue defaultValue={field.value} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {resolutionOptions.map((option) =>(
                            <SelectItem
                              key ={option.value}
                              value= {option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              <div className="p-20">
                <Loader />
              </div>
            )}
            {images.length == 0 && !isLoading && (
              <div>
                <Empty label='Image generation not started.' />            
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
              {images.map((src) =>(
                <Card
                  key={src}
                  className="rounded-lg overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      alt="Image"
                      fill
                      src={src}
                    />
                  </div>
                  <CardFooter className="p-2">
                      <Button 
                        variant="secondary" 
                        className="w-full"
                        onClick={() => window.open(src)}
                      >
                          <Download className="h-4 w-4 mr-2"/>
                      </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }  
export default ImagePage;
  