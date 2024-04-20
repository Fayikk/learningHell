import React, {useState} from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import { usePaymentCheckoutMutation } from '../../api/paymentApi';

import './style.scss';
import { useSelector } from 'react-redux';

const CheckWrap = (props) => {
    const [CreatePayment] = usePaymentCheckoutMutation();
    const authenticationState = useSelector((state) => state.authStore)
    const push = useNavigate()

    const [value, setValue] = useState({
        email: 'user@gmail.com',
        password: '123456',
        card_holder: 'Jhon Doe',
        card_number: '589622144',
        cvv: '856226',
        expire_month: '',
        expire_year:'',
        remember: false,
    });



    // {
    //     "cardHolderName": "string",
    //     "cardNumber": "string",
    //     "expireMonth": "string",
    //     "expireYear": "string",
    //     "cvc": "string",
    //     "identityNumber": "string",
    //     "registrationAddress": "string",
    //     "city": "string",
    //     "country": "string",
    //     "zipCode": "string",
    //     "userId": "string"
    //   }



    const changeHandler = (e) => {
        setValue({...value, [e.target.name]: e.target.value});
        validator.showMessages();
    };



    const [validator] = React.useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));

    const submitForm = async (e) => {
        var formData = new FormData();

        e.preventDefault();
        if (validator.allValid()) {
            // setValue({
            //     email: '',
            //     password: '',
            //     card_holder: '',
            //     card_number: '',
            //     cvv: '',
            //     expire_date: '',
            //     remember: false
            // });

       

            formData.append("CardHolderName",value.card_holder);
            formData.append("CardNumber",value.card_number);
            formData.append("ExpireMonth",value.expire_month);
            formData.append("ExpireYear",value.expire_year);
            formData.append("CardHolderName",value.card_holder);
            formData.append("cvc",value.cvv);
            formData.append("IdentityNumber",props.values.identityNumber);
            formData.append("RegistrationAddress",props.values.address);
            formData.append("City",props.values.dristrict);
            formData.append("Country",props.values.country);
            formData.append("ZipCode",props.values.post_code);
            formData.append("UserId",authenticationState.nameIdentifier);


     var response = await CreatePayment(formData)
            validator.hideMessages();

            const userRegex = /^user+.*/gm;
            const email = value.email;

            if (email.match(userRegex) && response.data.isSuccess ) {
                toast.success(response.data.messages[0]);
                push('/order_received');
            }  else if(!response.data.isSuccess) {
                toast.info(response.data.messages[0] + ".Please check your information again");
                // alert('user not existed! credential is : user@*****.com | vendor@*****.com | admin@*****.com');
            }
        } else {
            validator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    };
    return (
        <Grid className="cardbp mt-20">
            <Grid>
                <form onSubmit={submitForm}>
                    <Grid container spacing={3}>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Card holder Name"
                                name="card_holder"
                                value={value.card_holder}
                                onChange={(e) => changeHandler(e)}
                                type="text"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="formInput radiusNone"
                                required
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                label="Card Number"
                                name="card_number"
                                value={value.card_number}
                                onChange={(e) => changeHandler(e)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="formInput radiusNone"
                            />
                        </Grid>
                        <Grid item sm={6} xs={12}>
                            <TextField
                                fullWidth
                                label="CVV"
                                name="cvv"
                                value={value.cvv}
                                onChange={(e) => changeHandler(e)}
                                type="text"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="formInput radiusNone"
                            />
                        </Grid>
                        <Grid item sm={3} xs={6}>
                            <TextField
                                fullWidth
                                label="Expire Month"
                                name="expire_month"
                                value={value.expire_date}
                                onChange={(e) => changeHandler(e)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="formInput radiusNone"
                            />
                        </Grid>
                        <Grid item sm={3} xs={6}>
                            <TextField
                                minRows={2}
                                maxRows={2}
                                fullWidth
                                label="Expire Year"
                                name="expire_year"
                                value={value.expire_date}
                                onChange={(e) => changeHandler(e)}
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="formInput radiusNone"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formFooter mt-20">
                                <Button fullWidth className="cBtn cBtnLarge cBtnTheme mt-20 ml-15" type="submit">Proceed to Checkout</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
};

export default CheckWrap;