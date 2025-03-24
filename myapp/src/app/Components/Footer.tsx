"use client";
import React, { useState } from "react";
import { motion } from "framer-motion"; 
import { useEffect } from "react";
import { useMotionTemplate, useMotionValue, animate } from "framer-motion"; 

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

  const Heading = "Made with love by Team TriGen";
  const TextSplit = Heading.split("");
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <>
      <div className="flex w-full justify-center items-center -mb-10 mt-30">
        <motion.h4
          initial="hidden"
          whileInView="reveal"
          transition={{ staggerChildren: 0.03 }}
          className="max-w-2xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-2xl font-medium leading-tight text-transparent sm:text-3xl sm:leading-tight md:text-5xl md:leading-tight "
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
      </div>

              
    </>
  );
}

export default Footer;