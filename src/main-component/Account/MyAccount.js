import React, { Fragment } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer'
function MyAccount() {
  return (
    <>
    <Fragment>
            <Navbar />
            <PageTitle pageTitle={'My Account'} pagesub={'My Account'} />
            <div className='text-center' >
            <span><strong>This Page Is Under Maintainance</strong></span>
            </div>
            <Footer />
        </Fragment>
            </>
  )
}

export default MyAccount