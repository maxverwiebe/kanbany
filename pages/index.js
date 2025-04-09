import Head from "next/head";
import Board from "../components/Board";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kanban Board</title>
      </Head>
      <main className="p-8">
        <Board />
      </main>
    </>
  );
}
