import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '../components/layouts/main'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Head>
        <title>Family Tree</title>
        <link rel="icon" href="/tree.png"></link>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout >
    </ChakraProvider>
  )
}

export default MyApp
