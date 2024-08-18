import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";
import { usePaymentCheckoutMutation } from '../../api/paymentApi';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import './style.scss';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { cartStateUpdate } from '../../store/reducers/cartSlice';
import { TbBorderRadius } from 'react-icons/tb';
import { payHub } from '../../api/Base/payHubModel';
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import { shoppingCartApi } from '../../api/shoppingCartApi';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '20%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

const CheckWrap = (props) => {
    const [open, setOpen] = React.useState(false);
    const [hubConnection,setHubConnection] = useState();
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [CreatePayment] = usePaymentCheckoutMutation();
    const authenticationState = useSelector((state) => state.authStore)
    const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
    const [status, setStatus] = useState('');
    const [isActive3dSecure,setIsActive3dSecure] = useState(false);
    const nameIdentifier = useSelector((state) => state.authStore.nameIdentifier);
    const push = useNavigate()
    const [isRadio, setIsRadio] = useState(false);
    const Dispatch = useDispatch();
    const [html, setHtml] = useState(null);
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
    const createHubConnection = async () => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl(payHub, {
                accessTokenFactory: () => nameIdentifier,
            })
            .configureLogging(LogLevel.Information)
            .build();
    
        try {
            await hubConnection.start();
        } catch (error) {
            console.error("Error while starting connection: ", error);
        }
    
        setHubConnection(hubConnection);
    };


    useEffect(()=>{
        if (hubConnection) {
                hubConnection.on("MessageForSocket",(res) => {
                    console.log("trigger message for socket",res)



                  if (res.item1 == "success") {
                    push('/order_received');
                    handleClose();
                    Dispatch(cartStateUpdate(res.item2))
                    dispatch(instructorApi.util.invalidateTags(["shoppingCart"]));
                  }
                  else{
                    handleClose();
                  }
                })
        }
    },[hubConnection])
    const changeHandler = (e) => {
        setValue({...value, [e.target.name]: e.target.value});
        validator.showMessages();
    };


    useEffect(()=>{
        createHubConnection();

    },[nameIdentifier])


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

            const sendData = {
                paymentModel:formData,
                isActive3dSecure:isRadio
            }

      await CreatePayment(sendData).then((response) => {

        console.log("trigger response",response)
        validator.hideMessages();
        const userRegex = /^user+.*/gm;
        const email = value.email;
        if (email.match(userRegex) && response.data.isSuccess ) {
            if (isRadio) {
                const blob = new Blob([response.data.result[0].item1.content], { type: "text/html" });
                const objUrl = URL.createObjectURL(blob);
                setHtml(objUrl);
                handleOpen();    
            }
            else if (!isRadio) {
                if (response.data.isSuccess && response.data.result[1].item2.status == "success") {
                    console.log("response.data.result[0]",response.data.result[0])
                    toast.success(response.data.messages[0]);
                    Dispatch(cartStateUpdate(response.data.result[0]))
                    push('/order_received');        
                }
            }
            
        }  else if(!response.data.isSuccess) {
            toast.info(response.data.messages[0] + ".Please check your information again");
            // alert('user not existed! credential is : user@*****.com | vendor@*****.com | admin@*****.com');
        }

     })
            // if (response.error || !response.error.data.isSuccess) {
            //     toast.error(response.error.data.errorMessages[response.error.data.errorMessages.length - 1])
            //     if (response.error.data.errorMessages == []) {
            //         toast.error("Payment is failed please check your information")
            //     }
            // }
           
        } else {
            validator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    };
    return (
        <>
        <Grid className="cardbp mt-20">
        <RadioGroup className="paymentMethod" aria-label="Payment Method"
                                                    name="payment_method"
                                                    onChange={(e) => setIsRadio(!isRadio)}>
                                            <FormControlLabel value="cash" control={<Radio checked={isRadio==true} color="primary"/>}
                                                    label="I want 3d secure"/>
                                            {/* <FormControlLabel value="card" control={<Radio color="primary"/>}
                                                            label="Cash On delivery"/> */}
                                            
                                        </RadioGroup>
                                        <RadioGroup className="paymentMethod" aria-label="Payment Method"
                                                    name="payment_method"
                                                    onChange={(e) => setIsRadio(!isRadio)}>
                                            <FormControlLabel value="cash" control={<Radio checked={isRadio==false} color="primary"/>}
                                                    label="I dont want 3d secure "/>
                                            {/* <FormControlLabel value="card" control={<Radio color="primary"/>}
                                                            label="Cash On delivery"/> */}
                                            
                                        </RadioGroup>
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


<div>
<Modal
  keepMounted
  open={open}
  onClose={handleClose}
  aria-labelledby="keep-mounted-modal-title"
  aria-describedby="keep-mounted-modal-description"
>
  <Box sx={style}>
    <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
      Iyzico 3d Secure
    </Typography>
    <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
    {html && <iframe src={html} width="500" height="500" title="Payment"></iframe>}
    </Typography>
  </Box>
</Modal>
</div>
</>
    )
};

export default CheckWrap;