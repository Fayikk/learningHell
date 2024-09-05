import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ steps = [] }) => {
  return (
    <nav
      class="flex px-3 py-3 text-gray-700 border border-gray-200 rounded-lg shadow-md  dark:bg-gray-800 dark:border-gray-700"
      aria-label="Breadcrumb"
    >
      <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li class="inline-flex items-center">
          <a
            href="/"
            class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-themeOrange dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              class="w-3 h-3 me-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
            </svg>
            Home
          </a>
        </li>

        {steps.map((step, index) => (
          <li key={index} class="inline-flex items-center">
            <Link
              to={step.to}
              class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-themeOrange dark:text-gray-400 dark:hover:text-white"
            >
              <svg
                class="rtl:rotate-180 block w-3 h-3 mx-1 text-gray-400 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
              {index == steps.length - 1 ? (
                <span class="ms-1 text-sm font-medium text-themeOrange md:ms-2 dark:text-gray-400">
                  {step.title}
                </span>
              ) : (
                step.title
              )}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
