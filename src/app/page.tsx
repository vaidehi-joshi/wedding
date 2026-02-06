"use client";

import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { CalendarCard } from "@/components/calendar-card";
import { TornPaperNote } from "@/components/torn-paper-note";
import { useEffect, useRef, useState } from "react";

// Events section component with shared visibility state
function EventsContent() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Animation delays matching the calendar circles
  const delays = {
    rightTop: 0, // Syncs with date 18 circle (0ms delay)
    leftCenter: 1500, // Syncs with date 22 circle (1500ms delay)
    rightBottom: 3000, // Syncs with date 28 circle (3000ms delay)
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[380px] flex flex-col items-center xl:block">
      <CalendarCard isVisible={isVisible} />

      {/* Right Top Note - appears when 18 is circled */}
      <div className="relative mt-8 block xl:absolute xl:left-[calc(100%+4rem)] xl:top-10 xl:mt-0">
        <TornPaperNote rotation="rotate-6" className="w-[280px]" isVisible={isVisible} animationDelay={delays.rightTop}>
          <h3 className="font-bold text-xl tracking-widest mb-2">Sangeet</h3>
          <p className="text-sm">Pune</p>
          <p className="text-sm italic">5 PM</p>
        </TornPaperNote>
      </div>

      {/* Left Center Note - appears when 22 is circled */}
      <div className="relative mt-8 block xl:absolute xl:right-[calc(100%+4rem)] xl:top-1/2 xl:-translate-y-1/2 xl:mt-0">
        <TornPaperNote rotation="-rotate-6" className="w-[280px]" isVisible={isVisible} animationDelay={delays.leftCenter}>
          <h3 className="font-bold text-xl tracking-widest mb-2">Wedding</h3>
          <p className="text-sm">Gobichettipalayam</p>
          <p className="text-sm italic">9 AM</p>
        </TornPaperNote>
      </div>

      {/* Right Bottom Note - appears when 28 is circled */}
      <div className="relative mt-8 block xl:absolute xl:left-[calc(100%+4rem)] xl:bottom-10 xl:mt-0">
        <TornPaperNote rotation="-rotate-3" className="w-[280px]" isVisible={isVisible} animationDelay={delays.rightBottom}>
          <h3 className="font-bold text-xl tracking-widest mb-2">Reception</h3>
          <p className="text-sm">Pune</p>
          <p className="text-sm italic">7 PM</p>
        </TornPaperNote>
      </div>
    </div>
  );
}


