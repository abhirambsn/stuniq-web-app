import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type RequestData = {
  amount: number;
  currency: string;
  description: string;
  s_callback: string;
  f_callback: string;
};

type ResponseData = {
  payment_id?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { amount, currency, description, s_callback, f_callback } = req.body;
  const apiKey = req.headers["x-api-key"];

  try {
    const resp = await axios.post(
      "http://localhost:5000/payments/create",
      {
        amount,
        currency,
        description,
        s_callback,
        f_callback,
      },
      {
        headers: {
          "x-api-key": apiKey,
        },
      }
    );

    if (resp.status === 201) {
      return res.status(201).json({ payment_id: resp.data.payment_id });
    }
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: error.response.data.message });
  }
}
