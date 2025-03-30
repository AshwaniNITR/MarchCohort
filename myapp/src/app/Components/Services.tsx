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
      <div className="flex w-full justify-center items-center mb-10 mt-40">
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

      <div className="flex w-full justify-center items-center">
        <a href="/GenCap">
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="mr-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-20 py-10 text-gray-50 transition-colors hover:bg-gray-950/50 "
          >
            <div className="flex flex-col">
              <img
                src="/capic.png"
                alt=""
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
              />
              Generate Caption
            </div>
          </motion.button>
        </a>

        <a href="/GenPost">
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-20 py-10 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            <div className="flex flex-col">
              <img src="/imgic.png"
               alt=""
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
               />
              Generate Poster
            </div>
          </motion.button>
        </a>
        <a href="/GenGif">
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-20 py-10 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            <div className="flex flex-col">
              <img src="/gific.png"
               alt=""
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
               />
              Generate Gif
            </div>
          </motion.button>
        </a>
        <a href="/GenTemp">
          <motion.button
            style={{
              border,
              boxShadow,
            }}
            whileHover={{
              scale: 1.015,
            }}
            whileTap={{
              scale: 0.985,
            }}
            className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-20 py-10 text-gray-50 transition-colors hover:bg-gray-950/50"
          >
            <div className="flex flex-col">
              <img src="/gific.png"
               alt=""
                className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12"
               />
              Check Out Our Templates!
            </div>
          </motion.button>
        </a>

      </div>
    </>
  );
}

export default Services;
