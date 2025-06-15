import RagChat from "@/components/RagChat";

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>RAG Chat</h1>
      <RagChat />
    </main>
  );
}
