import { AppProps } from "next/app";
import Head from "next/head";
import '@radix-ui/themes/styles.css';
import "./styles.css";
import { StoreProvider } from "../context/Store";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient()


function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Theme accentColor="gray" radius="large">
      <Head>
        <title>Welcome to dashboard!</title>
      </Head>
      <main className="subpixel-antialiased text-zinc-600">
        <QueryClientProvider client={queryClient}>
          <StoreProvider>
            <Component {...pageProps} />
          </StoreProvider>
        </QueryClientProvider>
      </main>
    </Theme>
  );
}

export default CustomApp;
