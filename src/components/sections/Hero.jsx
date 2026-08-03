import React, { useRef, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Github, Linkedin, Download} from "lucide-react";
import { SiLeetcode } from "react-icons/si";
import TextType from "../shared/TextType";

const Hero = () => {
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (window.innerWidth <= 768) return;

    let rafId = null;
    const updateMousePosition = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };
    window.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY]);

  const backgroundGradient = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.06),
      transparent 80%
    )
  `;

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex items-center justify-center bg-[#0a0a12] overflow-hidden select-none"
    >
      {/* 1. BACKGROUND LAYER - 3D GRID ARCHITECTURE */}
      <div className="absolute inset-0 z-0 perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#050505] to-[#0a0a0a]" />

        {/* Dynamic mouse-follower spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-500 hidden md:block"
          style={{ background: backgroundGradient }}
        />

        {/* 3D Floor Grid */}
        <div
          className="absolute bottom-0 left-0 w-full h-[60%] origin-bottom"
          style={{
            transform: "rotateX(60deg) scale(2)",
            background:
              "linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "linear-gradient(to top, rgba(74, 111, 245, 1) 0%, transparent 100%)",
          }}
        />

        {/* Floating tech geometry nodes - disabled on mobile for perf */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-20 hidden md:block">
          <div className="absolute top-[20%] left-[10%] w-[100px] h-[100px] md:w-[200px] md:h-[200px] border border-white/10 rounded-full" />
          <div className="absolute top-[40%] right-[15%] w-[150px] h-[150px] md:w-[300px] md:h-[300px] border border-white/5 rounded-full" />
          <div className="absolute top-[60%] left-[30%] w-[100px] h-[100px] md:w-[150px] md:h-[150px] border border-white/10 rounded-full" />
        </div>

        {/* Glowing backdrop structural orb */}
        <div className="absolute right-[-15%] top-[10%] w-[500px] md:w-[1000px] h-[500px] md:h-[1000px] bg-white/5 blur-[80px] md:blur-[120px] rounded-full opacity-20 pointer-events-none hidden md:block" />

        {/* Noise overlay - removed mix-blend-overlay for massive perf gain */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {/* 2. BACKGROUND IMAGE LAYER */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none lg:pr-[5%] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full md:w-[65%] md:left-auto md:right-0 opacity-60 md:opacity-100"
        >
          <img
            src="/profile.png"
            alt="Aditya Singh"
            className="w-full h-full object-cover object-[center_top] md:object-contain md:object-[80%_bottom] transition-transform duration-1000 hover:scale-[1.02]"
          />
        </motion.div>

        {/* Subtle Dark Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-[#0a0a12]/80 to-transparent md:bg-gradient-to-r md:from-[#0a0a12] md:via-transparent md:to-transparent" />
      </div>

      {/* 3. CONTENT LAYER */}
      <div className="container mx-auto px-6 lg:px-20 relative z-20 h-full flex flex-col justify-end md:justify-center pb-12 pt-32 md:pt-0">
        <div className="max-w-4xl flex flex-col items-start w-full mt-auto md:mt-0">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-3 rounded-full 
                       border border-white/20 bg-white/5 backdrop-blur-md 
                       text-white/80 font-mono text-[10px] md:text-xs tracking-widest 
                       uppercase shadow-lg mb-4 mt-4 md:mt-12"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Full Stack Software Developer
          </motion.div>

          {/* MAIN TYPOGRAPHY */}
          <div className="flex flex-col m-0 p-0 leading-tight">
            <div className="overflow-hidden h-fit">
              <TextType
                text="ADITYA"
                as="h1"
                typingSpeed={70}
                initialDelay={500}
                loop={false}
                showCursor={false}
                className="text-white font-black text-[clamp(4rem,15vw,10rem)] leading-[0.85] tracking-tight mb-0 md:mb-2 m-0 p-0"
              />
            </div>
            <div className="overflow-hidden h-fit">
              <TextType
                text="SINGH"
                as="h1"
                typingSpeed={70}
                initialDelay={1200}
                loop={false}
                showCursor={true}
                cursorCharacter="_"
                cursorClassName="text-white ml-2"
                className="text-transparent bg-clip-text bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-gradient-to-r from-gray-400 via-white to-gray-400 font-extrabold font-outfit text-[clamp(2.9rem,11.5vw,10rem)] leading-[0.85] tracking-tight m-0 p-0"
              />
            </div>
          </div>

          {/* BIO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="max-w-xl mt-4 md:-mt-4 lg:-mt-8 relative z-30"
          >
            <p className="text-base md:text-2xl text-gray-300 font-light md:font-normal leading-relaxed mb-6 md:mb-8 drop-shadow-md m-0 p-0 pr-4">
              <strong className="text-white font-semibold flex text-xl md:text-3xl mb-2">
                Full Stack Engineer
              </strong>
              Specializing in MERN stack development, java, and
              Machine Learning. I build scalable, secure, and AI-powered
              applications designed for real-world impact.
            </p>

            {/* ACTION BUTTONS */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.1)",
                }}
                whileTap={{ scale: 0.95 }}
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white text-sm md:text-base font-semibold rounded-full backdrop-blur-sm transition-all flex items-center gap-2 bg-white/5 shadow-xl"
              >
                Resume <Download size={16} />
              </motion.a>
            </div>
          </motion.div>

          {/* SOCIAL DOCK */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.8 }}
            className="mt-6 md:mt-10 flex flex-wrap gap-4 items-center border-t border-white/10 pt-4 md:pt-6 w-full"
          >
            <a
              href="https://github.com/aadiityaasingh"
              target="_blank"
              className="p-3 md:p-4 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-singh-245226231/"
              target="_blank"
              className="p-3 md:p-4 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://leetcode.com/u/aadiityaasingh/"
              target="_blank"
              className="p-3 md:p-4 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <SiLeetcode className="text-xl" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default React.memo(Hero);
