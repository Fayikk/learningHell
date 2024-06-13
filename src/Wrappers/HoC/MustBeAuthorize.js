import React from 'react'

function MustBeAuthorize(WrappedComponent) {
    return(props) => {
        const token = localStorage.getItem("token");
        if (token==null) {
            window.location.replace("/login")
            return null;
        }
        return <WrappedComponent {...props} ></WrappedComponent>
    } 
}

export default MustBeAuthorize