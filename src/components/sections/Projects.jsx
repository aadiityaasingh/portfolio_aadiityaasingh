import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Github,
  ExternalLink,
  Activity,
  BriefcaseBusiness,
  House,
  Lock,
} from "lucide-react";
import { getProjects } from "../../utils/api";
import { renderProjectIcon } from "../../utils/icons";

const FALLBACK_PROJECTS = [
  {
    title: "Panchakarma Management System",
    description:
      "A backend management system for managing patients, therapies, treatment plans, sessions, and billing with structured REST APIs and API documentation.",
    tech: ["Node.js", "Express.js", "MongoDB", "Mongoose", "Swagger"],
    github: "https://github.com/aadiityaasingh/PanchVeda_backend_system",
    live: "panchakarma-backend-system.onrender.com/api-docs",
    icon: "Activity",
    color: "from-emerald-400 to-teal-600",
    bgAccent: "bg-emerald-500/10",
  },
  {
    title: "HireHorizon",
    description:
      "A job portal that allows companies to create profiles and publish job opportunities while providing users with a platform to explore and manage job listings.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "Vite"],
    github: "https://github.com/aadiityaasingh/hirehorizon_frontend_system",
    live: "hirehorizonfrontendsystem.vercel.app",
    icon: "BriefcaseBusiness",
    color: "from-blue-400 to-cyan-600",
    bgAccent: "bg-blue-500/10",
  },
  {
    title: "StaySphere",
    description:
      "A full-stack accommodation platform inspired by Airbnb, featuring property listings, user interactions, authentication, and dynamic web interfaces.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/aadiityaasingh/staySphere",
    live: "staySphere-virid.vercel.app",
    icon: "House",
    color: "from-orange-400 to-red-600",
    bgAccent: "bg-orange-500/10",
  },
];

const ProjectCard = React.memo(({ project, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = React.useCallback(
    ({ currentTarget, clientX, clientY }) => {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  const renderedIcon = React.useMemo(() => {
    if (React.isValidElement(project.icon)) {
      return project.icon;
    }
    return renderProjectIcon(project.icon || "Activity", 40);
  }, [project.icon]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      className="group relative p-8 md:p-10 rounded-[2rem] bg-[#050505] border border-white/10 hover:border-white/20 transition-colors duration-500 overflow-hidden flex flex-col h-full transform-gpu"
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
        {/* Optional Custom Preview Image */}
        {project.image && (
          <div className="mb-6 rounded-2xl overflow-hidden h-44 w-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-all">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        <div className="flex justify-between items-start mb-8">
          <motion.div
            animate={{ y: [0, -5, 0] }} // Gentle floating animation for icons
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: index * 0.2,
            }}
            className={`p-4 rounded-2xl ${project.bgAccent || "bg-blue-500/10"} border border-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500`}
          >
            {renderedIcon}
          </motion.div>
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github.startsWith("http") ? project.github : `https://${project.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                title="GitHub Repository"
              >
                <Github size={20} />
              </a>
            )}
            {project.live && (
              <a
                href={project.live.startsWith("http") ? project.live : `https://${project.live}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all"
                title="Live Application"
              >
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
          {Array.isArray(project.tech) &&
            project.tech.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-sm font-mono bg-white/5 text-white/90 border border-white/10 group-hover:border-white/20 transition-colors"
              >
                {tech}
              </span>
            ))}
        </div>
      </div>

      {/* Bottom gradient border */}
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${project.color || "from-blue-400 to-cyan-600"}`}
      />
    </motion.div>
  );
});
ProjectCard.displayName = "ProjectCard";

export default React.memo(function Projects() {
  const sectionRef = useRef(null);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  useEffect(() => {
    let isMounted = true;
    const fetchProjectsList = async () => {
      try {
        const res = await getProjects();
        if (isMounted && res.data && res.data.length > 0) {
          setProjects(res.data);
        }
      } catch (err) {
        console.warn("Using fallback projects data:", err);
      }
    };
    fetchProjectsList();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen pt-32 pb-20 px-6 lg:px-20 bg-[#000000] overflow-y-auto overflow-x-hidden scrollable-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay" />

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
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

          {/* Admin shortcut button (discreet) */}
          <Link
            to="/admin"
            className="self-start md:self-auto p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-white/20 text-white/30 hover:text-white transition-all text-xs font-mono flex items-center gap-2 group"
            title="Admin Dashboard"
          >
            <Lock size={14} className="group-hover:text-blue-400 transition-colors" />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Admin Portal
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, idx) => (
            <ProjectCard key={project._id || idx} project={project} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
});
