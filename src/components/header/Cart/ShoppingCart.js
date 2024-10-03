import React from 'react'
import { useSelector } from 'react-redux'

function ShoppingCart() {

 const cartCounter = useSelector((state) => state.cartStore.cartCounter);


  return (
    <>
    <li className="menu-item-has-children">
    <Link onClick={ClickHandler} to="/cart">
      <CiShoppingCart /> ({cartCounter})
    </Link>
  </li>
  </>
  )
}

export default ShoppingCart