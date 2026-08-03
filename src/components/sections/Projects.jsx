import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from "framer-motion";
import { Github, ExternalLink, Code2, Database, BrainCircuit, ShieldAlert, Users, Network } from "lucide-react";

const projectsData = [
  {
    title: "Railway Track Obstacle Detection System",
    description: "A highly optimized, computer vision pipeline designed to prevent railway accidents by detecting fallen trees, vehicles, animals, and other obstacles on tracks in real-time.",
    tech: ["YOLOv11", "Computer Vision", "Python"],
    github: "https://github.com/ADITYA-user18/-Railway-Track-Obstacle-Detection-System",
    live: null,
    icon: <ShieldAlert size={40} className="text-red-400" />,
    color: "from-red-400 to-orange-600",
    bgAccent: "bg-red-500/10"
  },
  {
    title: "ResQAI – Offline AI Emergency Assistant",
    description: "A local-first, privacy-focused AI companion providing critical first-aid and survival instructions offline. Powered by a RAG Knowledge Base, Ollama (TinyLlama/Phi3), and FAISS vector indexing.",
    tech: ["React", "FastAPI", "Ollama", "FAISS"],
    github: "https://github.com/ADITYA-user18/ResQAI-Offiline-AI-Emergency-and-Survival-Assistant-",
    live: null,
    icon: <ShieldAlert size={40} className="text-emerald-400" />,
    color: "from-emerald-400 to-teal-600",
    bgAccent: "bg-emerald-500/10"
  },
  {
    title: "AutoYOLO - Neural Intelligence Platform",
    description: "A production-grade AI optimization and Dataset Intelligence platform. Replaces manual hyperparameter tuning and dataset verification with a deeply integrated Neural Workflow Agent. Features Neural Audit, Dataset Repair, Smart HPO, and Automated Code Generation for Ultralytics YOLO models.",
    tech: ["Vite", "React", "FastAPI", "Gemini", "Vercel"],
    github: null,
    live: "https://intelligent-yolo-analyzer.vercel.app/",
    icon: <Database size={40} className="text-white" />,
    color: "from-blue-400 to-indigo-600",
    bgAccent: "bg-blue-500/10"
  },
  {
    title: "REV-AI – Autonomous Code Review Agent",
    description: "Engineered an event-driven automation tool using GitHub Webhooks and Google Gemini AI for real-time logic auditing. Reduced pre-production bug density by 40% by enforcing structured JSON security auditing and vulnerability detection.",
    tech: ["MERN Stack", "GenAI", "GitHub API"],
    github: "https://github.com/ADITYA-user18/REV-AI----The-Code-Reviewer",
    live: "https://rev-ai-the-code-reviewer.vercel.app/",
    icon: <BrainCircuit size={40} className="text-white" />,
    color: "from-white to-gray-400",
    bgAccent: "bg-white/10"
  },
  {
    title: "DigiVault – Intelligent Document Vault",
    description: "Architected a secure management system featuring automated metadata extraction via Tesseract.js OCR. Implemented robust security protocols including JWT Authentication and IP-based audit logs for document tracking.",
    tech: ["Full Stack MERN", "OCR", "JWT", "Security"],
    github: "https://github.com/ADITYA-user18/DigiVault-MERNFullStackProject",
    live: "https://digi-vault-mern-full-stack-project.vercel.app",
    icon: <ShieldAlert size={40} className="text-white" />,
    color: "from-gray-300 to-gray-500",
    bgAccent: "bg-white/5"
  },
  {
    title: "Chat-AI – AI-Powered Collaborative Workspace",
    description: "Built a real-time collaborative editor using Socket.IO, enabling multi-user synchronization and code suggestions.",
    tech: ["React", "Socket.IO", "Gemini API"],
    github: "https://github.com/ADITYA-user18/AICollaboratoryApp",
    live: null,
    icon: <Users size={40} className="text-white/80" />,
    color: "from-gray-200 to-gray-600",
    bgAccent: "bg-white/5"
  },
  {
    title: "SAFEGARD-AI – Industrial Safety Monitor",
    description: "Built a real-time AI safety monitoring system for worker tracking and contextual PPE enforcement. Achieved 91.4% mAP on 30K+ images, integrating a violation analytics dashboard for industrial safety.",
    tech: ["MERN", "FastAPI", "YOLOv8"],
    github: "https://github.com/ADITYA-user18/-SAFEGARD-AI-Industrial-Work-at-Height-Safety-Monitor",
    live: null,
    icon: <ShieldAlert size={40} className="text-gray-300" />,
    color: "from-gray-400 to-gray-700",
    bgAccent: "bg-white/10"
  },
  {
    title: "CrowdSense – Real-Time Crowd Analytics",
    description: "Achieved 81% detection accuracy using OpenCV for real-time human detection and demographic gender based classification and targeted Advertisements.",
    tech: ["Python", "OpenCV", "Computer Vision"],
    github: "https://github.com/ADITYA-user18/CrowdSense-Real-Time-Crowd-Analytics-and-Smart-ADs-Management",
    live: null,
    icon: <Network size={40} className="text-gray-200" />,
    color: "from-white to-gray-500",
    bgAccent: "bg-white/5"
  }
];

const ProjectCard = React.memo(({ project, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = React.useCallback(({ currentTarget, clientX, clientY }) => {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className={`group relative p-8 md:p-10 rounded-[2rem] bg-[#050505] border border-white/10 hover:border-white/20 transition-colors duration-500 overflow-hidden flex flex-col h-full transform-gpu`}
    >
      {/* Dynamic Glow effect on hover */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.05),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <motion.div 
            animate={{ y: [0, -5, 0] }} // Gentle floating animation for icons
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.2 }}
            className={`p-4 rounded-2xl ${project.bgAccent} border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}
          >
            {project.icon}
          </motion.div>
          <div className="flex gap-3">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <Github size={20} />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-3xl font-outfit font-bold text-white mb-4 tracking-tight leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/50 transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-white/80 text-base leading-relaxed mb-8">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Footer */}
        <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-white/5">
          {project.tech.map((tech, i) => (
            <span key={i} className="px-3 py-1.5 rounded-lg text-sm font-mono bg-white/5 text-white/90 border border-white/10 group-hover:border-white/20 transition-colors">
              {tech}
            </span>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient border */}
      <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${project.color}`} />
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

export default React.memo(function Projects() {
  const sectionRef = useRef(null);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full h-screen pt-32 pb-20 px-6 lg:px-20 bg-[#000000] overflow-y-auto overflow-x-hidden scrollable-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay" />
      
      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black font-outfit text-white tracking-tighter leading-none"
          >
            PROJECTS <br />
            <span className="text-transparent bg-clip-text bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] bg-gradient-to-r from-gray-600 via-white to-gray-600 uppercase">
              SECTION
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projectsData.map((project, idx) => (
            <ProjectCard key={idx} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
});
