import React, {Fragment, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import Collapse from "@mui/material/Collapse";
import FontAwesome from "../../components/UiStyle/FontAwesome";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {Link} from 'react-router-dom'
import {totalPrice} from "../../utils";
import {toast} from 'react-toastify'
import { MatchLocationToCurrency } from '../../main-component/Extensions/MatchLocationToCurrency';
// images
import visa from '../../images/icon/visa.png';
import mastercard from '../../images/icon/mastercard.png';
import skrill from '../../images/icon/skrill.png';
import paypal from '../../images/icon/paypal.png';

import CheckWrap from '../CheckWrap'

import './style.scss';
import { useSelector } from 'react-redux';
import { usePaymentCheckoutMutation } from '../../api/paymentApi';

const cardType = [
    {
        title: 'visa',
        img: visa
    },
    {
        title: 'mastercard',
        img: mastercard
    },
    {
        title: 'skrill',
        img: skrill
    },
    {
        title: 'paypal',
        img: paypal
    },
];


const CheckoutSection = ({cartList}) => {
    // states


    const cartState = useSelector((state) => state.cartStore)
    const [cartLists,setCartLists] =useState([]);
    const basketItems = localStorage.getItem("basketItems")
    let cartItems = JSON.parse(basketItems)

    useEffect(()=>{
            if (cartState.length > 0) {
                setCartLists(cartState)
            }

            
        
    },[cartState])


    




    const [tabs, setExpanded] = React.useState({
        cupon: false,
        billing_adress: false,
        payment: true
    });
    const [forms, setForms] = React.useState({
        cupon_key: '',
        // fname: '',
        // lname: '',
        // country: '',
        // dristrict: '',
        // identityNumber:'',
        // address: '',
        // post_code: '',
        // email: '',
        // phone: '',
        // note: '',

        payment_method: 'cash',
        card_type: '',

        // fname2: '',
        // lname2: '',
        // country2: '',
        // dristrict2: '',
        // address2: '',
        // post_code2: '',
        // email2: '',
        // phone2: '',

        card_holder: '',
        card_number: '',
        cvv: '',
        expire_date: '',
    });


    const [dif_ship, setDif_ship] = React.useState(false);

    // tabs handler
    function faqHandler(name) {
        setExpanded({
            cupon: false,
            billing_adress: false,
            payment: true, [name]: !tabs[name]
        });
    }

    // forms handler
    const changeHandler = e => {
        setForms({...forms, [e.target.name]: e.target.value})
    };

    return (
        <Fragment>
            <Grid className="checkoutWrapper section-padding">
                <Grid className="container" container spacing={3}>
                    <Grid item md={6} xs={12}>
                        <div className="check-form-area">
                            <Grid className="cuponWrap checkoutCard">
                                <Button className="collapseBtn" fullWidth onClick={() => faqHandler('cupon')}>
                                    Have a coupon ? Click here to enter your code.
                                    <FontAwesome name={tabs.cupon ? 'minus' : 'plus'}/>
                                </Button>
                                <Collapse in={tabs.cupon} timeout="auto"
                                        unmountOnExit>
                                    <Grid className="chCardBody">
                                        <p>If you have coupon code,please apply it</p>
                                        <form className="cuponForm">
                                            <TextField
                                                fullWidth
                                                type="text"
                                                className="formInput radiusNone"
                                                value={forms.cupon_key}
                                                name="cupon_key"
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            <Button className="cBtn cBtnBlack">Apply</Button>
                                        </form>
                                    </Grid>
                                </Collapse>
                            </Grid>
                            <Grid className="cuponWrap checkoutCard">
                                <Button className="collapseBtn" fullWidth onClick={() => faqHandler('payment')}>
                                    Payment Method
                                    <FontAwesome name={tabs.payment ? 'minus' : 'plus'}/>
                                </Button>
                                <Grid className="chCardBody">
                                    <Collapse in={tabs.payment} timeout="auto">
                                       
                                        <Collapse in={forms.payment_method === 'cash'} timeout="auto">
                                            <Grid className="cardType">
                                                {cardType.map((item, i) => (
                                                    <Grid
                                                        key={i}
                                                        className={`cardItem ${forms.card_type === item.title ? 'active' : null}`}
                                                        onClick={() => setForms({...forms, card_type: item.title})}>
                                                        <img src={item.img} alt={item.title}/>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                            <Grid>
                                                <CheckWrap values={forms} />
                                            </Grid>
                                        </Collapse>
                                      
                                    </Collapse>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Grid className="cartStatus">
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Grid className="cartTotals">
                                        <h4>Cart Total</h4>
                                        <Table>
                                            <TableBody>
                                                {cartItems.map(item => (
                                                    <TableRow key={item.courseId}>
                                                        <TableCell>{item.courseName} {MatchLocationToCurrency()}{item.coursePrice} </TableCell>
                                                        <TableCell
                                                            align="right">{MatchLocationToCurrency()}{item.coursePrice}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className="totalProduct">
                                                    <TableCell>Total product</TableCell>
                                                    <TableCell align="right">{cartItems.length}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Sub Price</TableCell>
                                                    <TableCell align="right">{MatchLocationToCurrency()}{totalPrice(cartItems)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total Price</TableCell>
                                                     <TableCell 
                                                        align="right">{MatchLocationToCurrency()}{totalPrice(cartItems)}</TableCell> 
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Fragment>
    )
};


export default CheckoutSection;