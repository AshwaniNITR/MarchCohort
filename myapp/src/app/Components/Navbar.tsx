"use client";
import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion

function Navbar() {
  const [Show, setShow] = useState(true);

  return (
    <>
      {/* ✨ Adding fade-in animation using Framer Motion */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }} // Fade-in from top
        animate={{ opacity: 1, y: 0 }} // Fully visible
        transition={{ duration: 0.8, ease: "easeOut" }} // Smooth transition
        className="bg-transparent fixed w-full z-20 top-0 start-0"
      >
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="/favicon.png"
              className="h-10 rounded-full"
              alt="Logo"
            ></img>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: "45px", height: "45px" },
                  userButtonAvatar: { width: "45px", height: "45px" },
                },
              }}
            />
            <button
              onClick={() => {
                setShow(!Show);
                console.log(Show);
              }}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between ${
              Show ? "hidden" : "block"
            } w-full md:flex md:w-auto md:order-1`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:md:bg-transparent">
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                  aria-current="page"
                >
                  <b>Home</b>
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="block py-2 px-3 text-white bg-transparent rounded hover:bg-black hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <b>Services</b>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="block py-2 px-3 text-white bg-transparent rounded hover:bg-black hover:text-blue-700 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <b>About Us</b>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

export default Navbar;