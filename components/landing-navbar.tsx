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

export const LandingNavbar = () => {
    const isSignedIn = useAuth();

    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative h-9 w-9 mr-4">
                    <Image 
                        src="/logo.png" 
                        alt="logo" 
                        fill
                     />
                </div>
                <h1 className={cn ("text-2xl font-bold text-white", font.className )}>
                    Fusion Hub
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                <Link href={"/sign-up"}>
                    <Button variant="outline" className="rounded-full font-semibold hover:bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 border-0" > 
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    )
};