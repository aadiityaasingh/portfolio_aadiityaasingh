import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const cursorX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.5 });
  const cursorY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.5 });
  
  const [isHovered, setIsHovered] = useState(false);

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth > 768);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);

    if (window.innerWidth <= 768) {
      return () => window.removeEventListener("resize", checkDevice);
    }

    const updateMousePosition = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHover = (e) => {
      if (e.target.tagName === "A" || e.target.tagName === "BUTTON" || e.target.closest("button") || e.target.closest("a")) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, { passive: true });
    window.addEventListener("mouseover", handleHover, { passive: true });

    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  if (!isDesktop) return null;

  return (
    <>
      {/* Outer Rotating Brackets (Scanner Effect) */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none z-[9999] hidden md:flex"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
          rotate: isHovered ? 90 : 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
      >
        <div className="relative w-10 h-10">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/60" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/60" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/60" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/60" />
        </div>
      </motion.div>

      {/* Inner Precision Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-none pointer-events-none z-[9999] hidden md:block mix-blend-difference shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0 : 1
        }}
        transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.1 }}
      />
    </>
  );
};

export default CustomCursor;