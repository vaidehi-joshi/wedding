"use client";

import React, { useEffect, useRef, useState } from "react";

interface CalendarCardProps {
    isVisible?: boolean;
}

export function CalendarCard({ isVisible: externalIsVisible }: CalendarCardProps = {}) {
    const [internalIsVisible, setInternalIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Use external isVisible if provided, otherwise use internal state
    const isVisible = externalIsVisible !== undefined ? externalIsVisible : internalIsVisible;

    useEffect(() => {
        // If external isVisible is provided, we don't need the observer
        if (externalIsVisible !== undefined) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setInternalIsVisible(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, [externalIsVisible]);

    // Hand-drawn looking circle path
    // M cx cy ... using cubic beziers to make it look imperfect
    // This is a rough path that goes around the center
    const circlePath = "M 10,12 C 10,6 15,2 25,2 C 38,2 45,8 45,15 C 45,25 35,30 25,30 C 15,30 8,24 8,15 C 8,10 12,5 20,4";

    return (
        <div
            ref={cardRef}
            className="relative max-w-[380px] bg-[#fdfcf9] px-8 py-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] transform rotate-0 mx-auto"
        >
            {/* Tape */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-white/60 shadow-[0_4px_6px_rgba(0,0,0,0.1)] z-10 rounded-[2px]" />

            {/* Title */}
            <h1
                className="text-[3rem] font-bold text-[#697564] uppercase mb-8 leading-none tracking-[0.05em]"
                style={{ fontFamily: '"Libre Caslon Condensed", serif' }}
            >
                February
            </h1>

            {/* Divider */}
            <div className="w-full h-px bg-[#e0e0e0] mb-[15px]" />

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-[25px]">
                {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
                    <div
                        key={day}
                        className="font-normal text-[0.65rem] text-[#697564] uppercase tracking-[0.1em]"
                        style={{ fontFamily: '"Libre Caslon Condensed", serif' }}
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-[25px]">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => {
                    const isTargetDate = [18, 22, 28].includes(date);
                    // Stagger animations slightly
                    const delay = date === 18 ? 0 : date === 22 ? 1500 : 3000;

                    return (
                        <div
                            key={date}
                            className="relative font-normal text-[0.95rem] text-[#697564] flex justify-center items-center h-8"
                            style={{ fontFamily: '"Libre Caslon Text", serif' }}
                        >
                            <span className="relative z-10">{date}</span>

                            {isTargetDate && (
                                <svg
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40px] h-[30px] pointer-events-none overflow-visible"
                                    viewBox="0 0 50 32"
                                >
                                    <path
                                        d={circlePath}
                                        fill="none"
                                        stroke="#697564" /* Match text color but cleaner */
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        style={{
                                            strokeDasharray: 120, // Approximate length
                                            strokeDashoffset: isVisible ? 0 : 120,
                                            transition: isVisible ? `stroke-dashoffset 1s ease-out ${delay}ms` : 'none',
                                            opacity: 0.8,
                                            transform: `rotate(${(date % 3 - 1) * 10}deg)` // Deterministic rotation based on date
                                        }}
                                    />
                                </svg>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
