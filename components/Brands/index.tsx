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
                className="h-60 w-60 rounded-full bg-white object-contain p-2  "
                src="https://cdn.prod.website-files.com/66b5d6635ee4014275999ec3/66b9e945bbda84c8723fdcdc_tourist-white-background%201.avif"
                alt="Tourist"
              />
            </div>

            {/* Card Content */}
            <div className="grid items-center gap-4 md:grid-cols-3">
              <div className="text-center text-5xl font-semibold text-white md:text-left leading-tight">
                Embark On Your Next Chapter
              </div>

              <div className="flex justify-center">
                {/* Empty space since the image is moved above */}
              </div>

              <div className="text-center text-sm text-gray-600 md:text-right">
                <div className="flex flex-row items-center justify-center flex-wrap gap-4">
                  <div className="flex items-center justify-center rounded-full bg-white p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path
                        d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                      <path
                        d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                    </svg>


                  </div>
                  <div>
                    <p className="font-sm text-3xl text-white mb-2">For Any Call</p>
                    <h1 className="text-4xl text-white font-semibold">+94 77 714 7238</h1>
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
