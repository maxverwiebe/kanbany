import "@/styles/globals.css";
import ToastContainer from "@/components/ToastContainer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
    </>
  );
}
