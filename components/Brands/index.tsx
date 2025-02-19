"use client";
import React from "react";
import { ArrowRightIcon } from '@heroicons/react/outline';


const Brands = () => {
  return (
    <>
      <section>
        <div className="relative  flex flex-wrap justify-center p-4">
          <div className="relative z-99999 w-full max-w-7xl rounded-2xl green-gradient-bg md:p-15 sm:p-3 ">
            {/* Image positioned on top */}
            <div className="absolute -top-30 left-1/2 -translate-x-1/2 transform">
              <img
                className="h-24 w-24 md:h-60 md:w-60 rounded-full bg-white object-contain p-2  "
                src="/images/user/jaga2.png"
                alt="Tourist"
              />
            </div>

            {/* Card Content */}
            <div className="grid items-center gap-4 md:grid-cols-3">
              <div className="text-center text-5xl font-semibold text-secondary md:text-left leading-tight">
                Embark On Your Next Chapter
              </div>

              <div className="flex justify-center">
                {/* Empty space since the image is moved above */}
              </div>

              <div className="text-center text-sm text-gray-600 md:text-right">
                <div className="flex flex-row items-center justify-center flex-wrap gap-4">

                  <div>
                    <p className="font-sm text-3xl text-secondary mb-2">For Any Call</p>
                    <h1 className="text-4xl text-secondary font-semibold">+94 77 714 7238</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Brands;
