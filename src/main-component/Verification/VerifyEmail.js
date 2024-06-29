import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import { Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useReSendVerifyEmailMutation, useVerifyEmailMutation } from '../../api/accountApi';
import { Input } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function VerifyEmail() {
    
    const slug = useParams();
    const [SendVerificationCode] = useVerifyEmailMutation();
    const [ReSendEmail] = useReSendVerifyEmailMutation();
    const [email,setEmail] = useState("");
    const push = useNavigate();

 const handleSendVerifyEmailCode = async () => {
    // url:`${verificationModel.verificationCode}?emailAddress=${verificationModel.emailAddress}`,
    const verifyCode = slug;
    const verificationModel = {
        verificationCode:verifyCode,
        emailAddress:email
    }
    await SendVerificationCode(verificationModel).then((response) => {
        if (response.data.isSuccess) {
            toast.success("Your account approved")
            push("/login")
        }
        else {
            toast.error(response.data.messages[0])
        }
    })
 }


 const handleReSendVerifyEmail = async () => {
    await ReSendEmail(email).then((response) => {
        if(response.error)
            {
                toast.error(response.error.data.errorMessages[0])
            }
            if (!response.data.isSuccess) {
                toast.error(response.data.messages[0])
            }
            if (response.data.isSuccess) {
                toast.success(response.data.messages[0])
            }
    })
 }


  
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={"Verify Email"} pagesub={"Verify Email"} />
            <div className='container mt-4'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card p-4'>
                            <div className='mb-3'>
                                <Input 
                                    placeholder='Please Enter Your Email Address' 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    className='form-control'
                                />
                            </div>
                            <div className='d-grid'>
                                <Button 
                                    className='btn btn-success' 
                                    onClick={handleSendVerifyEmailCode}
                                >
                                    Verify Email
                                </Button>
                            </div>
                            <div className='d-grid mt-3'>
                                <Button 
                                    className='btn btn-warning' 
                                    onClick={handleReSendVerifyEmail}
                                >
                                    Re Send Verify Email
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
  )
}

export default VerifyEmail