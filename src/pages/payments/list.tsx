import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

type Props = {};

const PaymentListPage = (props: Props) => {
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<any>({});
  const [paymentData, setPaymentData] = useState<PaymentData[]>([] as PaymentData[]);

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
          "https://api-stuniq.onrender.com/api/payments/web/list",
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
  }, [token]);
  return (
    <div className="h-screen w-screen payment-bg">
      <Head>
        <title>Blockpay | List</title>
      </Head>
      <header>
        <Navbar avatar={data?.image} authenticated={true} />
      </header>
      <main className="px-48 py-6 flex flex-col gap-6">
        <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-50">Payment List</h2>
            <p className="text-sm text-gray-200 font-light">
              Get Details of all your payments
            </p>
          </div>
          <div className="overflow-x-auto  w-full">
          {paymentData?.length < 0 ? (
            <p>Loading...</p>
          ) : (
            <table className="table w-full bg-transparent">
              <thead>
                <tr>
                  <th>Payment Label</th>
                  <th>Description</th>
                  <th>Amounnt</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paymentData.map((payment) => (
                  <tr key={payment.payment_id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img
                              src={`https://api.dicebear.com/5.x/identicon/svg?seed=${payment.payment_id}`}
                              alt={payment.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{payment.name}</div>
                          <div className="text-sm opacity-50">
                            {payment.payment_id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{payment.description}</td>
                    <td>
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: payment.currency,
                      }).format(payment.amount as number / 100)}
                    </td>
                    <td>{payment.currency}</td>
                    <td>
                      <span
                        className={`badge ${
                          payment.status === "pending"
                            ? "badge-warning"
                            : payment.status === "success"
                            ? "badge-success"
                            : "badge-danger"
                        } gap-2`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <th>
                      <a
                        href={`/payments/status/${payment.payment_id}`}
                        className="btn btn-ghost btn-xs normal-case"
                      >
                        Details
                      </a>
                    </th>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th>Payment Label</th>
                  <th>Description</th>
                  <th>Amounnt</th>
                  <th>Currency</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
        </div>

        
      </main>
    </div>
  );
};

export default PaymentListPage;
