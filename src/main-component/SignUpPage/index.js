import React, { useState } from 'react';
import Grid from "@mui/material/Grid";
import SimpleReactValidator from "simple-react-validator";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";

import './style.scss';
import { useSignUpMutation } from '../../api/accountApi';

const SignUpPage = (props) => {
    const navigate = useNavigate();
    const [register] = useSignUpMutation();

    const [value, setValue] = useState({
        email: '',
        full_name: '',
        userName: '',
        phoneNumber: '',
        password: '',
        confirm_password: '',
        role: 'Student'
    });

    console.log(value.password)

    const [validator] = useState(new SimpleReactValidator({
        className: 'errorMessage',
        validators: {
            matchPassword: {  // Custom validator
                message: 'Passwords do not match.',
                rule: (val, params, validator) => {
                    console.log(val)
                    console.log(params)
                    console.log(validator)
                    console.log(value.password)
                    console.log(val === value.password)
                    return val !== value.password;
                },
                required: true
            }
        }
    }));

    const changeHandler = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value });
        validator.showMessages();
    };
    

    const submitForm = async (e) => {
        e.preventDefault();
        if (validator.allValid()) {

            if (value.password !== value.confirm_password) {
                alert("The selected confirm password must be password.")
                return;
            }



            await register({
                userName: value.userName,
                fullName: value.full_name,
                email: value.email,
                phoneNumber: value.phoneNumber,
                password: value.password,
                confirmPassword: value.confirm_password,
                role: value.role
            }).then((response) => {
                if (response.data.isSuccess) {
                    validator.hideMessages();
                    toast.success('Please Check Your Email Address For Verification');
                    navigate('/login');
                }
            });
        } else {
            validator.showMessages();
            toast.error('Empty field is not allowed!');
        }
    };

    return (
        <Grid className="loginWrapper">
            <Grid className="loginForm">
                <h2>Signup</h2>
                <p>Signup your account</p>
                <form onSubmit={submitForm}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Full Name"
                                value={value.full_name}
                                variant="outlined"
                                name="full_name"
                                label="Name"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('full_name', value.full_name, 'required|alpha')}
                        </Grid>
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
                                placeholder="Username"
                                value={value.userName}
                                variant="outlined"
                                name="userName"
                                label="Username"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('userName', value.userName, 'required')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                fullWidth
                                placeholder="Phone Number"
                                value={value.phoneNumber}
                                variant="outlined"
                                name="phoneNumber"
                                label="Phone Number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('phoneNumber', value.phoneNumber, 'required')}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                className="inputOutline"
                                type='password'
                                fullWidth
                                placeholder="Password"
                                value={value.password}
                                variant="outlined"
                                name="password"
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
                            <TextField
                                className="inputOutline"
                                fullWidth
                                type='password'
                                placeholder="Confirm Password"
                                value={value.confirm_password}
                                variant="outlined"
                                name="confirm_password"
                                label="Confirm Password"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onBlur={(e) => changeHandler(e)}
                                onChange={(e) => changeHandler(e)}
                            />
                            {validator.message('confirm_password', value.confirm_password, 'required|matchPassword')}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid className="formFooter">
                                <Button fullWidth className="cBtn cBtnLarge cBtnTheme" type="submit">Sign Up</Button>
                            </Grid>
                            <p className="noteHelp">Already have an account? <Link to="/login">Return to Sign In</Link></p>
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

export default SignUpPage;
