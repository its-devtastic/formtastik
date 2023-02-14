import { NextApiRequest, NextApiResponse } from "next";

type Provider = (data: Record<string, unknown>) => Promise<void>;
interface CreateFormHandlerOptions {
  providers: Provider[];
}

export default function createFormHandler({
  providers,
}: CreateFormHandlerOptions) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
      return res.status(405).end();
    }

    if (typeof req.body !== "object") {
      return res
        .status(400)
        .json({ message: "Request body should be valid JSON" });
    }

    for (const provider of providers) {
      try {
        await provider(req.body);
      } catch (error) {
        console.error(error);
      }
    }

    return res.status(201).end();
  };
}
