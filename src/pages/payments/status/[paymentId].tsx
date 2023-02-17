import Navbar from "@/components/Navbar";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineArrowLeft, AiOutlineLink } from "react-icons/ai";
import Link from "next/link";

type Props = {};

const PaymentStatusPage = (props: Props) => {
  const router = useRouter();
  const { paymentId } = router.query;
  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<any>({});
  const [paymentData, setPaymentData] = useState<any>([]);

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
      } catch (error) {
        console.log(error);
        router.replace("/login");
      }
    })();
  }, [token, router]);

  useEffect(() => {
    if (token.length <= 0) {
      return;
    }
    (async () => {
      try {
        const resp = await axios.get(
          `https://api-stuniq.onrender.com/api/payments/web/status/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(resp.data);
        setPaymentData(resp.data);
      } catch (error) {
        toast.error("Error Occured");
        console.log(error);
      }
    })();
  }, [token, paymentId]);
  return (
    <div className="payment-bg h-screen w-screen">
      <Head>
        <title>Blockpay | Payment Status</title>
      </Head>
      <header>
        <Navbar avatar={data?.image} authenticated={true} />
      </header>
      <main className="px-48 py-6 flex flex-col gap-6">
        {Object.keys(paymentData).length > 0 ? (
          <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Link href="/payments/list" passHref>
                  <a className="p-3 rounded border border-gray-600 items-center flex hover:opacity-50 transition-all duration-150 ease-in-out">
                    <AiOutlineArrowLeft size={20} />
                  </a>
                </Link>
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-gray-50">
                    Payment Status
                  </h2>
                  <p className="text-sm text-gray-200 font-light">
                    of Payment Id: {paymentId}
                  </p>
                </div>
              </div>

              <div className="items-center justify-center space-x-3">
                <button
                  onClick={async () => {
                    if (!navigator?.clipboard) {
                      toast.error(
                        "Clipboard API is not supported in your browser"
                      );
                    }
                    await navigator.clipboard.writeText(
                      `https://stuniq.vercel.app/payment?paymentId=${paymentId}`
                    );
                    toast.success("Copied to clipboard");
                  }}
                  className="btn no-animation bg-transparent rounded-xl space-x-2 normal-case"
                >
                  <AiOutlineLink size={20} />
                  <span>Copy Payment Link</span>
                </button>
                <span
                  className={`badge ${
                    paymentData.status === "pending"
                      ? "badge-warning"
                      : paymentData.status === "success"
                      ? "badge-success"
                      : "badge-danger"
                  } gap-2 rounded text-lg py-3 px-4`}
                >
                  {paymentData.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img
                      src={`https://api.dicebear.com/5.x/identicon/svg?seed=${paymentData.payment_id}`}
                      alt={paymentData.name}
                    />
                  </div>
                </div>
                <span className="text-gray-50 text-2xl font-bold">
                  {paymentData.name}
                </span>
              </div>
            </div>

            <div className="flex space-y-2 items-start flex-col">
              <h3 className="text-gray-50 font-bold text-2xl">Description</h3>
              <p className="text-gray-50">{paymentData.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h3 className="text-gray-50 font-bold text-3xl">Amount</h3>
                <span className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: paymentData?.currency,
                  }).format(paymentData.amount / 100)}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <h3 className="text-gray-50 font-bold text-3xl">Currency</h3>
                <span className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                  {paymentData?.currency}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-2">
                <h3 className="text-gray-50 font-bold text-3xl">
                  Success Callback
                </h3>
                <span className="text-gray-300 text-light text-sm">
                  Callback URL incase of successful payment
                </span>
              </div>
              <span className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                {paymentData?.s_callback}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 font-bold text-3xl">
                  Failure Callback
                </h3>
                <span className="text-gray-300 text-light text-sm">
                  Callback URL incase of failed payment
                </span>
              </div>
              <span className="p-3  text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                {paymentData?.f_callback}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 font-bold text-3xl">
                  Payment Created on
                </h3>
              </div>
              <span className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                {new Date(paymentData?.createdAt).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 font-bold text-3xl">
                  Last Modified on
                </h3>
              </div>
              <span className="p-3  text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                {new Date(paymentData?.updatedAt).toLocaleDateString("en-IN", {
                  dateStyle: "long",
                })}
              </span>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
};

export default PaymentStatusPage;
