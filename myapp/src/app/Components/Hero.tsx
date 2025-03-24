"use client"
import { Stars } from "@react-three/drei";  // For 3D star field
import { Canvas } from "@react-three/fiber"; // WebGL rendering
import React, { useEffect } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion"; // Motion animations
import About from "./About";
import Services from "./Services";
import Footer from "./Footer";

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

export const Hero = () => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
  const Heading = "AI-Powered Social Media Post Generator";
  const TextSplit = Heading.split("");
  console.log(TextSplit);

  return (
    <>
    <motion.section
      style={{
        backgroundImage,
        backgroundAttachment: "fixed", // Keeps the background fixed while scrolling
    backgroundSize: "cover", // Ensures it covers the full area
    backgroundPosition: "center", // Centers the gradient
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="flex w-full justify-center items-center mt-10 mb-5">
      <img src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742673059/booking-jini-high-resolution-logo_1_oeaysp.png" className=" h-60 rounded-2xl" alt="Logo"></img>
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1 initial="hidden" whileInView="reveal" transition={{staggerChildren:.03}} className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight ">
        {TextSplit.map((char,index) => (<motion.span key={index} transition={{duration: 0.6, ease: "easeOut", // Smoother easing
      }} variants={CharVariants}>
            {char}
        </motion.span>))}
        </motion.h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed mb-20">
        🚀 Get your ready-made posts with catchy captions for Instagram & Twitter 📸
        </p>

       


        {/* <div className="flex">
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
          className="mr-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50 "
        ><div className="flex flex-col"><img src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742665807/business_13800592_angzvc.png" alt="" className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12" />
          Generate Caption
            </div>
        </motion.button>

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
          className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        ><div className="flex flex-col"><img src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742666359/image_419252_xe3gf8.png" alt="" className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12" />
          Generate Image
            </div>
        </motion.button>
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
          className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        ><div className="flex flex-col"><img src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742666359/image_419252_xe3gf8.png" alt="" className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12" />
          Generate Image
            </div>
        </motion.button>
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
          className="ml-6 mt-4 group relative flex w-fit items-center gap-1.5 rounded-2xl bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        ><div className="flex flex-col"><img src="https://res.cloudinary.com/duwddcqzi/image/upload/v1742666359/image_419252_xe3gf8.png" alt="" className="h-40 transition-transform group-hover:-rotate-3 group-active:-rotate-12" />
          Generate Image
            </div>
        </motion.button>

        </div> */}
      </div>
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={3000} factor={4} fade speed={2} />
        </Canvas>
      </div>
      <About/>
      <Services/>
      <Footer/>
    </motion.section>

        </>
  );
};

export default Hero
