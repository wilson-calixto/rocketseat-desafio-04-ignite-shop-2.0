
import { useContextSelector } from 'use-context-selector'
import { CartContext } from '../../context/CartContext'

export const useCart = () =>
  useContextSelector(CartContext, (context) => context)
