import React, { useState, useEffect, useCallback } from "react";
import Header from "../header/Header";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser, InitialState } from "../../store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { initializeGuestCart } from "../../store/reducers/guestCartSlice";

export default function Navbar({ onAuthData }) {
  const [scroll, setScroll] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartState = useSelector((state) => state.cartStore);
  const [authState, setAuthState] = useState({});

  const handleAuthStateChange = useCallback((newState) => {
    setAuthState(newState);
    if (typeof onAuthData != "undefined") {
      onAuthData(newState);
    }
  }, []);
  const handleScroll = () => setScroll(document.documentElement.scrollTop);

  useEffect(() => {
    // Initialize guest cart from localStorage
    dispatch(initializeGuestCart());

    // Check authentication
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      dispatch(
        setLoggedInUser({
          nameIdentifier: decodedToken.nameid,
          email: decodedToken.email,
          role: decodedToken.role,
          userName: decodedToken.unique_name,
          name: decodedToken.givenName,
          InstructorSubId:decodedToken.InstructorSubId,
          profilePicture: decodedToken.ProfilePicure || "",
        })
      );
    } else {
      dispatch(setLoggedInUser(InitialState));
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);

  const className = scroll > 80 ? "fixed-navbar" : "fixed-navbar";

  return (
    <div className={className}>
      <Header onAuthStateChange={handleAuthStateChange} />
    </div>
  );
}
