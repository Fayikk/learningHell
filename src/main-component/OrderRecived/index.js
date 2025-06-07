import React, {Fragment} from 'react';
import { connect } from "react-redux";
import OrderRecivedSec from '../../components/OrderRecivedSec';
import Navbar from '../../components/Navbar/Navbar';


const OrderRecived =({cartList}) => {






    
    return(
        <Fragment>
            <Navbar/>
             <OrderRecivedSec cartList={cartList}/>
        </Fragment>
    )
};

const mapStateToProps = state => {
    return {
        cartList: state.cartList.cart,
        symbol: state.data.symbol
    }
};

// export default connect(mapStateToProps)(OrderRecived);

export default OrderRecived