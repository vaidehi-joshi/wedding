"use client";

import React from "react";
import { rusticRoadway } from "@/lib/fonts";

interface TornPaperNoteProps {
    children: React.ReactNode;
    className?: string;
    rotation?: string;
    animationDelay?: number; // Delay in milliseconds
    isVisible?: boolean; // Controls whether animation should play
}

export function TornPaperNote({
    children,
    className = "",
    rotation = "rotate-0",
    animationDelay = 0,
    isVisible = false
}: TornPaperNoteProps) {
    return (
        <div
            className={`relative isolate ${rotation} ${className}`}
            style={{
                transformOrigin: "center center",
                filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.15))"
            }}
        >
            {/* Main Note Container */}
            <div
                className="relative bg-[#fdfbf6] transition-transform hover:scale-[1.02] duration-300 ease-out"
                style={{
                    // Ruled lines pattern
                    backgroundImage: `linear-gradient(#e5e0d8 1px, transparent 1px)`,
                    backgroundSize: '100% 28px',
                    backgroundPosition: '0 20px',
                }}
            >
                {/* Torn Edge (Left side) - Simulating torn spiral holes */}
                <div
                    className="absolute top-0 -left-[18px] w-[20px] h-full z-20 bg-[#fdfbf6]"
                    style={{
                        WebkitMaskImage: "radial-gradient(circle at 0px 50%, transparent 6px, black 7px)",
                        maskImage: "radial-gradient(circle at 0px 50%, transparent 6px, black 7px)",
                        WebkitMaskSize: "100% 30px",
                        maskSize: "100% 30px",
                    }}
                />

                {/* Tape - More realistic washi look */}
                <div
                    className="absolute -top-[12px] right-[35%] w-[70px] h-[30px] z-30"
                    style={{
                        transform: "rotate(-4deg)",
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        backdropFilter: "blur(1px)",
                        clipPath: "polygon(2% 0%, 98% 0%, 100% 10%, 97% 20%, 99% 30%, 97% 40%, 100% 50%, 97% 60%, 100% 70%, 97% 80%, 100% 90%, 98% 100%, 2% 100%, 3% 90%, 1% 80%, 3% 70%, 1% 60%, 3% 50%, 1% 40%, 3% 30%, 1% 20%, 3% 10%)"
                    }}
                />

                {/* Content with handwriting animation */}
                <div
                    className={`relative z-10 text-[#3a3530] pl-[25px] pr-[20px] min-h-[140px] flex flex-col justify-center text-center overflow-hidden ${rusticRoadway.className}`}
                    style={{
                        clipPath: isVisible ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
                        transition: isVisible ? `clip-path 1s ease-out ${animationDelay}ms` : 'none',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        lineHeight: '28px',
                        fontSize: '1.1rem',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
