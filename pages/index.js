// pages/index.js
import Head from "next/head";
import Board from "../components/Board";
import { BoardProvider } from "@/lib/BoardContext";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanbany</title>
      </Head>
      <main className="min-h-screen flex flex-col">
        <BoardProvider>
          <div className="p-4 flex-grow">
            <Board />
          </div>
          <Footer />
        </BoardProvider>
      </main>
    </>
  );
}
