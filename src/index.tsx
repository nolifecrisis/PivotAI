// src/pages/_app.tsx
import type { AppProps } from "next/app";
import "@/styles/globals.css"; // keep your Tailwind import here
import Navbar from "@/components/Navbar";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <Component {...pageProps} />
      </div>
    </>
  );
}
