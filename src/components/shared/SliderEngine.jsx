import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Observer);
}

const SliderEngine = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isEndBlocked, setIsEndBlocked] = useState(false); // New state for signaling the end
  const sectionsRef = useRef([]);
  const contentRef = useRef([]);
  const currentIndex = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sections = sectionsRef.current;
    const contents = contentRef.current;

    // Initial State: Hide all except first
    gsap.set(sections, { autoAlpha: 0, zIndex: 0 });
    gsap.set(sections[0], { autoAlpha: 1, zIndex: 10 });

    const gotoSection = (index, direction) => {
      // Boundary check
      if (index < 0 || index >= sections.length || animating.current) return;

      animating.current = true;
      const isDown = direction === 1;
      const currentSection = sections[currentIndex.current];
      const nextSection = sections[index];
      const currentContent = contents[currentIndex.current];
      const nextContent = contents[index];

      setActiveIdx(index);

      const tl = gsap.timeline({
        defaults: { duration: 1.4, ease: "expo.inOut" },
        onComplete: () => {
          animating.current = false;
          currentIndex.current = index;
        },
      });

      // 1. Prepare Next Section Position
      gsap.set(nextSection, {
        autoAlpha: 1,
        zIndex: 20,
        yPercent: isDown ? 100 : -100,
      });
      gsap.set(nextContent, {
        yPercent: isDown ? -20 : 20, // Parallax start
        scale: 1.1,
      });

      // 2. Animation Sequence
      tl.to(currentSection, {
        yPercent: isDown ? -30 : 30, // Slight movement back
        scale: 0.9, // Shrink effect
        autoAlpha: 0,
      })
        .to(
          nextSection,
          {
            yPercent: 0,
          },
          0,
        )
        .to(
          nextContent,
          {
            yPercent: 0,
            scale: 1,
          },
          0,
        );

      // Clean up previous section
      tl.set(currentSection, { scale: 1 });
    };

    const obs = Observer.create({
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      tolerance: 20,
      preventDefault: false, // allow native scroll
      onDown: (self) => {
        if (animating.current) return;
        if (self.event.target.closest("a, button, [role='button']")) return;
        const scrollable = self.event.target.closest(".scrollable-section");
        if (scrollable) {
          // If we haven't reached the top of the scrollable section, do not slide
          if (scrollable.scrollTop > 2) {
            return;
          }
        }
        gotoSection(currentIndex.current - 1, -1);
      },
      onUp: (self) => {
        if (animating.current) return;
        if (self.event.target.closest("a, button, [role='button']")) return;
        const scrollable = self.event.target.closest(".scrollable-section");
        if (scrollable) {
          // If we haven't reached the bottom of the scrollable section, do not slide
          if (Math.ceil(scrollable.scrollTop + scrollable.clientHeight) < scrollable.scrollHeight - 2) {
            return;
          }
        }
        if (currentIndex.current === sections.length - 1) {
          setIsEndBlocked(true);
          setTimeout(() => setIsEndBlocked(false), 600);
          return;
        }
        gotoSection(currentIndex.current + 1, 1);
      },
    });

    // Keyboard Navigation
    const handleKeyDown = (e) => {
      if (animating.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (currentIndex.current === sections.length - 1) {
          setIsEndBlocked(true);
          setTimeout(() => setIsEndBlocked(false), 600);
          return;
        }
        gotoSection(currentIndex.current + 1, 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp")
        gotoSection(currentIndex.current - 1, -1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      obs.kill();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mounted]);

  if (!mounted) return <div className="bg-black">{children}</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#030303]">
      {/* 🚀 Navigation UI */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-center">
        <div className="w-[1px] h-20 bg-white/10 relative overflow-hidden">
          <motion.div
            animate={{ y: (activeIdx / (children.length - 1)) * 80 }}
            className="absolute top-0 w-full h-1/3 bg-blue-500"
          />
        </div>
        {React.Children.map(children, (_, i) => (
          <button
            key={i}
            onClick={() =>
              !animating.current &&
              activeIdx !== i &&
              (i > activeIdx
                ? gsap.to(
                    {},
                    {
                      onStart: () => {
                        /* trigger move */
                      },
                    },
                  )
                : null)
            }
            className="group relative"
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-500 ${activeIdx === i ? "bg-blue-500 scale-150" : "bg-white/20 group-hover:bg-white/50"}`}
            />
          </button>
        ))}
      </div>

      {/* 🚀 Scroll Indicator with End-of-Page Signal */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="flex flex-col items-center gap-2">
          <motion.span 
            animate={isEndBlocked ? { color: "#ef4444" } : { color: "rgba(255,255,255,0.2)" }}
            className="text-[10px] font-mono tracking-[0.3em] uppercase transition-colors"
          >
            {activeIdx === children.length - 1 ? "End" : "Scroll"}
          </motion.span>
          
          <motion.div
            animate={isEndBlocked ? { x: [-2, 2, -2, 2, 0] } : {}} // Shake signal
            transition={{ duration: 0.4 }}
            className={`w-5 h-8 border rounded-full flex justify-center p-1 transition-colors duration-500 ${isEndBlocked ? 'border-red-500' : 'border-white/20'}`}
          >
            <motion.div
              // Stop moving and stay at bottom when finished, or bounce normally
              animate={activeIdx === children.length - 1 ? { y: 14 } : { y: [0, 12, 0] }}
              transition={activeIdx === children.length - 1 ? { type: "spring" } : { repeat: Infinity, duration: 2 }}
              className={`w-1 h-1 rounded-full transition-colors duration-500 ${isEndBlocked ? 'bg-red-500 scale-150' : 'bg-white/40'}`}
            />
          </motion.div>
        </div>
      </div>

      {/* 🚀 Sections Wrapper */}
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          ref={(el) => (sectionsRef.current[i] = el)}
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <div
            ref={(el) => (contentRef.current[i] = el)}
            className="w-full h-full"
          >
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SliderEngine;