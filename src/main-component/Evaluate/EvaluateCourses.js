import React, { Fragment, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Footer from '../../components/footer/Footer';
function EvaluateCourses() {
  return (
    <Fragment>
    <Navbar />
    <PageTitle pageTitle={'Evaluate Courses'} pagesub={'Evaluate Courses'} />
    <Footer />
    </Fragment>

  )
}

export default EvaluateCourses