"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("5d35ccac-b5f0-40ba-bec9-c17e60733d36")
    }, []);

    return null;
}