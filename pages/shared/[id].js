import Head from "next/head";
import Board from "@/components/board/shared/Board";
import { BoardProvider } from "@/lib/BoardContext";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

function BoardPage() {
  const router = useRouter();
  const [isRouterReady, setIsRouterReady] = useState(false);
  const [boardId, setBoardId] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      setBoardId(router.query.id);
      setIsRouterReady(true);
    }
  }, [router.isReady, router.query.id]);

  if (!isMounted || !isRouterReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Kanbany - Board {boardId}</title>
      </Head>
      <main className="min-h-screen flex flex-col">
        <BoardProvider>
          <div className="p-4 flex-grow">
            <Board id={boardId} />
          </div>
          <Footer />
        </BoardProvider>
      </main>
    </>
  );
}

export default BoardPage;
