"use client";
import React from "react";
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

function Services() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const Heading = "Our Services";
  const TextSplit = Heading.split("");
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <>
      <div className="flex w-full justify-center items-center mb-10 mt-40" id="services">
        <motion.h4
          initial="hidden"
          whileInView="reveal"
          transition={{ staggerChildren: 0.03 }}
          className="max-w-2xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-2xl font-medium leading-tight text-transparent sm:text-3xl sm:leading-tight md:text-5xl md:leading-tight"
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

      {/* Responsive Grid for Services */}
      <div className="flex w-full justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <a href="/GenCap">
            <motion.button
              style={{
                border,
                boxShadow,
              }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group relative flex flex-col items-center gap-3 rounded-2xl bg-gray-950/10 text-gray-50 transition-colors hover:bg-gray-950/50 p-6 w-80 h-64"
            >
              <img
                src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742665807/business_13800592_angzvc.png"
                alt="Generate Caption"
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
              />
              <span className="text-lg font-semibold">Generate Caption</span>
            </motion.button>
          </a>

          <a href="/GenPost">
            <motion.button
              style={{
                border,
                boxShadow,
              }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="group relative flex flex-col items-center gap-3 rounded-2xl bg-gray-950/10 text-gray-50 transition-colors hover:bg-gray-950/50 p-6 w-80 h-64"
            >
              <img
                src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742666359/image_419252_xe3gf8.png"
                alt="Generate Image"
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
              />
              <span className="text-lg font-semibold">Generate Image</span>
            </motion.button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Services;
