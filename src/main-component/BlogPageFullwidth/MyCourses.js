import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import PageTitle from '../../components/pagetitle/PageTitle.js'
import BlogList from '../../components/BlogList/BlogList.js'
import Scrollbar from '../../components/scrollbar/scrollbar.js'
import Footer from '../../components/footer/Footer.js';
import { useTranslation } from 'react-i18next';

const MyCourses =() => {
    const {t} = useTranslation();
    return(
        <Fragment>
            <Navbar/> 
            <PageTitle pageTitle={t('My Courses')} pagesub={t('Courses')}/> 
            <BlogList blLeft={'d-none'} blRight={'col-lg-10 offset-lg-1'}/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default MyCourses; 

   