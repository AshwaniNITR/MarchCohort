"use client";
import React from "react";
import { motion } from "framer-motion"; 
import { useEffect } from "react";
import { useMotionTemplate, useMotionValue, animate } from "framer-motion"; 
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from "react-icons/fa";

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

  const Heading = "Made with ";
  const TextSplit = Heading.split("");
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <footer className="w-full">
      <div className="flex flex-col items-center justify-center py-12">
        {/* Text with heart */}
        <div className="flex w-full justify-center items-center mb-6">
          <motion.h4
            initial="hidden"
            whileInView="reveal"
            transition={{ staggerChildren: 0.03 }}
            className="max-w-2xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-xl font-medium leading-tight text-transparent sm:text-2xl sm:leading-tight md:text-3xl md:leading-tight"
          >
            {TextSplit.map((char, index) => (
              <motion.span key={index} variants={CharVariants}>
                {char}
              </motion.span>
            ))}
            <motion.span variants={CharVariants}>
              <FaHeart className="inline mx-1 text-pink-500" />
            </motion.span>
            <motion.span variants={CharVariants}> by Team TriGen</motion.span>
          </motion.h4>
        </div>

        {/* Social icons */}
        <motion.div 
          className="flex gap-6 mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.a 
            href="https://github.com" 
            target="_blank"
            whileHover={{ y: -3, scale: 1.1 }}
            style={{ color }}
            className="text-2xl"
          >
            <FaGithub />
          </motion.a>
          <motion.a 
            href="https://linkedin.com" 
            target="_blank"
            whileHover={{ y: -3, scale: 1.1 }}
            style={{ color }}
            className="text-2xl"
          >
            <FaLinkedin />
          </motion.a>
          <motion.a 
            href="https://instagram.com" 
            target="_blank"
            whileHover={{ y: -3, scale: 1.1 }}
            style={{ color }}
            className="text-2xl"
          >
            <FaInstagram />
          </motion.a>
        </motion.div>

        {/* Glassmorphism effect */}
        <motion.div 
          className="mt-8 p-4 rounded-lg backdrop-blur-sm bg-white/10 border"
          style={{
            border,
            boxShadow
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-gray-300 text-center">
            © {new Date().getFullYear()} Team TriGen. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}

export default Footer;