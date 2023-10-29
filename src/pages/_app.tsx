import { AppProps } from "next/app"
import { globalStyles } from "../styles/global"

import logoImg from "../assets/logo.svg"
import { Container, Header } from "../styles/pages/app"

import Image from "next/future/image"
import { CartContextProvider } from "../context/CartContext"
import { CartProvider } from 'use-shopping-cart'

globalStyles()

function App({ Component, pageProps }: AppProps) {
  return (
    <CartProvider
      mode="payment"
      cartMode="checkout-session"
      stripe={process.env.STRIPE_SECRET_KEY}
      currency="USD"
    >
      <CartContextProvider>
        <Container>
          <Header>
            <Image src={logoImg} alt="" />
          </Header>
          <Component {...pageProps} />
        </Container>
      </CartContextProvider>
    </CartProvider>
  )
}

export default App
