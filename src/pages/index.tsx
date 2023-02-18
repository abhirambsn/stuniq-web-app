import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const aboutData = [
  {
    heading: "Seamless Payment Service",
    data: "Our user-friendly interface makes it easy to accept crypto payments for your business or personal use without any hassle.",
    image: "/head1.svg",
  },
  {
    heading:
      "Onboarding Made Simple: Get Started With Our Payment Service Today",
    data: "Getting started is simple. Sign up and our streamlined onboarding process makes it easy to start accepting crypto payments.",
    image: "/head2.svg",
  },
  {
    heading: "No Technical Knowledge Required",
    data: "Our payment service is designed to take away the complexity of blockchain and cryptocurrency. No technical knowledge is needed.",
    image: "/head3.svg",
  },
  {
    heading:
      "Seamless Crypto Payments: The Solution for Your Business or Personal Use",
    data: "Our payment service provides a seamless and efficient solution for accepting crypto payments for both businesses and personal use.",
    image: "/head4.svg",
  },
];

export default function Home() {
  return (
    <div className="bg-[url('/bg.jpg')] bg-cover bg-center">
      <Head>
        <title>BlockPay</title>
        <meta name="description" content="Stuniq - Payments Solutions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="backdrop-brightness-50">
        <Navbar />
      </header>
      <main className="text-3xl backdrop-brightness-50 ">
        {/* Hero Component */}
        <div className="snap-start">
          <Hero />
        </div>
        {/* About Card */}
        <div className="flex items-center justify-center pb-4">
          <div className="flex flex-col gap-4 max-w-[100rem] w-full">
            {aboutData.map((abtData, idx) => (
              <About
                key={idx}
                reverse={idx % 2 == 0}
                heading={abtData.heading}
                data={abtData.data}
                image={abtData.image}
              />
            ))}
          </div>
        </div>
        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
