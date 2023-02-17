import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { ethers } from "ethers";
import QRCode from "react-qr-code";
import { hashMessage } from "@ethersproject/hash";
import { AiOutlineLink, AiOutlineArrowRight } from "react-icons/ai";
import { TiTick, TiTimes } from "react-icons/ti";
import { toast } from "react-hot-toast";

type Props = {};

const PaymentPage = (props: Props) => {
  const router = useRouter();
  const { paymentId } = router.query;

  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);

  const [exchangeRate, setExchangeRate] = useState(0);
  const [chain, setChain] = useState("");
  const [symbol, setSymbol] = useState("");
  const [currencies, setCurrencies] = useState([]);

  const selectedCurrency = useRef();
  const [url, setUrl] = useState("");
  const [txnHash, setTxnHash] = useState("");

  const [address, setAddress] = useState("");

  const [inProgress, setInProgress] = useState(false);

  const [mobilePayment, setMobilePayment] = useState(false);

  const getCurrencyExchangeRate = async (e) => {
    let crypto = e.target.value;
    if (crypto === "ethereum-testnet") {
      setChain("5");
      crypto = "ethereum";
      setSymbol("ETH");
    } else {
      setChain(currencies.find((c) => c.id === crypto)?.chainId);
      setSymbol(currencies.find((c) => c.id === crypto)?.symbol);
    }
    let currencyCache = JSON.parse(localStorage.getItem(crypto));
    if (!currencyCache || currencyCache.ttl > Date.now()) {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${crypto}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      const newData = { data: response.data, ttl: Date.now() + 1000 * 60 * 60 };
      localStorage.setItem(crypto, JSON.stringify(newData));
      currencyCache = newData;
    }
    setExchangeRate(
      currencyCache.data.market_data.current_price[
        paymentData.currency.toLowerCase()
      ]
    );
  };

  const getAllCurrencies = async () => {
    let allCurrencies = JSON.parse(localStorage.getItem("currencies"));
    if (!allCurrencies || allCurrencies.ttl > Date.now()) {
      const currencyData = [
        {
          id: "ethereum",
          name: "Ethereum Mainnet",
          symbol: "ETH",
          decimals: 18,
          chainId: "1",
        },
        {
          id: "ethereum-testnet",
          name: "Ethereum Goerli",
          symbol: "GoerliETH",
          decimals: 18,
          chainId: "5",
        },
        {
          id: "matic-network",
          name: "Polygon",
          symbol: "MATIC",
          decimals: 18,
          chainId: "80001",
        },
      ];
      const newData = {
        data: currencyData,
        ttl: Date.now() + 1000 * 60 * 60,
      };

      localStorage.setItem("currencies", JSON.stringify(newData));
      allCurrencies = newData;
    }
    setCurrencies(
      allCurrencies.data.map((cD) => ({
        id: cD.id,
        name: cD.name,
        chainId: cD.chainId,
        symbol: cD.symbol,
      }))
    );
  };

  useEffect(() => {
    if (isNaN(exchangeRate) || exchangeRate === 0) {
      return;
    }
    setUrl(
      `ethereum:pay-${
        paymentData.address
      }@${chain}/?value=${ethers.utils.parseEther(
        (paymentData.amount / 100 / exchangeRate).toFixed(18).toString()
      )}`
    );
  }, [exchangeRate, paymentData.amount, paymentData.address]);

  useEffect(() => {
    (async () => {
      if (!paymentId) {
        return;
      }
      const resp = await axios.get(
        `https://api-stuniq.onrender.com/api/payments/${paymentId}`
      );
      if (resp.status === 200) {
        if (resp.data.status !== "pending") {
          alert(
            "Already Paid, payment ID expired, kindly go to the /verify page to verify payment"
          );
          router.replace("/");
        }
        setPaymentData(resp.data);
        setLoading(false);
      }
      await getAllCurrencies();
    })();
  }, [paymentId]);

  const connectMetamaskWallet = async () => {
    setInProgress(true);
    const notification = toast.loading("Connecting to Wallet...");
    const ethereum = window?.ethereum;
    if (!ethereum) {
      toast.error("Please install MetaMask or any other wallet!!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const authRequestMsg = "Authenticating for Payment...";
    const signingRequest = await signer.signMessage(authRequestMsg);
    const messageSigner = ethers.utils.recoverAddress(
      hashMessage(authRequestMsg),
      signingRequest
    );
    setAddress(messageSigner);
    setInProgress(false);
    toast.success("Wallet Connected", { id: notification });
  };

  const checkNetwork = async () => {
    if (address.length <= 0 || !window?.ethereum) {
      toast.error("Please connect Metamask or any other wallet!!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (window.ethereum.networkVersion !== chain) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: `0x${parseInt(chain).toString(16)}` },
        ]);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const tout = setTimeout(async () => {
      if (!txnHash) {
        console.warn("Transaction Hash not set yet!");
        return;
      }
      if (!window?.ethereum) {
        toast.error("Please install Metamask or any other wallet!!");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const txnData = await provider.getTransactionReceipt(txnHash);
      console.log(txnData);
      if (!txnData) {
        return;
      } else {
        if (txnData.status === 1) {
          await axios.put(`https://api-stuniq.onrender.com/api/payments/${paymentId}`, {
            status: "success",
          });
          router.push(paymentData.s_callback);
        } else {
          await axios.put(`https://api-stuniq.onrender.com/api/payments/${paymentId}`, {
            status: "failed",
          });
          router.push(paymentData.f_callback);
        }
      }
    }, 3000);

    return () => clearTimeout(tout);
  }, [paymentData, txnHash, router]);

  const payViaMetamaskExt = async (toastNotification: string) => {
    if (address.length <= 0 || !window?.ethereum) {
      toast.error("Please connect Metamask or any other wallet!!", {
        id: toastNotification,
      });
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let transaction = await signer.sendTransaction({
      to: paymentData.address,
      from: await signer.getAddress(),
      value: ethers.utils.parseEther(
        (paymentData.amount / 100 / exchangeRate).toFixed(18).toString()
      ),
      chainId: parseInt(chain),
    });

    const txn = await transaction.wait(1);
    setTxnHash(txn.transactionHash);
  };
  return (
    <>
      <Head>
        <title>Blockpay | Pay</title>
      </Head>
      <main className="payment-bg h-screen flex items-center justify-center">
        <div className="w-full md:w-[80%] p-10 rounded-lg flex flex-col md:flex-row bg-black bg-opacity-50 backdrop-blur-xl items-center space-x-10">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="flex flex-col flex-[0.8] justify-between items-center w-full space-y-10">
                <div className="flex w-full justify-between items-center">
                  {/* Merchant Name */}
                  <div className="flex space-x-4 items-center ">
                    <img
                      src={`https://api.dicebear.com/5.x/initials/svg?seed=${paymentData.merchantName}`}
                      className="w-10 h-10 rounded"
                      alt={paymentData.merchantName}
                    />
                    <h1 className="text-gray-50 text-xl font-bold">
                      {paymentData.merchantName}
                    </h1>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col items-start justify-between space-y-5 w-full">
                  <h2 className="text-2xl text-gray-50 font-bold">
                    Description
                  </h2>
                  <p className="text-gray-50 text-lg">
                    {paymentData.description}
                  </p>
                </div>

                {/* Payment Methods Heading */}
                <div className="flex flex-col items-start justify-between space-y-5 w-full">
                  <h2 className="text-3xl text-gray-50 font-bold">
                    Choose Cryptocurrency
                  </h2>
                  <select
                    ref={selectedCurrency}
                    name="cypto"
                    id="crypto"
                    onChange={getCurrencyExchangeRate}
                    className="w-full p-4 bg-transparent border border-gray-600 hover:border-gray-50 transition-all ease-in-out duration-200 rounded-lg focus:outline-none"
                  >
                    <option
                      className="p-3 bg-black text-gray-50 backdrop-blur-xl"
                      value="N/A"
                      disabled
                      selected
                    >
                      Select Currency
                    </option>
                    {currencies.map((c) => (
                      <option
                        className="p-3 bg-black text-gray-50 backdrop-blur-xl"
                        value={c.id}
                        key={c.id}
                      >
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other Data and Pay with Desktop Wallet button */}
                <div className="flex items-start justify-between w-full">
                  {/* Heading and Description */}
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-3xl text-gray-50 font-bold">
                      Amount to Pay
                    </h3>
                    <p className="text-sm text-gray-200 font-light">
                      you can pay this using any cryptocurrency
                    </p>
                  </div>
                  {/* Input with Value */}
                  <input
                    type="text"
                    value={`${new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: paymentData.currency,
                    }).format(paymentData.amount / 100)} ${
                      paymentData.currency
                    }`}
                    disabled
                    className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
                  />
                </div>

                {exchangeRate > 0 && (
                  <div className="flex items-start justify-between w-full">
                    {/* Heading and Description */}
                    <div className="flex flex-col space-y-1">
                      <h3 className="text-3xl text-gray-50 font-bold">
                        Exchange Rate
                      </h3>
                      <p className="text-sm text-gray-200 font-light">
                        we guarantee latest exchange rates
                      </p>
                    </div>
                    {/* Input with Value */}
                    <input
                      type="text"
                      value={`1 ${symbol} = ${new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: paymentData.currency,
                      }).format(exchangeRate)} ${paymentData.currency}`}
                      disabled
                      className="p-3 text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
                    />
                  </div>
                )}

                {exchangeRate > 0 && (
                  <div className="flex items-start justify-between w-full">
                    {/* Heading and Description */}
                    <div className="flex flex-col space-y-1">
                      <h3 className="text-3xl text-gray-50 font-bold">
                        Grand Total Amount to Pay
                      </h3>
                      <p className="text-sm text-gray-200 font-light">
                        you will pay this amount using your selected currency
                      </p>
                    </div>
                    {/* Input with Value */}
                    <input
                      type="text"
                      value={`${
                        paymentData.amount / 100 / exchangeRate
                      } ${symbol}`}
                      disabled
                      className="p-3 font-bold text-gray-50 text-xl bg-transparent focus:outline-none border border-gray-600 hover:border-gray-50 rounded-lg transition-all duration-100 ease-in-out"
                    />
                  </div>
                )}

                {exchangeRate > 0 && (
                  <button
                    disabled={inProgress}
                    onClick={
                      address.length <= 0
                        ? connectMetamaskWallet
                        : async () => {
                            const notification = toast.loading(
                              "Payment in progress..."
                            );
                            setInProgress(true);
                            const ok = await checkNetwork();
                            try {
                              if (ok) {
                                await payViaMetamaskExt(notification);
                              }
                            } catch (err) {
                              toast.error("Cancelled / Error", {
                                id: notification,
                              });
                              console.error(err);
                            }
                            setInProgress(false);
                            toast.success("Payment Successful", {
                              id: notification,
                            });
                          }
                    }
                    className="w-full bg-gradient-to-r disabled:opacity-50 from-[#38B2AE] to-[#00A5AA] p-4 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
                  >
                    <AiOutlineArrowRight size={20} />
                    <span className="font-[500]">
                      {address.length <= 0
                        ? "Connect & Pay using Desktop Wallet"
                        : `Pay ${
                            paymentData.amount / 100 / exchangeRate
                          } ${symbol} using Desktop Wallet`}
                    </span>
                  </button>
                )}
              </div>
              {/* QR and other beautiful data */}
              <div className="flex flex-col items-center flex-[0.2]">
                {url.length > 0 ? (
                  <div className="flex flex-col items-center justify-center gap-10">
                    <div className="flex flex-col space-y-1">
                      <h3 className="text-3xl text-gray-50 font-bold">
                        Scan the QR Code{" "}
                      </h3>
                      <p className="text-sm text-gray-200 font-light text-center">
                        or Pay using a Desktop wallet
                      </p>
                    </div>
                    <QRCode
                      value={url}
                      bgColor={"#FFFFFF"}
                      fgColor={"#000000"}
                    />
                    <button
                      onClick={async () => {
                        if (!navigator?.clipboard) {
                          toast.error(
                            "Clipboard API is not supported in your browser"
                          );
                        }
                        await navigator.clipboard.writeText(url);
                        toast.success("Copied to clipboard");
                      }}
                      className="btn btn-ghost space-x-1"
                    >
                      <AiOutlineLink size={20} />
                      <span>Copy Link</span>
                    </button>

                    <div className="flex flex-col items-center gap-2">
                      <button
                        disabled={inProgress}
                        onClick={() => {
                          setInProgress(true);
                          const txnHashIp = prompt(
                            "Enter the Transaction Hash from your wallet"
                          );
                          setTxnHash(txnHashIp as string);
                          setInProgress(false);
                          toast.success(
                            "Transaction hash set, it will be verified in background and on success you will be redirected",
                            { position: "top-center" }
                          );
                        }}
                        className="w-full bg-gradient-to-r from-[#b5a46a] disabled:opacity-50 to-[#7C582A] p-3 text-gray-50 rounded-lg hover:opacity-80 transition-all  duration-300 drop-shadow-lg flex space-x-4 items-center justify-center"
                      >
                        <TiTick size={20} />
                        <span>Paid using Mobile Wallet</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="text-center text-gray-50 font-bold flex-wrap">
                    Select Currency to continue
                  </h3>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default PaymentPage;
