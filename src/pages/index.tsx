import Image from "next/future/image"
import Head from 'next/head'
import { GetStaticProps } from "next"
import Link from "next/link"

import { useKeenSlider } from 'keen-slider/react'

import { stripe } from "../lib/stripe"
import { HomeContainer, Product } from "../styles/pages/home"

import 'keen-slider/keen-slider.min.css'
import Stripe from "stripe"
import { Cart } from "../components/Cart"
import { useRouter } from "next/router"
import { CartButton } from "../components/CartButton"
import { MouseEvent, useCallback } from "react"
import {
  useShoppingCart
} from 'use-shopping-cart'
interface HomeProps {
  products: {
    id: string
    name: string
    imageUrl: string
    price: string
  }[]
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48
    }
  });
  const { pathname } = useRouter()

  const showCart = pathname !== '/success'


  const { addItem } = useShoppingCart()


  const handleAddToCart = useCallback(
    (event: MouseEvent<HTMLButtonElement>, product: any) => {
      event.preventDefault()
      addItem(product)
    },
    [addItem],
  )
  return (
    <>
      <Head>
        <title>Home | Ignite Shop</title>
      </Head>

      {showCart && <Cart />}
      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(product => {
          return (
            <Link href={`/product/${product.id}`} key={product.id} prefetch={false}>
              <Product className="keen-slider__slide">
                <Image src={product.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{product.name}</strong>
                  <span>{product.price}</span>

                  <CartButton
                    color="green"
                    size="large"
                    type="button"
                    disabled={(product.id) && null}
                    onClick={(evt) => handleAddToCart(evt, product)}

                  />
                </footer>
              </Product>
            </Link>
          )
        })}
      </HomeContainer>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  });


  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;
    const unitAmount = (price.unit_amount ?? 0) / 100

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount / 100),
      numberPrice: unitAmount,
      description: product.description,
      defaultPriceId: price.id,
    }
  })

  return {
    props: {
      products
    },
    revalidate: 60 * 60 * 2 // 2 hours,
  }
}
