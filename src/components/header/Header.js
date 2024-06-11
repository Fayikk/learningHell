import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import MobileMenu from '../MobileMenu/MobileMenu'
import Logo from '../../images/logo.svg'
import HeaderTopbar from '../HeaderTopbar/HeaderTopbar'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { InitialState,setLoggedInUser } from '../../store/reducers/authSlice'
import { useSelector } from 'react-redux'
import {Dropdown } from 'react-bootstrap'
import { CiShoppingCart } from "react-icons/ci";
import { FaLock } from 'react-icons/fa'; 
const Header = (props) => {


    const [menuActive, setMenuState] = useState(false);
    const authenticationState = useSelector((state) => state.authStore);
    const cartCounter = useSelector((state) => state.cartStore.cartCounter);
    const Navigate = useNavigate();
    const Dispatch = useDispatch();


    const [showDropdown, setShowDropdown] = useState(false);

    const handleMouseEnter = () => {
      setShowDropdown(true);
    };
  
    const handleMouseLeave = () => {
      setShowDropdown(false);
    };
    useEffect(()=>{

    },[authenticationState])

    const SubmitHandler = (e) => {
        e.preventDefault()
    }




    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("refreshToken")
        Dispatch(setLoggedInUser({...InitialState}))
        Navigate("/home")
    }


    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <header id="header">
            <HeaderTopbar topbarClass={props.topbarClass}/>
            <div className={`wpo-site-header ${props.hclass}`}>
                <nav className="navigation navbar navbar-expand-lg navbar-light">
                    <div className="container-fluid">
                        <div className="row align-items-center">
                            <div className="col-lg-3 col-md-4 col-3 d-lg-none dl-block">
                                <div className="mobail-menu">
                                    <MobileMenu />
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                                <div className="navbar-header">
                                    <Link onClick={ClickHandler} className="navbar-brand" to="/home"><img src={Logo}
                                        alt="logo" /></Link>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-1 col-1">
                                <div id="navbar" className="collapse navbar-collapse navigation-holder">
                                    <button className="menu-close"><i className="ti-close"></i></button>
                                    <ul className="nav navbar-nav mb-2 mb-lg-0">
                                        {/* <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/">Home</Link>
                                            <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/home">Home Style 1</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-2">Home Style 2</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-3">Home Style 3</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-4">Home Style 4</Link></li>
                                                <li><Link onClick={ClickHandler} to="/home-5">Home Style 5</Link></li>
                                            </ul>
                                        </li> */}
                                        {/* <li><Link onClick={ClickHandler} to="/about">About</Link></li> */}
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/">Courses</Link>
                                            <ul className="sub-menu">
                                                {/* <li><Link onClick={ClickHandler} to="/course">Messed Up</Link></li> */}
                                                <li><Link onClick={ClickHandler} to="/course-2">Categories</Link></li>
                                                {/* <li><Link onClick={ClickHandler} to="/course-3">Full Festivitiy</Link></li> */}
                                                {/* <li><Link onClick={ClickHandler} to="/course-single/Learn-WordPress-&-Elementor-for-Beginners">Beginner Levels</Link></li> */}
                                            </ul>
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to=""><FaLock></FaLock> Collections</Link>
                                          
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to=""><FaLock></FaLock>Pair Working Rooms</Link>
                                           
                                        </li>
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/become-teacher">Become Teacher</Link>
                                            {/* <ul className="sub-menu">
                                                <li><Link onClick={ClickHandler} to="/blog">Blog right sidebar</Link></li>
                                                <li><Link onClick={ClickHandler} to="/blog-left-sidebar">Blog left sidebar</Link></li> */}
                                                {/* <li><Link onClick={ClickHandler} to="/blog-fullwidth">Blog fullwidth</Link></li> */}
                                                {/* <li className="menu-item-has-children">
                                                    <Link onClick={ClickHandler} to="/">Blog details</Link>
                                                    <ul className="sub-menu">
                                                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Blog details right sidebar</Link>
                                                        </li>
                                                        <li><Link onClick={ClickHandler} to="/blog-single-left-sidebar/Become-a-great-WordPress-&-PHP-developer.">Blog details left
                                                            sidebar</Link></li>
                                                        <li><Link onClick={ClickHandler} to="/blog-single-fullwidth/Become-a-great-WordPress-&-PHP-developer.">Blog details
                                                            fullwidth</Link></li>
                                                    </ul>
                                                </li> */}
                                            {/* </ul> */}
                                        </li>
                                        {/* <li><Link onClick={ClickHandler} to="/contact">Contact</Link></li> */}
                                        <li className="menu-item-has-children">
                                            <Link onClick={ClickHandler} to="/cart"><CiShoppingCart /> ({cartCounter})</Link>
                                           
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-3 col-md-3 col-2">
                                <div className="header-right">
                                    <div className="header-search-form-wrapper">
                                        <div className="cart-search-contact">
                                            <button onClick={() => setMenuState(!menuActive)} className="search-toggle-btn"><i
                                                className={`fi ti-search ${menuActive ? "ti-close" : "fi "}`}></i></button>
                                            <div className={`header-search-form ${menuActive ? "header-search-content-toggle" : ""}`}>
                                                <form onSubmit={SubmitHandler}>
                                                    <div>
                                                        <input type="text" className="form-control"
                                                            placeholder="Search here..." />
                                                        <button type="submit"><i
                                                            className="fi flaticon-search"></i></button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="close-form">

                                        {
                                            authenticationState.userName === '' ? (
                                                <>
                                                <Link onClick={ClickHandler} className="login" to="/login"><span className="text">Sign In</span>
                                                <span className="mobile">
                                                    <i className="fi flaticon-charity"></i>
                                                </span></Link>
                                            <Link onClick={ClickHandler} className="theme-btn" to="/register"><span className="text">Sign Up</span>
                                                <span className="mobile">
                                                    <i className="fi flaticon-charity"></i>
                                                </span></Link>
                                                </>
                                            ) : (
                                                    <>
                                                    <div className='ml-2' >

                                                   <Dropdown
                                                    show={showDropdown}
                                                    onClick={handleMouseEnter}
                                                    onDoubleClick={handleMouseLeave}
                                                 
                                                    >
                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic"    style={{ backgroundColor: 'transparent', border: 'none' }} >
                                               <a className='theme-btn' style={{backgroundColor:'blueviolet'}} > <span className="text"> {authenticationState.userName} </span></a>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu style={{borderRadius:"20px"}} >
                                                        <Dropdown.Item as={Link} to="/MyCourse" >
                                                        My Courses
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link} to="/Instructor" >
                                                        Instructor
                                                        </Dropdown.Item>
                                                        <Dropdown.Item as={Link} to="/home" onClick={logout}>
                                                        MyAccount
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                    </Dropdown>
                                                    </div>



                                                  
                                                <div>
                                                <Link onClick={logout} className="theme-btn" to="/home"><span className="text">Logout</span>
                                                <span className="mobile">
                                                    <i className="fi flaticon-charity"></i>
                                                </span></Link>
                                                </div>

                                          
                                                    </>

                                            ) 
                                        }
                                       
                                           
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    )
}

export default Header;



// <li className="menu-item-has-children">
// <Link onClick={ClickHandler} to="/">Pages</Link>
// <ul className="sub-menu">
//     {/* <li><Link onClick={ClickHandler} to="/lesson">Lesson</Link></li> */}
//     <li><Link onClick={ClickHandler} to="/gallery">Gallery</Link></li>
//     <li><Link onClick={ClickHandler} to="/testimonial">Testimonial</Link></li>
//     <li><Link onClick={ClickHandler} to="/teacher">Teachers</Link></li>
//     <li><Link onClick={ClickHandler} to="/team-single/Courtney-Henry">Teacher Single</Link></li>
//     <li><Link onClick={ClickHandler} to="/become-teacher">Become Teacher</Link></li>
//     <li><Link onClick={ClickHandler} to="/faq">FAQ</Link></li>
//     <li><Link onClick={ClickHandler} to="/404">404 Error</Link></li>
// </ul>
// </li>