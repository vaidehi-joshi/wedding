"use client";

import { useEffect, useState, useRef } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Events", href: "#events" },
];

export function Navbar() {
  const [activeSection, setActiveSection] = useState("#home");
  const isManualScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // If we are programmatically scrolling to a section, don't update the active section based on scroll position
      if (isManualScrolling.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // If we're in the first 1.25 viewport heights (home + text section animation), show home as active
      if (scrollY < windowHeight * 1.25) {
        setActiveSection("#home");
        return;
      }

      // For other sections, check which one is closest to the top of the viewport
      const sections = navItems.map(item => {
        const id = item.href.replace("#", "");
        const element = document.getElementById(id);
        if (!element || id === "home") return null;

        const rect = element.getBoundingClientRect();
        // Calculate distance from top of viewport
        const distanceFromTop = Math.abs(rect.top);

        return {
          href: item.href,
          distanceFromTop,
          isInView: rect.top < windowHeight && rect.bottom > 0
        };
      }).filter(Boolean);

      // Find the section that's most visible (closest to top and in view)
      const activeSection = sections
        .filter(s => s!.isInView)
        .sort((a, b) => a!.distanceFromTop - b!.distanceFromTop)[0];

      if (activeSection) {
        setActiveSection(activeSection.href);
      }
    };

    // Initial check
    handleScroll();

    // Listen to scroll events
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setActiveSection(href);

    // Set manual scrolling flag
    isManualScrolling.current = true;
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    // approximate duration of smooth scroll
    scrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false;
    }, 1000);

    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full py-4">
      <div className="container mx-auto px-4">
        <NavigationMenu viewport={false}>
          <NavigationMenuList className="gap-0">
            {navItems.map((item) => {
              const isActive = activeSection === item.href;
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    onClick={(e) => handleClick(e, item.href)}
                    className={cn(
                      "group inline-flex h-auto w-max items-center justify-center rounded-md px-5 py-2 text-base md:text-lg font-light transition-all duration-300",
                      isActive ? "text-[#D0AD94]" : "text-[#697564]",
                      "hover:text-[#D0AD94]",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ACB393]/50"
                    )}
                    style={{
                      letterSpacing: "0.1em",
                      fontFamily: '"Libre Caslon Condensed Variable", serif'
                    }}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}

