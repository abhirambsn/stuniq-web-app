import Navbar from "@/components/Navbar";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import CurrencyList from "currency-list";
import { AiOutlineArrowRight } from "react-icons/ai";
import { toast } from "react-hot-toast";

type Props = {};

const CreatePaymentPage = (props: Props) => {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [data, setData] = useState<UserData>();

  const currencyListMain = CurrencyList.getAll("en_IN");

  // @ts-ignore
  let currencyList: FiatCurrencyData[] = [];
  Object.keys(currencyListMain).forEach((key) => {
    currencyList.push(currencyListMain[key] as FiatCurrencyData);
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      amount: 0,
      description: "",
      address: "",
      s_callback: "",
      f_callback: "",
      currency: "",
    },
    onSubmit: async (values) => {
      const notification = toast.loading("Creating payment...");
      try {
        const resp = await axios.post(
          "https://api-stuniq.onrender.com/api/payments/web/create",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (resp.status === 200) {
          toast.success("Payment created successfully", { id: notification });
          router.push(`/payments/status/${resp.data.payment_id}`);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong", { id: notification });
      }
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") as string);
    }
    if (token.length <= 0) {
      return;
    }
    (async () => {
      try {
        const resp = await axios.get(
          "https://api-stuniq.onrender.com/api/account/web/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(resp.data);

        formik.setFieldValue("address", resp.data.address);
      } catch (error) {
        console.log(error);
        router.replace("/login");
      }
    })();
  }, [token, router]);
  return (
    <div className="payment-bg h-screen w-screen">
      <Head>
        <title>Stuniq | Create Payment</title>
      </Head>
      <header>
        <Navbar avatar={data?.image} authenticated={true} />
      </header>
      <main className="px-48 py-6 flex flex-col gap-6">
        <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-50">Create Payment</h2>
            <p className="text-sm text-gray-200 font-light">
              Accept payments from customers worldwide
            </p>
          </div>

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col space-y-4"
          >
            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="name" className="text-gray-50 text-2xl">
                  Name
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Give a label to your payment
                </span>
              </div>

              <input
                type="text"
                value={formik.values.name}
                name="name"
                id="name"
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>

            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="amount" className="text-gray-50 text-2xl">
                  Amount
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Enter Amount you want to accept of users (in smallest possible
                  unit)
                </span>
              </div>

              <input
                type="number"
                value={formik.values.amount}
                name="amount"
                id="amount"
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>

            <div className="flex items-start justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="description" className="text-gray-50 text-2xl">
                  Description
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Describe your payment it will be of your help
                </span>
              </div>

              <textarea
                value={formik.values.description}
                name="description"
                id="description"
                cols={25}
                rows={4}
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>

            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="address" className="text-gray-50 text-2xl">
                  Address
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Address
                </span>
              </div>

              <input
                type="text"
                value={formik.values.address}
                name="address"
                id="address"
                readOnly
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>

            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="s_callback" className="text-gray-50 text-2xl">
                  Success Callback
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Where do you want the users to go after successful payment
                </span>
              </div>

              <input
                type="url"
                value={formik.values.s_callback}
                name="s_callback"
                id="s_callback"
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>
            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="f_callback" className="text-gray-50 text-2xl">
                  Failure Callback
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Where do you want the users to go incase of Failed Payment
                </span>
              </div>

              <input
                type="url"
                value={formik.values.f_callback}
                name="f_callback"
                id="f_callback"
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
            </div>

            <div className="flex items-center justify-between ">
              <div className="flex flex-col space-y-1">
                <label htmlFor="currency" className="text-gray-50 text-2xl">
                  Currency
                </label>
                <span className="text-gray-300 text-light text-sm">
                  Choose Currency
                </span>
              </div>

              <input
                list="currencies"
                value={formik.values.currency}
                name="currency"
                id="currency"
                onChange={formik.handleChange}
                className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
              <datalist id="currencies">
                {currencyList.map((item: FiatCurrencyData) => (
                  <option key={item.code as any as string} value={item.code as any as string}>
                    {item.name as any as string}
                  </option>
                ))}
              </datalist>
            </div>

            <button
              disabled={formik.isSubmitting}
              type="submit"
              className="w-full bg-gradient-to-r disabled:opacity-50 from-[#38B2AE] to-[#00A5AA] p-4 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
            >
              <AiOutlineArrowRight size={20} />
              <span className="font-[500]">Create Payment</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreatePaymentPage;
