import React from "react";
import Header from '../header/Header';
import { jwtDecode } from "jwt-decode";
import { useDispatch } from 'react-redux'
import { useScrollTrigger } from "@mui/material";
import { setLoggedInUser } from "../../store/reducers/authSlice";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useGenerateJwtTokenForExpiredMutation } from "../../api/accountApi";
import { useNavigate } from "react-router-dom";


export default function Navbar(props) {
  const [scroll, setScroll] = React.useState(0);
  const [token,setToken] = React.useState('')
  const Dispatch = useDispatch();
  const cartState = useSelector((state) => state.cartStore);
  const push = useNavigate();

  const handleScroll = () => setScroll(document.documentElement.scrollTop);





  React.useEffect( ()=>{
    const token = localStorage.getItem("token")

    if (token) {
      
    const decode_Token = jwtDecode(token);

        setToken(token)

        Dispatch(setLoggedInUser({
            nameIdentifier:decode_Token.nameid,
            email:decode_Token.email,
            role:decode_Token.role,
            userName:decode_Token.unique_name,
            name:decode_Token.givenName
        }))
    }
  })


  React.useEffect(() => {
    


    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    
  }, []);

  const className = scroll > 80 ? "fixed-navbar active" : "fixed-navbar";

  return (
    <div className={className}>
        <Header hclass={props.hclass} Logo={props.Logo} topbarClass={props.topbarClass} />
    </div>
  ); 
}