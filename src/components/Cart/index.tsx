// import { useCart } from '@/hooks/useCart'

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
import { useCart } from '../hooks/useCart'

export const Cart = () => {
  const [isCreatingCheckoutSession, setIsCreatingCheckoutSession] =
    useState(false)

  const { arrayDeObjetos, cartTotal, removeCartItem } = useCart()
  console.log('cartTotal', cartTotal)
  const cartQuantity = arrayDeObjetos.length
  const quantityText = `${cartQuantity} ${cartQuantity <= 1 ? 'item' : 'itens'}`
  const isDisabled = !cartQuantity || isCreatingCheckoutSession
  const optionButtonText = !cartQuantity
    ? 'Nenhum item no carrinho'
    : 'Aguarde...'
  const buttonCheckoutText = isDisabled ? optionButtonText : 'Finalizar compra'

  const handleRemove = useCallback(
    (id: string) => removeCartItem(id),
    [removeCartItem],
  )

  const handleCheckout = async () => {
    try {
      setIsCreatingCheckoutSession(true)
      const response = await axios.post('/api/checkout', {
        products: arrayDeObjetos,
      })

      const { checkoutUrl } = response.data
      window.location.href = checkoutUrl
    } catch (error) {
      setIsCreatingCheckoutSession(false)
      alert('Falha ao redirecionar ao checkout!')
    }
  }
  console.log('mapa', arrayDeObjetos)


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
              arrayDeObjetos.map((item) => (
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
