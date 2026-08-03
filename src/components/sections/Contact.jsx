import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";
import { SiLeetcode } from "react-icons/si";

export default function Contact() {
  return (
    <section 
      className="relative w-full h-screen pt-24 md:pt-32 px-6 lg:px-20 bg-[#050508] overflow-y-auto overflow-x-hidden scrollable-section [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center"
    >
      {/* Background radial gradient */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] bg-white/5 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex-grow flex flex-col justify-center pb-8 mt-auto md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/20 bg-white/5 text-white/80 font-mono text-xs tracking-[0.3em] uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Available For Hire
          </div>

          <h2 className="text-5xl md:text-8xl font-black font-outfit text-white tracking-tighter leading-none mb-8">
            LET'S BUILD <br />
            <span className="text-transparent bg-clip-text bg-[length:200%_auto] animate-[shimmer_2.5s_linear_infinite] bg-gradient-to-r from-gray-500 via-white to-gray-500">
              TOGETHER
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
           I am currently seeking opportunities as a Full Stack Engineer or AI/CV Developer. If you have a relevant role or collaboration opportunity, I would be glad to connect and discuss how I can contribute.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center"
        >
          <a
            href="mailto:adityagw20@gmail.com"
            className="group relative inline-flex items-center gap-4 px-12 py-5 bg-white text-black rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 border border-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-3 text-black transition-colors duration-500">
              <Mail size={20} /> Say Hello
            </span>
            <ExternalLink size={16} className="relative z-10 opacity-50 text-black transition-colors duration-500" />
          </a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 md:mt-20 flex flex-wrap justify-center gap-4 md:gap-6 mb-12 flex-shrink-0"
        >
          <a href="https://github.com/ADITYA-user18" target="_blank" className="flex items-center gap-3 p-3 md:p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition-all group">
            <Github size={20} className="group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-sm hidden sm:block">GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/aditya-wandakar-875007343/" target="_blank" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition-all group">
            <Linkedin size={20} className="group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-sm hidden sm:block">LinkedIn</span>
          </a>
          <a href="https://leetcode.com/u/AdityaGW/" target="_blank" className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-white/70 hover:text-white transition-all group">
            <SiLeetcode className="text-xl group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-sm hidden sm:block">LeetCode</span>
          </a>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-white/70 cursor-default">
            <Phone size={20} />
            <span className="font-mono text-sm hidden sm:block">+91 79750 94214</span>
          </div>
        </motion.div>
      </div>

      {/* Footer text */}
      <div className="relative text-center w-full z-10 pb-6 mt-auto">
        <p className="text-white/30 text-xs font-mono uppercase tracking-widest px-4">
          © {new Date().getFullYear()} ADITYA WANDAKAR. All Rights Reserved.
        </p>
      </div>
    </section>
  );
}
