import React, {Fragment, useEffect} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from "../../components/pagetitle/PageTitle";
import CheckoutSection from '../../components/CheckoutSection'
import Scrollbar from '../../components/scrollbar/scrollbar'
import {connect, useDispatch} from "react-redux";
import Footer from '../../components/footer/Footer';
import { useSelector } from 'react-redux';
import { cartStateUpdate } from '../../store/reducers/cartSlice';

const CheckoutPage =({cartList}) => {

    const cartItems = localStorage.getItem("basketItems")
    // let jsonConvert = JSON.parse(cartItems);

    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'Checkout'} pagesub={'Checkout'}/> 
            <CheckoutSection cartList={cartItems}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
// const mapStateToProps = state => {
//     return {
//         cartList: state.cartList.cart,
//     }
// };

// export default connect(mapStateToProps)(CheckoutPage);
export default CheckoutPage
