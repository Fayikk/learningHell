import React from 'react'
import { jwtDecode } from 'jwt-decode';
import { forEach } from 'jszip';
import Roles from '../../Constants/Roles';
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";
const InstructorAuth = (WrappedComponent)  => {

    // const Navigate = useNavigate();


        return(props) => {
            const token = localStorage.getItem("token");
            if (token!=null) {
                const decode  = jwtDecode(token);
                    
                var rolCounter = 0;
                for (let index = 0; index < decode.role.length; index++) {
                    const element = decode.role[index];
                    if (element == Roles.Instructor) {
                        rolCounter = rolCounter + 1;
                    }
                }   
                if (rolCounter == 0) {
                    // toast.success("Succeded Enter")
                    window.location.replace("/ErrorPage/403")
                    toast.error("Access Denied")
                    return;
                }
            }
            else {
                window.location.replace("/login")
                return null;
            }
            return <WrappedComponent {...props} ></WrappedComponent>
        } 
}



export default InstructorAuth