import { ReactNode, useCallback, useState } from 'react'
import { createContext } from 'use-context-selector'
import {
    useShoppingCart
} from 'use-shopping-cart'
export interface ProductProps {
    id: string
    name: string
    imageUrl: string
    price: number
    numberPrice: number
    description: string
    defaultPriceId: string
    sku: string
    currency: string
    formattedPrice: string
    formattedValue: string
    price_data: any
    product_data: any
    quantity: number
    value: number

}

interface CartContextData {
    arrayDeObjetos: ProductProps[]
    cartTotal: number
    addToCart: (product: ProductProps) => void
    removeCartItem: (productId: string) => void
}



interface CartContextProviderProps {
    children: ReactNode
}

export const CartContext = createContext({} as CartContextData)

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
    const { addItem, removeItem, cartDetails, clearCart } = useShoppingCart()

    const arrayDeObjetos = Object.values(cartDetails).map(item => item);


    const cartTotal = arrayDeObjetos.reduce(
        (total, prod) => (total += prod.numberPrice),
        0,
    )



    const addToCart = useCallback(
        (product: ProductProps) => {
            addItem(product)
        },
        [],
    )

    const removeCartItem = useCallback(
        (productId: string) => {
            removeItem(productId)
        },
        [],
    )

    return (
        <CartContext.Provider
            value={{
                arrayDeObjetos,
                cartTotal,
                addToCart,
                removeCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
