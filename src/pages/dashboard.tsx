import Navbar from "@/components/Navbar";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineLink } from "react-icons/ai";
import { ethers } from "ethers";
import { hashMessage } from "@ethersproject/hash";
import { toast } from "react-hot-toast";

type Props = {};

const DashboardPage = (props: Props) => {
  const router = useRouter();
  const query = router.query;

  const [token, setToken] = useState<string>("");
  const [data, setData] = useState<UserData>();

  const [inProgress, setInProgress] = useState(false);
  const [address, setAddress] = useState<string>("");

  const [newAccount, setNewAccount] = useState<string>("");
  const [newPrivateKey, setNewPrivateKey] = useState<string>("");

  const connectMetamaskWallet = async () => {
    setInProgress(true);
    try {
      const ethereum = window?.ethereum;
      if (!ethereum) {
        toast.error("Please install MetaMask or any other wallet!!");
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const authRequestMsg = "Authenticating for Dashboard Connection...";
      const signingRequest = await signer.signMessage(authRequestMsg);
      const messageSigner = ethers.utils.recoverAddress(
        hashMessage(authRequestMsg),
        signingRequest
      );
      setAddress(messageSigner);
    } catch (error) {
      toast.error("Cancelled or error occurred");
      console.error(error);
    }
    setInProgress(false);
  };

  const deleteTrigger = async () => {
    const notification = toast.loading("Deletion in Progress...");
    setInProgress(true);
    if (token) {
      return;
    }
    const cnf = confirm("Are you sure you want to delete this account?");
    if (cnf) {
      const resp = await axios.delete(
        "https://stuniq.vercel.app/api/accounts/delete",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (resp.status === 200) {
        toast.success(resp.data.message, {id: notification});
        localStorage.removeItem("token");
        router.push("/");
      } else {
        toast.error("Something went wrong", {id: notification});
        return;
      }
    }
    setInProgress(false);
  };

  const transferTrigger = async () => {
    setInProgress(true);
    const notification = toast.loading("Transferring Account...");
    if (newAccount.length === 0 || newPrivateKey.length === 0) {
      toast.error("Empty Fields", {id: notification});
      return;
    }
    if (!window?.ethereum) {
      toast.error("Please install MetaMask or any other wallet!!", {id: notification});
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    try {
      const balance = await provider.getBalance(address);
      const feeData = await provider.getFeeData();
      let gasFee = feeData.gasPrice;
      if (!gasFee) {
        gasFee = ethers.utils.parseUnits("10", "gwei");
      }
      gasFee = gasFee.add(ethers.BigNumber.from("10000000000000000"));
      console.log("Gas Fee:", ethers.utils.formatEther(gasFee));
      const netBalance = balance.sub(gasFee);

      let transaction = await signer.sendTransaction({
        to: newAccount,
        from: await signer.getAddress(),
        value: netBalance,
      });

      await transaction.wait();

      // Send API call to edit data on server
      const resp = await axios.put(
        "https://api-stuniq.onrender.com/api/account/update",
        {
          address: newAccount,
          privateKey: newPrivateKey,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (resp.status === 200) {
        toast.success(resp.data.message, {id: notification});
        setNewAccount("");
        setNewPrivateKey("");
      }
    } catch (error) {
      toast.error("Cancelled or error occurred", {id: notification});
      console.error(error);
    }

    setInProgress(false);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token") as string);
    }
    if (token.length <= 0) {
      return;
    }
    console.log("Token", token);
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
        console.error(error);
        localStorage.removeItem("token");
        router.replace("/login");
      }
    })();
  }, [token, router]);
  return (
    <div className="payment-bg h-screen w-screen">
      <Head>
        <title>Stuniq | Dashboard</title>
      </Head>
      <header>
        <Navbar avatar={data?.image} authenticated={true} />
      </header>
      <main className="p-6 flex flex-col gap-6">
        {Object.keys(query).length > 0 && (
          <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-50">
                Sensitive Information
              </h2>
              <p className="text-sm text-gray-200 font-light">
                you will only get to see this information once
              </p>
            </div>
            <div className="flex items-start justify-between w-full">
              {/* Heading and Description */}
              <div className="flex flex-col space-y-1">
                <h3 className="text-2xl text-gray-50 font-bold">API Key</h3>
                <p className="text-sm text-gray-200 font-light">
                  you will need this key to be able to use our service
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="p-3 text-gray-50 text bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                  {query.apiKey}
                </span>
                <button
                  onClick={async () => {
                    if (!navigator?.clipboard) {
                      toast.error("Clipboard API is not supported in your browser");
                    }
                    await navigator.clipboard.writeText(query.apiKey as string);
                    toast.success("Copied to clipboard");
                  }}
                  className="btn btn-ghost space-x-1"
                >
                  <AiOutlineLink size={20} />
                </button>
              </div>
            </div>
            <div className="flex items-start justify-between w-full">
              {/* Heading and Description */}
              <div className="flex flex-col space-y-1">
                <h3 className="text-2xl text-gray-50 font-bold">Private Key</h3>
                <p className="text-sm text-gray-200 font-light">
                  import this in your wallet application to operate your account
                </p>
              </div>
              {/* Input with Value */}
              <div className="flex items-center space-x-2">
                <span className="p-3 text-gray-50 text bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                  {query.privateKey}
                </span>
                <button
                  onClick={async () => {
                    if (!navigator?.clipboard) {
                      toast.error("Clipboard API is not supported in your browser");
                    }
                    await navigator.clipboard.writeText(query.privateKey as string);
                    toast.success("Copied to clipboard");
                  }}
                  className="btn btn-ghost space-x-1"
                >
                  <AiOutlineLink size={20} />
                </button>
              </div>
            </div>

            <button
              onClick={() => router.replace("/dashboard")}
              className="bg-gradient-to-r disabled:opacity-50 from-[#38B2AE] to-[#00A5AA] p-2 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center w-full"
            >
              I have saved everything I need
            </button>
          </div>
        )}

        <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-50">
              User Data and Statistics
            </h2>
            <p className="text-sm text-gray-200 font-light">
              get detailed insights about your Stuniq Payments Account
            </p>
          </div>

          <div className="flex">
            <div className="flex flex-col w-full items-start space-y-4 ">
              <h3 className="text-xl text-gray-50 font-bold">Merchant Name</h3>
              <div className="flex items-center space-x-2">
                <img
                  className="h-10 w-10 object-cover rounded-xl"
                  src={data?.image}
                  alt={data?.name}
                />
                <span className="text-xl text-gray-50">{data?.name}</span>
              </div>
              <div className="flex space-x-2 items-center">
                <h3 className="text-lg text-gray-50 font-bold">Member Since</h3>
                <p className="text text-gray-50">
                  {new Date(data?.createdAt as string).toLocaleDateString("en-IN", {
                    dateStyle: "long",
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col w-full items-start space-y-4">
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl text-gray-50 font-bold">
                  Wallet Address
                </h3>
                <p className="text-sm text-gray-200 font-light">
                  all your funds will be sent into this account (keep the
                  Private Key secret shhh...)
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="p-3 text-gray-50 text bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                  {data?.address}
                </span>
                <button
                  onClick={async () => {
                    if (!navigator?.clipboard) {
                      toast.error("Clipboard API is not supported in your browser");
                    }
                    await navigator.clipboard.writeText(data?.address as string);
                    toast.success("Copied to clipboard");
                  }}
                  className="btn btn-ghost space-x-1"
                >
                  <AiOutlineLink size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <h3 className="text-gray-50 text-5xl">
                {data?.stats?.paymentCount}
              </h3>
              <p className="text-gray-50 text-2xl">
                Payments created <br />
                <span className="text-sm text-gray-200 text-light">
                  since account creation...
                </span>
              </p>
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-gray-50 text-5xl">
                {data?.stats?.successfulPayment}
              </h3>
              <p className="text-gray-50 text-2xl">Successful Payments</p>
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-gray-50 text-5xl">
                {data?.stats?.paymentValue === null
                  ? 0
                  : data?.stats?.paymentValue}
              </h3>
              <p className="text-gray-50 text-2xl">Collected</p>
            </div>
          </div>
        </div>

        {/* Web 3 Section */}
        {Object.keys(query).length <= 0 && (
          <div className="p-6 bg-black bg-opacity-50 rounded shadow-lg flex flex-col gap-5">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-50">Web3.0 Corner</h2>
              <p className="text-sm text-gray-200 font-light">
                everything Web3.0
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 text-2xl font-bold">
                  Connected Wallet Address
                </h3>
                <p className="text-sm text-gray-200 font-light">
                  Address of Connected Wallet
                </p>
              </div>
              {address.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="p-3 text-gray-50 text bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out">
                    {address}
                  </span>
                  <button
                    onClick={async () => {
                      if (!navigator?.clipboard) {
                        toast.error("Clipboard API is not supported in your browser");
                      }
                      await navigator.clipboard.writeText(address);
                      toast.success("Copied to clipboard");
                    }}
                    className="btn btn-ghost space-x-1"
                  >
                    <AiOutlineLink size={20} />
                  </button>
                </div>
              ) : (
                <button
                  disabled={inProgress}
                  onClick={connectMetamaskWallet}
                  className="bg-gradient-to-r disabled:opacity-50 from-[#38B2AE] to-[#00A5AA] p-4 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
                >
                  <span className="font-[500]">Connect Wallet</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 text-2xl font-bold">
                  Transfer Funds
                </h3>
                <p className="text-sm text-gray-200 font-light">
                  Transfer your funds to another account of your choosing and
                  makes it the default account
                </p>
              </div>
              <label
                htmlFor="transfer-modal"
                className="cursor-pointer bg-gradient-to-r disabled:opacity-50 from-yellow-400 to-yellow-700 p-4 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
              >
                <span className="font-[500]">Transfer Account</span>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col space-y-1">
                <h3 className="text-gray-50 text-2xl font-bold">
                  Delete Account
                </h3>
                <p className="text-sm text-gray-200 font-light">
                  Delete your account (Transfer your funds to another account
                  before this action)
                </p>
              </div>
              <button
                disabled={address.length === 0 || inProgress}
                onClick={deleteTrigger}
                className="cursor-pointer bg-gradient-to-r disabled:opacity-50 from-red-400 to-red-700 p-4 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
              >
                <span className="font-[500]">Delete Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Modals */}
        {/* Transfer Modal */}
        <input type="checkbox" id="transfer-modal" className="modal-toggle" />
        <div className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-[#0c0c0d] bg-opacity-80 backdrop-blur-sm">
            <h3 className="font-bold text-lg">Transfer Account</h3>
            <div className="flex flex-col items-start space-y-4 py-4">
              <label htmlFor="newAccount">New Account Address</label>
              <input
                type="text"
                name="newAccount"
                id="newAccount"
                placeholder="0x..."
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                className="p-3 w-full text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
              />
              <label htmlFor="newPrivKey">Private Key of new Account</label>
              <textarea
                className="p-3 w-full text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
                name="newPrivKey"
                id="newPrivKey"
                value={newPrivateKey}
                onChange={(e) => setNewPrivateKey(e.target.value)}
                cols={30}
                rows={4}
                placeholder="0x..."
              />
            </div>
            <div className="modal-action">
              <button
                onClick={transferTrigger}
                className="bg-gradient-to-r disabled:opacity-50 from-yellow-500 to-yellow-700 p-2 text-gray-50 rounded-md hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
              >
                Transfer Account
              </button>
              <label htmlFor="transfer-modal" className="btn">
                Close
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
