import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

type Props = {};

const Hero = (props: Props) => {
  const [animateIndex, setAnimateIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const tout = setTimeout(() => {
      setAnimateIndex((animateIndex + 1) % 3);
    }, 2000);
    return () => clearTimeout(tout);
  }, [animateIndex]);

  return (
    <section className="h-full py-20 px-6 flex flex-col items-center justify-center gap-8">
      <h1 className="text-8xl text-gray-50 font-bold transition-all ease-in-out duration-300">
        <span
          className={
            animateIndex === 0
              ? "text-transparent transition-all ease-in-out duration-300 bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400"
              : "text-gray-50 transition-all ease-in-out duration-300"
          }
        >
          Register.
        </span>
        <span
          className={
            animateIndex === 1
              ? "text-transparent transition-all ease-in-out duration-300 bg-clip-text bg-gradient-to-r from-purple-600 to-pink-400"
              : "text-gray-50 transition-all ease-in-out duration-300"
          }
        >
          Create.
        </span>
        <span
          className={
            animateIndex === 2
              ? "text-transparent transition-all ease-in-out duration-300 bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-300"
              : "text-gray-50 transition-all ease-in-out duration-300"
          }
        >
          Accept.
        </span>
      </h1>

      {/* Data */}
      <div className="flex items-center text-xl flex-col gap-1 text-gray-400">
        <p>
          Stuniq provides best solutions for accepting Crypto payments in your
          business.
        </p>
        <p>Seamless onboarding and easy to use platform.</p>
      </div>

      <div className="flex items-center justify-center space-x-6 text-lg">
        <button
          className="flex bg-gray-50 border border-gray-50 text-black rounded-lg px-8 py-1 hover:bg-black hover:text-gray-50 transition-all duration-200 ease-in-out"
          onClick={() => router.push("/register")}
        >
          Start Accepting Payments
        </button>
        <button
          className={`rounded-lg p-[2px] ${
            animateIndex === 0
              ? "bg-gradient-to-r transition-all duration-300 from-blue-600 to-sky-400"
              : animateIndex === 1
              ? "bg-gradient-to-r transition-all duration-300 from-purple-600 to-pink-400"
              : animateIndex === 2
              ? "bg-gradient-to-r transition-all duration-300 from-orange-600 to-yellow-300"
              : ""
          } transition-all duration-300 ease-in-out shadow-xl drop-shadow-xl`}
          onClick={() => router.push("/docs")}
        >
          <div
            className={`flex px-8 py-1 flex-col items-center justify-center h-full hover:text-[#0c0c0d] bg-black text-gray-50 rounded-lg  hover:bg-gradient-to-r hover:transition-all hover:duration-300 ${
              animateIndex === 0
                ? " hover:from-blue-600 hover:to-sky-400"
                : animateIndex === 1
                ? " hover:from-purple-600 hover:to-pink-400"
                : animateIndex === 2
                ? " hover:from-orange-600 hover:to-yellow-300"
                : ""
            } hover:ease-in-out`}
          >
            <span>Go to Docs</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default Hero;
