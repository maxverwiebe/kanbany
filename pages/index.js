import Head from "next/head";
import Board from "../components/Board";

import { BoardProvider } from "@/lib/BoardContext";

import { ToastProvider } from "@/lib/ToastContext";
import ToastContainer from "@/components/ToastContainer";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanban Board</title>
      </Head>
      <main className="p-4">
        <ToastProvider>
          <BoardProvider>
            <Board />
            <ToastContainer />
          </BoardProvider>
        </ToastProvider>
      </main>
    </>
  );
}
