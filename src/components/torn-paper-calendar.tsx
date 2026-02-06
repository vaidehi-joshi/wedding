"use client";

import React from "react";

export function TornPaperCalendar() {
    return (
        <>
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Montserrat:wght@300;500&display=swap');
      `}</style>

            <div className="relative w-[450px] bg-[#fdfcf9] pl-[60px] pr-[40px] pt-[50px] pb-[40px] shadow-[10px_10px_30px_rgba(0,0,0,0.5)] rounded-r-[15px] isolate">
                {/* Torn Edge */}
                <div
                    className="absolute top-0 left-0 w-[40px] h-full bg-[#fdfcf9]"
                    style={{
                        WebkitMaskImage: "radial-gradient(circle at 0px 50%, transparent 15px, black 16px)",
                        maskImage: "radial-gradient(circle at 0px 50%, transparent 15px, black 16px)",
                        WebkitMaskSize: "100% 45px",
                        maskSize: "100% 45px",
                        backgroundImage: "linear-gradient(to right, #e0e0e0 1px, transparent 1px)",
                        backgroundPosition: "38px 0"
                    }}
                />

                {/* Tape */}
                <div
                    className="absolute -top-[15px] right-[20px] w-[120px] h-[40px] bg-white/40 shadow-[2px_2px_5px_rgba(0,0,0,0.1)] z-10 backdrop-blur-[2px]"
                    style={{
                        transform: "rotate(25deg)",
                        clipPath: "polygon(0% 10%, 95% 0%, 100% 90%, 5% 100%)"
                    }}
                />

                {/* Grid Line Overlay */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-30 z-0"
                    style={{
                        backgroundImage: "linear-gradient(#d1d1d1 1px, transparent 1px)",
                        backgroundSize: "100% 40px"
                    }}
                />

                {/* Content */}
                <div className="relative z-10 text-[#1a1a1a]">
                    <h1
                        className="text-[3.5rem] mt-0 mx-0 mb-[30px] tracking-[-2px] uppercase font-[800] text-center"
                        style={{ fontFamily: '"Bodoni Moda", serif' }}
                    >
                        FEBRUARY
                    </h1>

                    <div
                        className="grid grid-cols-7 border-y border-[#d1d1d1] py-[10px] mb-[20px] text-[0.7rem] font-[500] tracking-[1px] text-center"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                            <div key={day}>{day}</div>
                        ))}
                    </div>

                    <div
                        className="grid grid-cols-7 gap-y-[20px] text-center font-[500] text-[1.1rem]"
                        style={{ fontFamily: '"Bodoni Moda", serif' }}
                    >
                        {/* Empty cells for padding if needed, but going by user's html, it starts at 1 */}
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => (
                            <div key={date}>{date}</div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
