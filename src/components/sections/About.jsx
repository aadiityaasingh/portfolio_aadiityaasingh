import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, GraduationCap, Award, MapPin } from "lucide-react";

const About = React.memo(function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const experiences = [
    {
      role: "Computer Vision Intern",
      company: "DocketRun Tech Pvt. Ltd., Hubli",
      date: "Jan 26 - July 26",
      points: [
        "Developing real-time AI solutions using YOLO & OpenCV for industrial object detection and tracking.",
        "Implementing model optimization techniques to improve inference speed for large-scale industrial use cases.",
      ],
      icon: <Briefcase className="text-blue-400" size={24} />,
    },
    {
      role: "MERN Stack Developer Intern",
      company: "Genesis Academy, Bangalore (Remote)",
      date: "Jan 26 - May 26",
      points: [
        "Building full-stack applications using MongoDB, Express, React, and Node.js with secure REST API architectures.",
        "Developing responsive UIs and implementing robust authentication protocols for enterprise-grade software.",
      ],
      icon: <Briefcase className="text-purple-400" size={24} />,
    },
  ];

  const education = [
    {
      school: "KLS VDIT, Haliyal",
      degree: "Bachelor of Engineering in Computer Science and Engineering",
      score: "CGPA: 9.01 / 10.0",
      date: "2022 – 2026",
    },
    {
      school: "Smt. Vidya P Hanchinmani College, Dharwad",
      degree: "Pre-University Course (PCMS)",
      score: "Score: 93%",
      date: "2020 – 2022",
    },
    {
      school: "St. Mary's School, Kalaghatgi",
      degree: "Secondary School Leaving Certificate (SSLC)",
      score: "Score: 90%",
      date: "2020",
    },
  ];

  const certifications = [
    "Free TensorFlow Bootcamp (OpenCV University)",
    "IBM SkillBuild: Full Stack Development (MERN Specialization)",
    "Green Skills and AI (Edunet Foundation, AICTE, and Shell India)",
    "Infosys Springboard: Web Technology Fundamentals & JavaScript Optimization",
    "Cisco Networking Academy: Python Programming Basics",
  ];

  const achievements = [
    {
      title: "Patent Publication",
      description: "Crowd Sense: A Real-Time System for Crowd Analytics (App No: 202641002836). Developed an efficient method using MobileNet-SSD and GenderNet for real-time demographic analysis and automated ad selection.",
    },
    {
      title: "Problem Solving",
      description: "Solved 100+ problems on LeetCode focusing on Data Structures and Algorithms (DSA).",
    },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative h-screen pt-32 pb-20 px-6 lg:px-20 bg-[#0a0a12] overflow-y-auto overflow-x-hidden scrollable-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <div className="absolute right-[-10%] top-[20%] w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full mix-blend-screen opacity-50" />
        <div className="absolute left-[-10%] bottom-[10%] w-[600px] h-[600px] bg-white/5 blur-[130px] rounded-full mix-blend-screen opacity-50" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto w-full">
        <motion.div style={{ opacity }} className="mb-20">
          <h2 className="text-5xl md:text-7xl font-black font-outfit text-white tracking-tighter leading-none uppercase mb-6">
            ABOUT & <br />
            <span className="text-transparent bg-clip-text bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] bg-gradient-to-r from-gray-500 via-white to-gray-500">
              EXPERIENCE
            </span>
          </h2>
          <p className="max-w-3xl text-xl text-white/90 font-light leading-relaxed">
            Innovative <strong className="text-white font-medium">Computer Science Engineer</strong> specialized in <strong className="text-gray-300 font-medium">MERN Stack development</strong> and <strong className="text-gray-300 font-medium">Generative AI</strong> integration. Proven ability to translate industrial requirements into secure, high-performance software with a focus on System Performance and user-centric design.
          </p>
        </motion.div>

        <div className="flex flex-col gap-24">
          
          {/* Section 1: Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-3xl font-outfit font-bold text-white mb-10 flex items-center gap-3 border-b border-white/10 pb-4">
              <Briefcase className="text-white/50" /> Professional Experience
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 transition-all hover:bg-white/10">
                  <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                    <div>
                      <h4 className="text-2xl font-outfit text-white font-bold mb-2">{exp.role}</h4>
                      <p className="text-white/80 text-base flex items-center gap-2">
                        <MapPin size={16} className="text-white/50" /> {exp.company}
                      </p>
                    </div>
                    <span className="text-sm font-mono text-white/80 mt-1 md:mt-0 bg-white/10 border border-white/10 px-4 py-1.5 rounded-full whitespace-nowrap">{exp.date}</span>
                  </div>
                  
                  <ul className="space-y-4">
                    {exp.points.map((point, i) => (
                      <li key={i} className="text-white/70 text-base leading-relaxed flex items-start gap-3">
                        <span className="text-white/40 mt-1">▹</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 2: Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-3xl font-outfit font-bold text-white mb-10 flex items-center gap-3 border-b border-white/10 pb-4">
              <GraduationCap className="text-white/50" /> Education
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {education.map((edu, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.07] transition-all flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-outfit text-white font-bold mb-4">{edu.degree}</h4>
                    <p className="text-white/80 text-base mb-6 font-medium">{edu.school}</p>
                  </div>
                  <div className="flex flex-col xl:flex-row justify-between xl:items-center text-sm text-white/60 font-mono gap-4 pt-6 border-t border-white/5">
                    <span className="bg-white/10 px-3 py-1.5 rounded border border-white/5 font-bold tracking-wide text-white">{edu.score}</span>
                    <span>{edu.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 3: Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-3xl font-outfit font-bold text-white mb-10 flex items-center gap-3 border-b border-white/10 pb-4">
              <Award className="text-white/50" /> Certifications
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className="group flex items-start gap-4 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all">
                  <Award size={24} className="text-white/30 group-hover:text-white shrink-0 mt-0.5 transition-colors" />
                  <span className="text-white/90 text-base leading-relaxed">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Section 4: Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full"
          >
            <h3 className="text-3xl font-outfit font-bold text-white mb-10 flex items-center gap-3 border-b border-white/10 pb-4">
              <Award className="text-white/50" /> Achievements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((ach, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/[0.07] transition-all">
                  <h4 className="text-xl font-outfit text-white font-bold mb-4">{ach.title}</h4>
                  <p className="text-white/80 text-base leading-relaxed">{ach.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
});

export default About;
