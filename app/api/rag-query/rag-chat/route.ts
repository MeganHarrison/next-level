import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { query, match_count = 5, source } = req.body;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    const ragRes = await fetch(`${process.env.RAG_SERVER_URL}/tool/perform_rag_query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, match_count, source }),
    });
    if (!ragRes.ok) throw new Error("RAG server error");
    const data = await ragRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(502).json({ error: "Failed to contact RAG server" });
  }
}
