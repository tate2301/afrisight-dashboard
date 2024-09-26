import { AppProps } from "next/app";
import Head from "next/head";
import '@radix-ui/themes/styles.css';
import "./styles.css";
import { StoreProvider } from "../context/Store";
import { Theme } from "@radix-ui/themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";

const queryClient = new QueryClient()


function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Theme accentColor="indigo" radius="large">
      <Head>
        <title>CX Mappers Admin</title>
      </Head>
      <main className="subpixel-antialiased text-zinc-600 flex">
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <StoreProvider>
              <Component {...pageProps} />
            </StoreProvider>
          </QueryClientProvider>
        </AuthProvider>
      </main>
    </Theme>
  );
}

export default CustomApp;
