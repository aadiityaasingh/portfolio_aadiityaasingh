import React, { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { gsap } from "gsap";
import { 
  Code2, 
  Globe, 
  Cpu, 
  Layers,
  Terminal
} from "lucide-react";

const skillData = [
  {
    category: "Languages",
    icon: <Code2 size={28} />,
    skills: ["JavaScript", "Java", "Python", "SQL"],
    description: "The foundation of logic and scripting.",
    color: "from-white to-gray-400"
  },
  {
    category: "Web & Backend",
    icon: <Globe size={28} />,
    skills: ["React.js", "Next.js", "Node.js", "Express.js", "FastAPI", "Socket.IO", "RESTful API", "Tailwind"],
    description: "Modern full-stack architecture.",
    color: "from-gray-200 to-gray-500"
  },
  {
    category: "AI & Vision",
    icon: <Cpu size={28} />,
    skills: ["TensorFlow", "OpenCV", "YOLOv8", "MediaPipe", "scikit-learn", "NumPy", "Pandas"],
    description: "Neural networks & computer vision.",
    color: "from-gray-300 to-gray-600"
  },
  {
    category: "Infrastructure",
    icon: <Layers size={28} />,
    skills: ["MongoDB", "MySQL", "Redis", "Git", "GitHub", "Docker", "Postman", "Vercel", "NPM", "Render"],
    description: "Deployment, Cloud & CI/CD.",
    color: "from-white to-gray-500"
  }
];

const SkillCard = React.memo(({ group }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = React.useCallback(({ currentTarget, clientX, clientY }) => {
    if (window.innerWidth <= 768) return;
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className="skill-card group relative p-8 rounded-3xl bg-[#050505] border border-white/10 hover:border-white/30 transition-colors duration-500 overflow-hidden flex flex-col h-full transform-gpu"
      style={{ backfaceVisibility: "hidden" }} // Fixes blurriness
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.05),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative mb-8 flex justify-between items-start">
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white group-hover:scale-110 group-hover:bg-gradient-to-br ${group.color} transition-all duration-500`}>
          {group.icon}
        </div>
        <Terminal size={14} className="text-white/20" />
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
          {group.category}
        </h3>
        <p className="text-white/40 text-[10px] font-mono mb-8 uppercase tracking-[0.2em]">
          {group.description}
        </p>

        {/* Skill Chips - Sizes Increased Here */}
        <div className="flex flex-wrap gap-3">
          {group.skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 text-white/90 border border-white/10 group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className={`absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${group.color}`} />
    </motion.div>
  );
});
SkillCard.displayName = "SkillCard";

const Skills = React.memo(() => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".skill-card", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen pt-24 md:pt-32 pb-20 px-6 lg:px-20 bg-[#030303] overflow-y-auto overflow-x-hidden scrollable-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none overflow-hidden select-none">
        <h2 className="text-[25vw] font-black leading-none uppercase text-white text-center">
          ENGINE
        </h2>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-16 md:mb-24 flex flex-col">
          <h2 className="text-6xl md:text-8xl font-black font-outfit text-white tracking-tighter leading-none uppercase">
            TECHNICAL <br />
            <span className="text-transparent bg-clip-text bg-[length:200%_auto] animate-[shimmer_3.5s_linear_infinite] bg-gradient-to-r from-gray-600 via-white to-gray-600">
              STACK
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {skillData.map((group, idx) => (
            <SkillCard key={idx} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default Skills;