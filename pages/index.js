import Head from "next/head";
import Board from "../components/Board";
import { BoardProvider } from "@/lib/BoardContext";
import { ToastProvider } from "@/lib/ToastContext";
import ToastContainer from "@/components/ToastContainer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanbany</title>
      </Head>
      <main className="min-h-screen flex flex-col">
        <ToastProvider>
          <BoardProvider>
            <div className="p-4 flex-grow">
              <Board />
            </div>
            <Footer />
            <ToastContainer />
          </BoardProvider>
        </ToastProvider>
      </main>
    </>
  );
}
