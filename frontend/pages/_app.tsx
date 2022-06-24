import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../components/layouts/MainLayout";
import "../styles/globals.css";
import { ProvideAuth } from "../hooks/use-auth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProvideAuth>
      <ChakraProvider>
        <Head>
          <title>Family Tree</title>
          <link rel="icon" href="/tree.png"></link>
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </ProvideAuth>
  );
}

export default MyApp;
