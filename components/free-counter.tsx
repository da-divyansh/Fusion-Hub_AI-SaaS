"use client";

import { useEffect, useState } from "react";
import { MAX_FREE_COUNTS } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { useProModel } from "@/hooks/use-pro-model";

interface FreeCounterProps {
    apiLimitCount : number;
    isPro: boolean;
} 

const FreeCounter = ({
    apiLimitCount = 0,
    isPro = false,
}: FreeCounterProps) =>{
    const proModel = useProModel();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    if (isPro) {
        return null;
    }

    return(
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                    <div className="text-center text-sm text-white mb-4 space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNTS} Free Trial
                        </p>
                        <Progress 
                            className="h-3"
                            value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
                        />
                    </div>
                    <Button className="w-full" variant= "pro" onClick={proModel.onOpen}>
                        Upgrade to pro
                        <Zap className="w-4 h-4 ml-2 fill-white"/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default FreeCounter;