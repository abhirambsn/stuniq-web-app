import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import yup from "yup";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";

type Props = {};

const LoginPage = (props: Props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, _) => {
      const resp = await axios.post(
        "https://api-stuniq.onrender.com/api/account/web/login",
        {
          email: values.email,
          password: values.password,
        }
      );
      if (resp.status === 200) {
        localStorage.setItem("token", resp.data?.token);
        router.replace("/dashboard");
      }
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.replace("/dashboard");
      }
    }
  }, [router]);
  return (
    <>
      <Head>
        <title>Blockpay | Login</title>
      </Head>
      <header></header>
      <main className="payment-bg h-screen w-screen flex items-center justify-center">
        <div className="flex rounded-lg flex-col md:flex-row bg-black bg-opacity-50">
          {/* Image */}
          <div className="h-0 w-0 md:h-[45rem] md:w-[45rem] bg-[url('/bg.jpg')] bg-cover bg-center">
            <div className="flex h-full flex-col justify-center items-center backdrop-blur-sm">
              <h1 className="text-center text-gray-50 text-5xl">Login</h1>
            </div>
          </div>
          {/* <h1 className="text-3xl text-center text-gray-50 font-bold">Login</h1> put in image */}
          {/* Login form */}
          <div className="w-96 p-10 flex flex-col items-center justify-center h-[45rem] backdrop-blur-md">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col space-y-4 "
            >
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                placeholder="someone@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#0C0D0F] p-3 rounded-lg focus:outline-none"
              />
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#0C0D0F] p-3 rounded-lg focus:outline-none"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r disabled:opacity-50 from-[#38B2AE] to-[#00A5AA] p-3 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
                disabled={formik.isSubmitting}
              >
                <AiOutlineArrowRight size={20} />
                <span className="font-bold">Login</span>
              </button>

              <a
                href="/register"
                className="text-sm hover:underline text-center text-gray-400"
              >
                New User? Register Now
              </a>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
