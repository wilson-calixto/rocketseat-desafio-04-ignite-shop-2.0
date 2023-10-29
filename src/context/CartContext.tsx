import { ReactNode, useCallback, useState } from 'react'
import { createContext } from 'use-context-selector'

export interface ProductProps {
    id: string
    name: string
    imageUrl: string
    price: string
    numberPrice: number
    description: string
    defaultPriceId: string
}

interface CartContextData {
    cartItems: ProductProps[]
    cartTotal: number
    addToCart: (product: ProductProps) => void
    removeCartItem: (productId: string) => void
    checkIfItemAlreadyExists: (productId: string) => boolean
}



interface CartContextProviderProps {
    children: ReactNode
}

export const CartContext = createContext({} as CartContextData)

export const CartContextProvider = ({ children }: CartContextProviderProps) => {
    const [cartItems, setCartItems] = useState<ProductProps[]>([])
    console.log("cartItems", cartItems)
    const cartTotal = cartItems.reduce(
        (total, prod) => (total += prod.numberPrice),
        0,
    )

    const checkIfItemAlreadyExists = useCallback(
        (productId: string) => cartItems.some((prod) => prod.id === productId),
        [cartItems],
    )

    const addToCart = useCallback(
        (product: ProductProps) => {

            const hasItemInCart = checkIfItemAlreadyExists(product.id)
            if (!hasItemInCart) {
                setCartItems((prev) => [...prev, product])
            }
        },
        [checkIfItemAlreadyExists],
    )

    const removeCartItem = useCallback(
        (productId: string) => {
            const hasItemInCart = checkIfItemAlreadyExists(productId)

            if (hasItemInCart) {
                setCartItems((prev) => prev.filter(item => item.id !== productId))
            }

        },
        [checkIfItemAlreadyExists],
    )

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartTotal,
                addToCart,
                removeCartItem,
                checkIfItemAlreadyExists,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}
