import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import { Button } from 'react-bootstrap'
import { Input } from 'reactstrap';
import { useChangePasswordMutation, useCheckVerificationDigitCodeMutation } from '../../api/accountApi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function VerifyDigitCode() {

    const [digitCode,setDigitCode] = useState();
    const slug = useParams();
    const [sendVerifyDigit] = useCheckVerificationDigitCodeMutation();
    const [changePassword] = useChangePasswordMutation();
    const [isTrueDigitCode,setIsTrueDigitCode] = useState(false);
    const [newPassword,setNewPassword] = useState({
        newPassword:String,
        confirmNewPassword:String
    })
    const push = useNavigate();
//    url:`CheckVerificationMailCode?email=${digitBody.email}.com&digitCode=${digitBody.digitCode}`
    const handleSendDigitCodeValidation = async () => {
        const verifyDigit = {
            email:slug.slug,
            digitCode:digitCode
        }
        await sendVerifyDigit(verifyDigit).then((response) => setIsTrueDigitCode(response.data))
    }


    // public string  Email { get; set; }
    // public string Password { get; set; }
    // public string ConfirmPassword { get; set; } 

    const handleChangePassword = async () => {

        const changePasswordModel = {
            email:slug.slug,
            password:newPassword.newPassword,
            confirmPassword:newPassword.confirmNewPassword
        }


        await changePassword(changePasswordModel).then((response) => {
            toast.success(response.data.messages[0])
            push("/login")
        })
    }


  return (
    <Fragment>
    <Navbar />
    <PageTitle pageTitle={"Verify Digit Code"} pagesub={"Forgot Password"} />
   {
    isTrueDigitCode == false ? (
        <div className='container mt-4'>
        <div className='row justify-content-center'>
            <div className='col-md-6'>
                <div className='card p-4'>
                    <div className='mb-3'>
                        <Input 
                            placeholder='Please Enter Your Digit Code' 
                            className='form-control'
                            type='number'
                            maxLength={6}
                            onChange={(e) => setDigitCode(e.target.value)}
                        />
                    </div>
                    <div className='d-grid'>
                        <Button 
                            className='btn btn-success' 
                            onClick={handleSendDigitCodeValidation}
                        >
                            Verify Code
                        </Button>
                    </div>
                  
                </div>
            </div>
        </div>
    </div>
    ) : (   <div className='container mt-4'>
        <div className='row justify-content-center'>
            <div className='col-md-6'>
                <div className='card p-4'>
                    <div className='mb-3'>
                        <Input 
                            placeholder='New Password' 
                            className='form-control'
                            type='password'
                            onChange={(e) => setNewPassword((prevState) => {return{...prevState,newPassword:e.target.value}})}
                        />
                    </div>
                    <div className='mb-3'>
                        <Input 
                            placeholder='New Password Confirm' 
                            className='form-control'
                            type='password'

                            onChange={(e) => setNewPassword((prevState) => {return{...prevState,confirmNewPassword:e.target.value}})}
                        />
                    </div>
                    <div className='d-grid'>
                        <Button 
                            className='btn btn-success' 
                            onClick={handleChangePassword}
                        >
                            Verify Code
                        </Button>
                    </div>
                  
                </div>
            </div>
        </div>
    </div>)
   }
   
 
</Fragment>
  )
}

export default VerifyDigitCode