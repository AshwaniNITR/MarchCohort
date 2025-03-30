"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useMotionTemplate, useMotionValue, animate } from "framer-motion";
import { Github, Instagram, Linkedin } from "lucide-react";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const CharVariants = {
  hidden: { opacity: 0, y: 20 },
  reveal: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

function Footer() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const Heading = "Made with ♥ by Team TriGen";
  const TextSplit = Heading.split("");
  const borderColor = useMotionTemplate`1px solid ${color}`;
  const glowColor = useMotionTemplate`0px 4px 24px ${color}`;
  
  return (
    <motion.div 
      className="w-full py-6 mt-20 -mb-10 flex flex-col items-center justify-center"
      style={{
        background: "rgba(13, 13, 13, 0.4)",
        backdropFilter: "blur(8px)",
        borderTop: borderColor,
        boxShadow: glowColor
      }}
    >
      <motion.h4
        initial="hidden"
        whileInView="reveal"
        transition={{ staggerChildren: 0.03 }}
        className="max-w-2xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-xl font-medium leading-tight text-transparent sm:text-2xl sm:leading-tight md:text-3xl md:leading-tight"
      >
        {TextSplit.map((char, index) => (
          <motion.span
            key={index}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            variants={CharVariants}
          >
            {char}
          </motion.span>
        ))}
      </motion.h4>
      
      <motion.div 
        className="flex gap-6 mt-4"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.a 
          href="https://github.com/teamtrigen" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Github size={24} />
        </motion.a>
        <motion.a 
          href="https://instagram.com/teamtrigen" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Instagram size={24} />
        </motion.a>
        <motion.a 
          href="https://linkedin.com/company/teamtrigen" 
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.2 }}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Linkedin size={24} />
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

export default Footer;