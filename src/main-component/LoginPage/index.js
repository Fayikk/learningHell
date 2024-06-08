import React, {useState} from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import {toast} from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import {Link, useNavigate} from "react-router-dom";
import './style.scss';
import { useSignInMutation,useSignInWithGoogleMutation } from '../../api/accountApi';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import config from "../config.json"


const LoginPage = (props) => {

    const push = useNavigate()
    const [Login] = useSignInMutation();
    const [LoginWithGoogle] = useSignInWithGoogleMutation();


    const [value, setValue] = useState({
        email: 'fayik.v21@gmail.com',
        password: 'Osman02emre.',
        remember: false,
    });


    const changeHandler = (e) => {
        setValue({...value, [e.target.name]: e.target.value});
        validator.showMessages();
    };


    
    const googleResponse =async (response) => {
        if (!response.credential) {
          console.error("Unable to get clientId from Google", response)
          return;
        }
        
        var decodeJwt = jwtDecode(response.credential)
        // const tokenBlob = new Blob([JSON.stringify({ tokenId: response.tokenId }, null, 2)], { type: 'application/json' });
        // const options = {
        //   method: 'POST',
        //   body: tokenBlob,
        //   mode: 'cors',
        //   cache: 'default'
        // };
        // fetch(config.GOOGLE_AUTH_CALLBACK_URL, options)
        //   .then(r => {
        //     r.json().then(user => {
        //       const token = user.token;
        //       console.log(token);
        //       this.props.login(token);
        //     });
        //   })

        var tokenResult = await LoginWithGoogle({
            credential:response.credential
        });
        if (tokenResult && tokenResult.data && tokenResult.data.result && tokenResult.data.result.accessToken) {
            localStorage.setItem("token", tokenResult.data.result.accessToken);
            localStorage.setItem("refreshToken", tokenResult.data.result.refreshToken);
        push('/home');
                
        }

     
        
          
      };



    const rememberHandler = () => {
        setValue({...value, remember: !value.remember});
    };

    const [validator] = React.useState(new SimpleReactValidator({
        className: 'errorMessage'
    }));



    const submitForm = async (e)  => {
        e.preventDefault();

        var response = await Login({
            userName:value.email,
            password:value.password
        })
        if (validator.allValid() && response.data.isSuccess) {
            validator.hideMessages();

            const userRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            const email = value.email;
            if (email.match(userRegex)) {
                localStorage.setItem("token",response.data.result.accessToken)
                localStorage.setItem("refreshToken",response.data.result.refreshToken)
                toast.success('You successfully Login on Eduko !');
                push('/home');
            }
        } else {
            validator.showMessages();
            toast.error(response.data.errorMessages[0]);
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
                                <Button fullWidth className="cBtnTheme" type="submit">Login</Button>
                            </Grid>
                            <Grid className="loginWithSocial">
                                <div>
                                    <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_ID} >
                                            <GoogleLogin
                                                clientId={config.GOOGLE_CLIENT_ID}
                                                buttonText="Google Login"
                                                onSuccess={googleResponse}
                                                onFailure={googleResponse}
                                            />                                    
                                    </GoogleOAuthProvider>
     
        </div>
                                    
                                {/* <Button className="twitter"><i className="fa fa-twitter"></i></Button>
                                <Button className="linkedin"><i className="fa fa-linkedin"></i></Button> */}
                            </Grid>
                            <p className="noteHelp">Don't have an account? <Link to="/register">Create free account</Link>
                            </p>
                        </Grid>
                    </Grid>
                </form>
                <div className="shape-img">
                    <i className="fi flaticon-honeycomb"></i>
                </div>
            </Grid>
        </Grid>
    )
};

export default LoginPage;