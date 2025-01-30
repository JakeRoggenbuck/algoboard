import React, { useState } from "react";

// import { XMarkIcon } from '@heroicons/react/20/solid'

export default function Feedback() {
  const [showButton, SetShowButton] = useState(1);

  return (
    <>
      {showButton ? (
        <>
          <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <div
              aria-hidden="true"
              className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                }}
                className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#3498db] to-[#58d68d] opacity-70"
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
                }}
                className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#3498db] to-[#58d68d] opacity-70"
              />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="text-sm leading-6 text-gray-900">
                <strong className="font-semibold">Have Feedback?</strong>
                <svg
                  viewBox="0 0 2 2"
                  aria-hidden="true"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                >
                  <circle r={1} cx={1} cy={1} />
                </svg>
                Let me know what you think about the AlgoBoard!
              </p>
              <a
                href="https://forms.gle/o2pdkqeoXEVV7kw78"
                className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Feedback Form <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
            <div className="flex flex-1 justify-end">
              <button
                onClick={() => SetShowButton(0)}
                type="button"
                className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
              >
                <span className="sr-only">Dismiss</span>
                {/* <XMarkIcon aria-hidden="true" className="h-5 w-5 text-gray-900" /> */}
                X
              </button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
