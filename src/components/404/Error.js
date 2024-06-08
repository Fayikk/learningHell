import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import erimg from '../../images/error-404.png'


const Error = (props) => {

    const [message,setMessage] = useState();
    
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


     if (props.slug == "403") {
        setMessage("Access Denied")
     }
     else if(props.slug == "404")
        {
            setMessage("Not Found")
        }
        else if(props.slug == "500")
             {
                setMessage("Inernal Server Error")
        }
        else if(props.slug == "400"){
            setMessage("Bad Request")
        }
     







    return(
        <section className="error-404-section section-padding">
            <div className="container">
                <div className="row">
                    <div className="col col-xs-12">
                        <div className="content clearfix">
                            <div className="error">
                                <img src={erimg} alt=""/>
                            </div>
                            <div className="error-message">
                                <h3>{message}</h3>
                                <Link onClick={ClickHandler} to="/home" className="theme-btn"> Back to home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Error;