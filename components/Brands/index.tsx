"use client";
import React from "react";

const Brands = () => {
  return (
    <>
      {/* <!-- ===== Clients Start ===== --> */}
      <section className="relative border border-x-0 border-y-stroke bg-customPrimary py-11 dark:border-y-strokedark dark:bg-black">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          <div className="absolute -top-10 left-28 -translate-x-1/2 -translate-y-1/2">
            <img
              src="/images/user/manwithcall.png"
              alt="Middle Section Image"
              className="h-65 w-full rounded-full"
            />
          </div>

          <div className="flex flex-wrap align-middle justify-center items-center ">
            <div className="w-full sm:w-1/2">
              <div className="text-center text-3xl font-bold text-customSecondary dark:text-white xl:text-hero ">
                <h1>Need assistance?</h1>
                <h1>Feel free to reach out at</h1>


              </div>
            </div>
            <div className="w-full sm:w-1/2">
              <div
                className=" text-center font-bold text-customSecondary dark:text-white xl:text-hero ">

                <h1 className="text-7xl text-center">
                  <a
                    href="tel:+94777147238"
                    className="text-white-600 font-bold hover:underline"
                  >
                    +94 77 714 7238
                  </a>
                  .{" "}
                </h1>
              </div>
            </div>
          </div>


        </div>
      </section>
      {/* <!-- ===== Clients End ===== --> */}
    </>
  );
};

export default Brands;
