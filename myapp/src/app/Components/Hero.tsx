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
      }}
      className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1 initial="hidden" whileInView="reveal" transition={{staggerChildren:.03}} className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight ">
        {TextSplit.map((char,index) => (<motion.span key={index} transition={{duration: 0.6, ease: "easeOut", // Smoother easing
      }} variants={CharVariants}>
            {char}
        </motion.span>))}
        </motion.h1>
        <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
        🚀 Get your ready-made posts with catchy captions for Instagram & Twitter 📸🐦✨
        </p>
        <div className="flex">
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
        </div>
      </div>

      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>

        </>
  );
};




// import React from 'react'
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
//   } from "@/components/ui/carousel"
// import { HeroImages } from './Assets'
// function Hero() {
//   return (
//     <>
//     <div>
//     <section className="pt-8 lg:pt-32 bg-[url('https://pagedone.io/asset/uploads/1691055810.png')] bg-center bg-cover">
//     <div className=" flex  flex-col justify-center items-center mx-auto max-w-7xl px-4 sm:px-6 py-14 lg:px-8 relative text-center ">
//         <h1
//             className="max-w-2xl mx-auto text-center font-manrope font-bold text-4xl text-gray-900 mb-5 md:text-5xl leading-[50px]">
//             Judge your Finances with our new AI app
//             <span className="text-indigo-600"> IRIS</span>
//         </h1>
//         <p className="max-w-sm mx-auto text-center text-base font-normal leading-7 text-gray-500 mb-9">
//             Judge intelligently and discover a better way to manage your lifestyle
//             easily.
//         </p>
//         <div className="flex justify-center items-center w-4/5">
//                         <Carousel>
//                 <CarouselContent>
//                 {HeroImages.map((Image, Index)=>(
//                     <CarouselItem key={Index}>
//                         <img src={Image.img}
//                          alt="Dashboard image" className=' w-full h-[400px] md:h-[500px] lg:h-[300px] rounded-3xl mix-blend-plus-darker backdrop-blur-3xl shadow-2xl '
//                          />
//                     </CarouselItem>
//                 ))}
//                 </CarouselContent>
//                 <CarouselPrevious />
//                 <CarouselNext />
//                 </Carousel>
//         </div>
//     </div>
// </section>
//     </div>
//     </>
//   )
// }

export default Hero
