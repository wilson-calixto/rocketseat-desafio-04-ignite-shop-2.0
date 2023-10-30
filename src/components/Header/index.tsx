import { ComponentProps } from 'react'
import { CartButtonContainer, HeaderContainer } from './styles'
import logoImg from "../../assets/logo.svg"
import Image from "next/future/image"
import { useRouter } from 'next/router'
import { Cart } from '../Cart'

type CartButtonProps = ComponentProps<typeof CartButtonContainer> & {
  quantity?: number
}

export const Header = ({ quantity = 0, ...rest }: CartButtonProps) => {

  const { pathname } = useRouter()

  const showCart = pathname !== '/success'

  return (
    <HeaderContainer>
      <Image src={logoImg} alt="" />
      {showCart && <Cart />}
    </HeaderContainer>
  )
}
