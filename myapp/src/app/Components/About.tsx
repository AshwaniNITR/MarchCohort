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

function About() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const Heading = "About Us";
  const TextSplit = Heading.split("");
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  // Set initial state to true (show back side first)
  const [flipped, setFlipped] = useState([true, true, true, true]);

  const handleFlip = (index: number) => {
    setFlipped((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  const cards = [
    {
      title: "🚀 AI-Powered Content Creation",
      description:
        "Generate engaging captions with Falcon 7B and stunning images with Stable Diffusion 2.1—tailored to your prompts for effortless social media posts.",
      backText: "Cutting-edge AI makes content creation seamless!",
      image: "https://res.cloudinary.com/duwddcqzi/image/upload/v1742852507/Gemini_Generated_Image_sbx7qusbx7qusbx7_huubu6.jpg",
    },
    {
      title: "🎨 Simplified & Efficient Workflow",
      description:
        "No design skills needed! Enter a prompt, and our AI handles the rest, delivering high-quality captions and visuals separately for maximum flexibility.",
      backText: "A streamlined process for content creation!",
      image: "https://res.cloudinary.com/duwddcqzi/image/upload/v1742852507/Gemini_Generated_Image_9u2gjp9u2gjp9u2g_pwmkui.jpg",
    },
    {
      title: "📢 One-Click Social Media Sharing",
      description:
        "Easily share your AI-generated content across multiple platforms, streamlining your social media management with minimal effort.",
      backText: "Post effortlessly with a single click!",
      image: "https://res.cloudinary.com/duwddcqzi/image/upload/v1742852506/Gemini_Generated_Image_8gkqgd8gkqgd8gkq_x1yyls.jpg",
    },
    {
      title: "🔒 Secure & Seamless Access",
      description:
        "Enjoy a hassle-free experience with our highly authenticated sign-up process, ensuring data security while keeping things smooth and user-friendly.",
      backText: "Your security, our priority!",
      image: "https://res.cloudinary.com/duwddcqzi/image/upload/v1742852507/Gemini_Generated_Image_csemd1csemd1csem_togmfv.jpg",
    },
  ];

  return (
    <>
      <div className="flex w-full justify-center items-center mb-10">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 -mb-15">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="relative w-80 h-64 perspective-500 cursor-pointer"
            onClick={() => handleFlip(index)}
          >
            <motion.div
              className="relative w-full h-full duration-400 transition-all"
              animate={{ rotateY: flipped[index] ? 180 : 0 }} // Initially flipped to show back
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side (Initially Hidden) */}
              <motion.div
                className="absolute w-full h-full rounded-2xl bg-gray-950/10 px-6 py-10 text-gray-50 transition-colors hover:bg-gray-950/50 flex items-center justify-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(0deg)", // Initially hidden behind
                  border,
                  boxShadow,
                }}
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold">{card.title}</h3>
                  <p className="text-sm mt-2">{card.description}</p>
                </div>
              </motion.div>

              {/* Back Side (Initially Visible) */}
              <motion.div
                className="absolute w-full h-full rounded-2xl bg-transparent px-6 py-10 text-gray-50 flex flex-col items-center justify-center text-center"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)", // Initially shown
                  border,
                  boxShadow,
                }}
              >
                <img
                  src={card.image}
                  alt="Card image"
                  className="w-36 h-36 object-contain mb-3 rounded-full"
                />
                <p className="text-lg font-semibold">{card.backText}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
      </div>
    </>
  );
}

export default About;



