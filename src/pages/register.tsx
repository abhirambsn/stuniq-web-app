import axios from "axios";
import { useFormik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowRight } from "react-icons/ai";
import Link from "next/link";

type Props = {};

const RegisterPage = (props: Props) => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      cpassword: "",
      image: "",
      name: "",
    },
    onSubmit: async (values) => {
      const notify = toast.loading("Registration in progress...");
      try {
        console.log(values);
        const resp = await axios.post(
          "https://api-stuniq.onrender.com/api/account/create",
          values
        );
        if (resp.status === 201) {
          toast.success("Account created successfully", { id: notify });
          localStorage.setItem("token", resp.data.token);
          setTimeout(
            () =>
              router.push({
                pathname: "/dashboard",
                query: resp.data,
              }),
            1000
          );
        }
      } catch (err: any) {
        toast.error("Error", { id: notify });
        console.error(err);
        toast.error(err.response.data.error);
      }
    },
  });
  return (
    <>
      <Head>
        <title>Blockpay | Register</title>
      </Head>
      <main className="payment-bg h-screen w-screen flex items-center justify-center">
        <div className="flex rounded-lg flex-col md:flex-row bg-black bg-opacity-50">
          {/* Image */}
          <div className="h-0 w-0 md:h-[45rem] md:w-[45rem] bg-[url('/bg.jpg')] bg-cover bg-center">
            <div className="flex h-full flex-col justify-center items-center backdrop-blur-sm">
              <h1 className="text-center text-gray-50 text-5xl">Register</h1>
            </div>
          </div>
          <div className="w-96 p-10 flex flex-col items-center justify-center h-[45rem] backdrop-blur-md">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col space-y-4 "
            >
              <label htmlFor="name">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Someone"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#0C0D0F] p-3 rounded-lg focus:outline-none"
              />
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
              <label htmlFor="cpassword">Confirm Password</label>
              <input
                type="password"
                name="cpassword"
                placeholder="********"
                value={formik.values.cpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="bg-[#0C0D0F] p-3 rounded-lg focus:outline-none"
              />
              <label htmlFor="image">Image URL</label>
              <input
                type="url"
                name="image"
                placeholder="https://"
                value={formik.values.image}
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
                <span className="font-bold">Register</span>
              </button>

              <Link href="/login" passHref>
                <a className="text-sm hover:underline text-center text-gray-400">
                  Already Registered? Login
                </a>
              </Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default RegisterPage;
