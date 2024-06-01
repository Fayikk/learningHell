import React, {Fragment} from 'react';
import PageTitle from '../../components/pagetitle/PageTitle'
import BlogList from '../../components/BlogList/BlogList.js'
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar'

const BlogPage =() => {
    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'All Courses'} pagesub={'Courses'}/> 
            <BlogList/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default BlogPage;

