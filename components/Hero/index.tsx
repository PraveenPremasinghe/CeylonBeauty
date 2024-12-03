"use client";
import Image from "next/image";
import { useState } from "react";


const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <section
        className="relative h-[80vh] overflow-hidden bg-cover bg-center pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46"
        style={{
          backgroundImage: "url('https://plus.unsplash.com/premium_photo-1730145749791-28fc538d7203?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')", // Replace with your image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>

        <div className="relative mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0 z-10">
          dflghjikd
        </div>
      </section>
    </>
  );
};

export default Hero;
