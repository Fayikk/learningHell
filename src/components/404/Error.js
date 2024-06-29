import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import erimg from '../../images/error-404.png'
import { useParams } from 'react-router-dom'

const Error = (props) => {
    const slug = useParams()
    const [message,setMessage] = useState();
    
    const ClickHandler = () =>{
        window.scrollTo(10, 0);
     }


     useEffect(()=>{
        if (props.props.slug == "403") {
            setMessage("Access Denied - 403 Response Error")
         }
         else if(props.props.slug == "404")
            {
                setMessage("Not Found - 404 Response Error")
            }
            else if(props.props.slug == "500")
                 {
                    setMessage("Inernal Server Error - 500 Response Error")
            }
            else if(props.props.slug == "400"){
                setMessage("Bad Request - 400 Response Error")
            }
     },[])

   
     







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