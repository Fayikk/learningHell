import React, {Fragment, useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import Collapse from "@mui/material/Collapse";
import FontAwesome from "../../components/UiStyle/FontAwesome";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {totalPrice} from "../../utils";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MesafeliSatis from '../../agrements/MesafeliSatis'
import TeslimatVeIade from '../../agrements/TeslimatVeIade';
import GizlilikPolitikasi from '../../agrements/GizlilikPolitikasi';
import { MatchLocationToCurrency } from '../../main-component/Extensions/MatchLocationToCurrency';
// images
import visa from '../../images/icon/visa.png';
import mastercard from '../../images/icon/mastercard.png';
import iyzico from '../../images/icon/iyzico_ile_ode_colored_horizontal.png'

import CheckWrap from '../CheckWrap'

import './style.scss';
import { useSelector } from 'react-redux';
import { useGetCouponByCodeMutation } from '../../api/couponApi';

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
        title: 'iyzico',
        img: iyzico
    },
];


const CheckoutSection = ({cartList}) => {
    // states

    const [applyCode] = useGetCouponByCodeMutation();
    const cartState = useSelector((state) => state.cartStore)
    const [cartLists,setCartLists] =useState([]);
    const basketItems = localStorage.getItem("basketItems")
    let cartItems = JSON.parse(basketItems)
    const [isAgreementOpen, setIsAgreementOpen] = useState(false);
    const [isRefundAgreementOpen, setIsRefundAgreementOpen] = useState(false);
    const [isSecurityAgreementOpen, setIsSecurityAgreementOpen] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);

    const handleOpenAgreement = () => {
        setIsAgreementOpen(true);
    };
    
    const handleCloseAgreement = () => {
        setIsAgreementOpen(false);
    };
    

    const handleCancelOpenAgreement = () => {
        setIsRefundAgreementOpen(true);
    };
    
    const handleCancelCloseAgreement = () => {
        setIsRefundAgreementOpen(false);
    };


    const handleSecurityOpenAgreement = () => {
        setIsSecurityAgreementOpen(true);
    };
    
    const handleSecurityCloseAgreement = () => {
        setIsSecurityAgreementOpen(false);
    };

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
        payment_method: 'cash',
        card_type: '',
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

    const checkCouponForApply = async (e) => {
        e.preventDefault();
    
        await applyCode(forms.cupon_key).then((response) => {
            if (response.data.result) {
                const discount = response.data.result.discountAmount; // İndirim yüzdesi veya miktarı
                setCouponDiscount(discount); // İndirimi state'e atayın
            } else {
            }
        });
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
                                        <form className="cuponForm" onSubmit={checkCouponForApply}>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                className="formInput radiusNone"
                                                value={forms.cupon_key}
                                                name="cupon_key"
                                                onChange={(e) => changeHandler(e)}
                                            />
                                            <Button type='submit' className="cBtn cBtnBlack" >Apply</Button>
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

<div className='row' >
<Grid className="agreementLink">

                                                    <Button variant="text" onClick={handleOpenAgreement}>
                Mesafeli Satış Sözleşmesi
            </Button>
            <Button variant="text" onClick={handleSecurityOpenAgreement}>
                Gizlilik Politikası
            </Button>
            <Button variant="text" onClick={handleCancelOpenAgreement}>
                Teslimat ve İade
            </Button>
        </Grid>
        </div>
<div className='text text-center' >

<Dialog
        open={isAgreementOpen}
        onClose={handleCloseAgreement}
        aria-labelledby="agreement-dialog-title"
        aria-describedby="agreement-dialog-description"
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="agreement-dialog-title">Mesafeli Satış Sözleşmesi</DialogTitle>
        <DialogContent dividers>
            {/* <div dangerouslySetInnerHTML={{ __html: mesafelisatis.mesafelisatis }} /> */}
            <MesafeliSatis></MesafeliSatis>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCloseAgreement} color="primary">
                Kapat
            </Button>
        </DialogActions>
    </Dialog>
    <Dialog
        open={isSecurityAgreementOpen}
        onClose={handleSecurityCloseAgreement}
        aria-labelledby="agreement-dialog-title"
        aria-describedby="agreement-dialog-description"
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="agreement-dialog-title">Gizlilik Politikası</DialogTitle>
        <DialogContent dividers>
            {/* <div dangerouslySetInnerHTML={{ __html: mesafelisatis.mesafelisatis }} /> */}
            <GizlilikPolitikasi></GizlilikPolitikasi>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleSecurityCloseAgreement} color="primary">
                Kapat
            </Button>
        </DialogActions>
    </Dialog>
    <Dialog
        open={isRefundAgreementOpen}
        onClose={handleCancelCloseAgreement}
        aria-labelledby="agreement-dialog-title"
        aria-describedby="agreement-dialog-description"
        fullWidth
        maxWidth="md"
    >
        <DialogTitle id="agreement-dialog-title">Mesafeli Satış Sözleşmesi</DialogTitle>
        <DialogContent dividers>
            {/* <div dangerouslySetInnerHTML={{ __html: mesafelisatis.mesafelisatis }} /> */}
            <TeslimatVeIade></TeslimatVeIade>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancelCloseAgreement} color="primary">
                Kapat
            </Button>
        </DialogActions>
    </Dialog>
                   
</div>
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
                                                    <TableCell align="right">
                                                        {couponDiscount === 0 ? (
                                                            <span className="current-price">
                                                                {MatchLocationToCurrency()}{totalPrice(cartItems, 0)} 
                                                            </span>
                                                        ) : (
                                                            <>
                                                                {/* Eski fiyat ve indirimli fiyat birlikte gösteriliyor */}
                                                                <span className="old-price">
                                                                    {MatchLocationToCurrency()}{totalPrice(cartItems, 0)}
                                                                </span>
                                                                &nbsp;{/* Boşluk için */}
                                                                <span className="discounted-price">
                                                                    {MatchLocationToCurrency()}{totalPrice(cartItems, couponDiscount)}
                                                                </span>
                                                            </>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>Total Price</TableCell>
                                                     <TableCell 
                                                        align="right">{MatchLocationToCurrency()}{totalPrice(cartItems,couponDiscount)}</TableCell> 
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
