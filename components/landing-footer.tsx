"use client";

import { Montserrat } from "next/font/google";
import  Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";    

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const font = Montserrat({
    subsets: ["latin"],
    weight: ["600"],
});

export const LandingFooter = () => {
    const isSignedIn = useAuth();

    return (
        <footer className="p-4 bg-transparent flex items-center justify-between">
                    <h1 className={cn("text-2xl font-bold text-white", font.className)}>
                        Fusion Hub
                    </h1>
                    <span className="ml-2 text-sm text-white opacity-75">
                        © 2024 All rights reserved to Fusion Hub AI.
                    </span>
                <div className="flex items-center gap-x-2">
                    <Link href={""}>
                        <Button variant="outline" className="rounded-full font-semibold hover:bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 border-0">
                            Github
                        </Button>
                    </Link>
                </div>
        </footer>

    )
};