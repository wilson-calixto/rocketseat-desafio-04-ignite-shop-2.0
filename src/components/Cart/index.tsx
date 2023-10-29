import * as Dialog from '@radix-ui/react-dialog'
import axios from 'axios'
import Image from 'next/image'
import { X } from 'phosphor-react'
import { useCallback, useState } from 'react'
import { CartButton } from '../CartButton'
import {
  CartClose,
  CartContent,
  CartProduct,
  CartProductDetails,
  CartProductImage,
  FinalizationDetails,
} from './styles'
import { formattedPrice } from '../../utils/formattedPrice'
import {
  useShoppingCart
} from 'use-shopping-cart'
import { ProductProps } from '../../utils/interfaces'
export const Cart = () => {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  const { removeItem, cartDetails, clearCart, redirectToCheckout, cartCount } = useShoppingCart()

  const cartItems = Object.values(cartDetails).map(item => item as ProductProps);


  const cartTotal = cartItems.reduce(
    (total, prod) => (total += prod.numberPrice),
    0,
  )

  const cartQuantity = cartItems.length
  const quantityText = `${cartQuantity} ${cartQuantity <= 1 ? 'item' : 'itens'}`
  const isDisabled = !cartQuantity || isCreatingCheckoutSession
  const optionButtonText = !cartQuantity
    ? 'Nenhum item no carrinho'
    : 'Aguarde...'
  const buttonCheckoutText = isDisabled ? optionButtonText : 'Finalizar compra'

  const handleRemove = useCallback(
    (id: string) => removeItem(id),
    [removeItem],
  )

  const handleCheckout = async () => {
    if (cartCount > 0) {
      try {
        setIsCreatingCheckoutSession(true)
        const response = await redirectToCheckout()
        if (response?.error) {
          console.error(response)
        } else {
          clearCart()
          const { checkoutUrl } = response.data
          window.location.href = checkoutUrl
        }

      } catch (error) {
        setIsCreatingCheckoutSession(false)
        alert('Falha ao redirecionar ao checkout!')
      }
    }
  }


  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <CartButton quantity={cartQuantity} />
      </Dialog.Trigger>

      <Dialog.Portal>
        <CartContent>
          <CartClose>
            <X size={24} weight="bold" />
          </CartClose>

          <h2>Sacola de compras</h2>

          <section>
            {!cartQuantity ? (
              <p>Parece que seu carrinho está vazio :(</p>
            ) : (
              cartItems.map((item) => (
                <CartProduct key={item.id}>
                  <CartProductImage>
                    <Image width={95} height={95} alt="" src={item.imageUrl} />
                  </CartProductImage>

                  <CartProductDetails>
                    <div>
                      <p>{item.name}</p>
                      <strong>{item.price}</strong>
                    </div>

                    <button type="button" onClick={() => handleRemove(item.id)}>
                      Remover
                    </button>
                  </CartProductDetails>
                </CartProduct>
              ))
            )}
          </section>

          <FinalizationDetails>
            <div>
              <span>Quantidade</span>
              <p>{quantityText}</p>
            </div>
            <div>
              <span>Valor total</span>
              <p>{formattedPrice.format(cartTotal)}</p>
            </div>

            <button
              type="button"
              disabled={isDisabled}
              onClick={handleCheckout}
            >
              {buttonCheckoutText}
            </button>
          </FinalizationDetails>
        </CartContent>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
