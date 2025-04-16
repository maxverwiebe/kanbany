import "@/styles/globals.css";
import { ToastProvider } from "@/lib/ToastContext";
import ToastContainer from "@/components/ToastContainer";

export default function App({ Component, pageProps }) {
  return (
    <ToastProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ToastProvider>
  );
}
