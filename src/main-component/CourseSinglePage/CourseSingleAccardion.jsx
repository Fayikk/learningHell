import React from "react";
import { Link } from "react-router-dom";

const CourseSingleAccardion = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };
  return (
    <div className=" rounded-2xl shadow-lg  p-5 flex flex-col flex-1 sm:gap-3  ">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-2xl">Konular</h1>
        <span className="text-base  text-black/55">4 Bölüm 5 konu</span>{" "}
        <div className="flex flex-col ">
          {" "}
          <div class="relative mb-3">
            <h6 class="mb-0">
              <button
                class="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
                data-collapse-target="animated-collapse-1"
              >
                <span>What is Material Tailwind?</span>
                <i class="absolute right-0 pt-1 text-base transition-transform fa fa-chevron-down group-open:rotate-180"></i>
              </button>
            </h6>
            <div
              data-collapse="animated-collapse-1"
              class="h-0 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div class="p-4 text-sm leading-normal text-blue-gray-500/80">
                We're not always in the position that we want to be at.
              </div>
            </div>
          </div>
          <div class="relative mb-3 ">
            <h6 class="mb-0">
              <button
                class="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
                data-collapse-target="animated-collapse-2"
              >
                <span>How to use Material Tailwind? {"   "}</span>
                <i class="absolute right-0 pt-1 text-base transition-transform fa fa-chevron-down group-open:rotate-180"></i>
              </button>
            </h6>

            <div
              data-collapse="animated-collapse-2"
              class="h-0 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div class="p-4 text-sm leading-normal text-blue-gray-500/80">
                We're not always in the position that we want to be at.
              </div>
            </div>
          </div>
          <div class="relative mb-3">
            <h6 class="mb-0">
              <button
                class="relative flex items-center w-full p-4 font-semibold text-left transition-all ease-in border-b border-solid cursor-pointer border-slate-100 text-slate-700 rounded-t-1 group text-dark-500"
                data-collapse-target="animated-collapse-3"
              >
                <span>What can I do with Material Tailwind?</span>
                <i class="absolute right-0 pt-1 text-base transition-transform fa fa-chevron-down group-open:rotate-180"></i>
              </button>
            </h6>
            <div
              data-collapse="animated-collapse-3"
              class="h-0 overflow-hidden transition-all duration-300 ease-in-out"
            >
              <div class="p-4 text-sm leading-normal text-blue-gray-500/80">
                We're not always in the position that we want to be at.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSingleAccardion;