export default function Home() {
  const textSectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Text content split into words
  const headingText = "Surprise! We're getting married.";
  const paragraphText = "(Okay, maybe not a surprise… but still exciting.) And we'd love for you to come celebrate with us and also witness us looking the most put-together we've ever looked. This website has all the deets so you can text us \"we're on the way!\" instead of \"send location\" while you're still in pajamas.";

  // Split into words and spaces, preserving both
  const headingWords = headingText.split(/(\s+)/);
  const paragraphWords = paragraphText.split(/(\s+)/);

  // Count actual words (non-space tokens)
  const headingWordCount = headingWords.filter(w => w.trim().length > 0).length;
  const paragraphWordCount = paragraphWords.filter(w => w.trim().length > 0).length;
  const totalWords = headingWordCount + paragraphWordCount;

  // Color interpolation function for word-by-word highlighting
  const getWordColor = (wordIndex: number, totalWords: number, progress: number) => {
    // Calculate the position of this word in the overall progress (0 to 1)
    const wordPosition = (wordIndex + 1) / totalWords;

    // Calculate how much this word should be highlighted
    // Words before the progress point are fully highlighted
    // Words at the progress point are partially highlighted
    // Words after are not highlighted
    let highlightProgress = 0;

    if (wordPosition <= progress) {
      // This word should be highlighted
      // Calculate smooth transition for the word at the progress boundary
      const wordsToHighlight = progress * totalWords;
      const currentWordProgress = wordsToHighlight - wordIndex;

      if (currentWordProgress >= 1) {
        // Fully highlighted
        highlightProgress = 1;
      } else if (currentWordProgress > 0) {
        // Partially highlighted (smooth transition)
        highlightProgress = currentWordProgress;
      }
    }

    // Interpolate color based on highlight progress
    const startColor = { r: 247, g: 244, b: 230 }; // #f7f4e6 (light)
    const endColor = { r: 105, g: 117, b: 100 }; // #697564 (dark green)
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * highlightProgress);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * highlightProgress);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * highlightProgress);

    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;

          if (textSectionRef.current) {
            const textSlideStart = 0;
            const textSlideEnd = windowHeight * 1.2;

            const slideRawProgress = Math.max(0, Math.min(1, (scrollY - textSlideStart) / (textSlideEnd - textSlideStart)));

            // Check if animation should end
            if (slideRawProgress >= 0.99 && isAnimating) {
              setIsAnimating(false);
            }

            if (isAnimating) {
              // Cubic easing
              const slideEasedProgress = slideRawProgress < 0.5
                ? 4 * slideRawProgress * slideRawProgress * slideRawProgress
                : 1 - Math.pow(-2 * slideRawProgress + 2, 3) / 2;

              const translateY = 100 - (slideEasedProgress * 100);
              textSectionRef.current.style.transform = `translateY(${translateY}vh)`;
              textSectionRef.current.style.zIndex = slideRawProgress > 0.01 ? '10' : '-1';
            }

            // Word highlighting
            const highlightStart = (textSlideStart + textSlideEnd) / 2;
            let highlightProgress = 0;
            if (scrollY >= highlightStart && scrollY <= textSlideEnd) {
              highlightProgress = (scrollY - highlightStart) / (textSlideEnd - highlightStart);
            } else if (scrollY > textSlideEnd) {
              highlightProgress = 1;
            }

            setScrollProgress(highlightProgress);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAnimating]);

  return (
    <>
      <Navbar />

      {/* Container for all scrollable content */}
      <div style={{ position: "relative", width: "100%" }}>

        {/* Home Section - Fixed background */}
        <section
          id="home"
          className="fixed inset-0 z-0 h-screen w-full overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/new.jpeg"
              alt="Wedding background"
              fill
              priority
              className="object-cover"
              quality={90}
            />
            {/* Gradient overlay from bottom for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 5%, transparent 100%)"
              }}
            />
          </div>

          <div className="relative z-10 flex h-full w-full items-end">
            <div
              className="w-full"
              style={{
                paddingLeft: "clamp(40px, 8vw, 140px)",
                paddingRight: "clamp(40px, 8vw, 140px)",
                paddingBottom: "clamp(16px, 6vh, 72px)",
                color: "#f7f4e6",
                fontFamily: '"Libre Caslon Text", serif',
              }}
            >
              <div
                className="grid gap-y-3 justify-center"
                style={{
                  gridTemplateColumns: "min-content auto min-content",
                  width: "fit-content",
                  margin: "0 auto"
                }}
              >
                {/* Mobile Top Text */}
                <div
                  className="absolute top-24 w-full flex justify-center md:hidden"
                  style={{
                    left: 0,
                    color: "#f7f4e6",
                    fontFamily: '"Libre Caslon Text", serif',
                  }}
                >
                  <p className="whitespace-nowrap text-[18px] font-semibold" style={{ lineHeight: 1.5 }}>
                    We&apos;re getting married
                  </p>
                </div>

                <div className="col-start-2 flex justify-center md:justify-between items-center md:items-start">
                  <p className="whitespace-nowrap text-[18px] md:text-[20px] font-semibold hidden md:block" style={{ lineHeight: 1.5 }}>
                    We&apos;re getting married
                  </p>
                  <p className="whitespace-nowrap text-[18px] md:text-[20px] font-semibold" style={{ lineHeight: 1.5 }}>
                    Sunday, February 22, 2026
                  </p>
                </div>

                <h1
                  className="text-center col-start-2"
                  style={{
                    fontSize: "clamp(72px, 11vw, 170px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    whiteSpace: "normal",
                    margin: 0,
                  }}
                >
                  Vaidehi &amp; Rohin
                </h1>
              </div>
            </div>
          </div>
        </section>

        {/* Text Section - Slides up over home */}
        <section
          ref={textSectionRef}
          className="w-full h-screen flex items-center justify-center py-20 px-4"
          style={{
            backgroundColor: "#F0E2D2",
            position: isAnimating ? 'fixed' : 'absolute',
            top: isAnimating ? 0 : '100vh',
            left: 0,
            right: 0,
            zIndex: -1,
            transform: isAnimating ? "translateY(100vh)" : "translateY(0)",
            willChange: isAnimating ? "transform" : "auto",
            transition: isAnimating ? 'none' : 'none',
          }}
        >
          <div className="container mx-auto max-w-3xl">
            <div
              className="text-center space-y-6"
              style={{
                fontFamily: '"Libre Caslon Condensed Variable", serif',
                fontSize: "clamp(18px, 2.5vw, 24px)",
                lineHeight: 1.8,
                fontWeight: 300,
              }}
            >
              {/* Anchor image */}
              <div className="flex justify-center mb-16">
                <Image
                  src="/editedanchor.jpeg"
                  alt="Anchor"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              <h2
                className="text-4xl md:text-5xl font-light mb-8"
                style={{
                  fontSize: "clamp(32px, 5vw, 48px)",
                  letterSpacing: "0.05em",
                }}
              >
                {headingWords.map((word, index) => {
                  const isSpace = /^\s+$/.test(word);
                  if (isSpace) {
                    return <span key={index}>{word}</span>;
                  }
                  // Calculate word index (count only non-space words before this one)
                  const wordIndex = headingWords.slice(0, index).filter(w => w.trim().length > 0).length;
                  const color = getWordColor(wordIndex, totalWords, scrollProgress);
                  return (
                    <span
                      key={index}
                      style={{
                        color,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </h2>
              <p>
                {paragraphWords.map((word, index) => {
                  const isSpace = /^\s+$/.test(word);
                  if (isSpace) {
                    return <span key={index}>{word}</span>;
                  }
                  // Calculate word index: heading words + paragraph words before this one
                  const wordIndex = headingWordCount + paragraphWords.slice(0, index).filter(w => w.trim().length > 0).length;
                  const color = getWordColor(wordIndex, totalWords, scrollProgress);
                  return (
                    <span
                      key={index}
                      style={{
                        color,
                        transition: "color 0.2s ease",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </section>

        {/* Spacer - space for home and text sections */}
        <div style={{ height: "200vh", position: "relative" }} />

        {/* Events Section - Normal scroll flow */}
        <section
          id="events"
          className="relative w-full py-20 px-4"
          style={{
            backgroundColor: "#F0E2D2",
            minHeight: "100vh",
            zIndex: 2
          }}
        >
          <div className="container mx-auto flex flex-col items-center" style={{ minHeight: "80vh" }}>
            <EventsContent />
          </div>
        </section>

        {/* Additional content area */}
        <section style={{
          backgroundColor: "#F0E2D2",
          minHeight: "50vh",
          position: "relative",
          zIndex: 2,
          padding: "4rem 1rem"
        }}>
          <div className="container mx-auto text-center" style={{ color: "#697564" }}>
            <p>More sections can be added here...</p>
          </div>
        </section>

      </div>
    </>
  );
}
