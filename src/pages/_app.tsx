import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"

import { Container } from "../styles/pages/app"

import { CartProvider } from 'use-shopping-cart'
import { Header } from "../components/Header"

globalStyles()


function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider
      mode="payment"
      cartMode="checkout-session"
      stripe={process.env.STRIPE_SECRET_KEY}
      currency="USD"
    >
      <Container>
        <>
          <Header />
          <Component {...pageProps} />
        </>
      </Container>
    </CartProvider>
  )
}

export default App
