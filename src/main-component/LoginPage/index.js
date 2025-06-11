import React, {useState, useEffect} from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import { useRef } from 'react';
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Link, useLocation, useNavigate} from "react-router-dom";
import './style.scss';
import { useSignInMutation, useSignInWithGoogleMutation } from '../../api/accountApi';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import config from "../config.json"
import GoogleRecaptcha from '../../Environments/GoogleRecaptcha';
import ReCAPTCHA from 'react-google-recaptcha';
import { Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { clearGuestCart } from '../../store/reducers/guestCartSlice';
import { useAddShoppingCartItemMutation } from '../../api/shoppingCartApi';

const LoginPage = (props) => {
    const push = useNavigate();
    const [Login] = useSignInMutation();
    const [LoginWithGoogle] = useSignInWithGoogleMutation();
    const [addBasketItem] = useAddShoppingCartItemMutation();
   const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get("returnUrl");

  const from = location.state?.from || returnUrl || "/home";



    const [loader, setLoader] = useState(false);
    const recaptcha = useRef();
    const guestCart = useSelector((state) => state.guestCartStore.items);
    const dispatch = useDispatch();

    const [value, setValue] = useState({
        email: '',
        password: '',
        remember: false,
    });

    const changeHandler = (e) => {
        setValue({...value, [e.target.name]: e.target.value});
        validator.showMessages();
    };
    
    const googleResponse = async (response) => {
        if (!response.credential) {
            console.error("Unable to get clientId from Google", response);
            return;
        }
        
        var tokenResult = await LoginWithGoogle({
            credential: response.credential
        });
        if (tokenResult && tokenResult.data && tokenResult.data.result && tokenResult.data.result.accessToken) {
            localStorage.setItem("token", tokenResult.data.result.accessToken);
            localStorage.setItem("refreshToken", tokenResult.data.result.refreshToken);
            
            // Merge guest cart after Google login
            await mergeGuestCart();
            push(from, {replace: true});
        }
    };

    const mergeGuestCart = async () => {
        // If there are items in guest cart, add them to authenticated cart
        if (guestCart && guestCart.length > 0) {
            for (const item of guestCart) {
                try {
                    await addBasketItem({
                        courseId: item.courseId
                    });
                } catch (error) {
                    console.error("Error adding guest cart item:", error);
                }
            }
            // Clear guest cart after merging
            dispatch(clearGuestCart());
            toast.success("Your guest cart items have been added to your account");
        }
    };

    const rememberHandler = () => {
        setValue({...value, remember: !value.remember});
    };

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));

    const submitForm = async (e) => {
        e.preventDefault();
        setLoader(true);
        const captchaValue = recaptcha.current.getValue();
        if (!captchaValue) {
            setLoader(false);
            alert("Please fill the I'm not robot");
        } else {
            try {
                const response = await Login({
                    userName: value.email,
                    password: value.password
                });
                
                if (validator.allValid() && response.data.isSuccess) {
                    validator.hideMessages();
        
                    const userRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                    const email = value.email;
                    if (email.match(userRegex)) {
                        localStorage.setItem("token", response.data.result.accessToken);
                        localStorage.setItem("refreshToken", response.data.result.refreshToken);
                        
                        // Merge guest cart after successful login
                        await mergeGuestCart();
                        
                        toast.success('You successfully logged in to Eduko!');
                        setLoader(false);
                        push(returnUrl || '/home');
                    }
                } else {
                    validator.showMessages();
                    toast.error(response.data.errorMessages[0]);
                    setLoader(false);
                }
            } catch (error) {
                console.error("Login error:", error);
                toast.error("An error occurred during login");
                setLoader(false);
            }
        }
    };

    return (
        <Grid className="loginWrapper">
            <Grid className="loginForm">
                <h2>Sign In</h2>
                <p>Sign in to your account</p>
                <form onSubmit={submitForm}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="E-mail"
                                value={value.email}
                                variant="outlined"
                                name="email"
                                label="E-mail"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('email', value.email, 'required|email')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Password"
                                value={value.password}
                                variant="outlined"
                                name="password"
                                type="password"
                                label="Password"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('password', value.password, 'required')}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formAction">
                                <FormControlLabel
                                    control={<Checkbox checked={value.remember} onChange={rememberHandler}/>}
                                    label="Remember Me"
                                />
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </Grid>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtnTheme" disabled={loader} type="submit">
                                    {loader ? <Spinner animation="border"/> : "Login"}
                                </Button>
                            </Grid>
                            <Grid>
                                <div className="loginWithCaptcha" style={{alignItems:"center", justifyContent:"center", marginLeft:"50px", marginTop:"20px"}}>
                                    <ReCAPTCHA ref={recaptcha} sitekey={GoogleRecaptcha.REACT_APP_SITE_KEY} />
                                </div>
                            </Grid>
                           
                            <Grid className="loginWithSocial">
                                <div>
                                    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID}>
                                        <GoogleLogin
                                            clientId={config.GOOGLE_CLIENT_ID}
                                            buttonText="Google Login"
                                            onSuccess={googleResponse}
                                            onFailure={googleResponse}
                                        />                                    
                                    </GoogleOAuthProvider>
                                </div>
                            </Grid>
                            <p className="noteHelp">Don't have an account? <Link to="/register">Create free account</Link></p>
                        </Grid>
                    </Grid>
                </form>
                <div className="shape-img">
                    <i className="fi flaticon-honeycomb"></i>
                </div>
            </Grid>
        </Grid>
    );
};

export default LoginPage;