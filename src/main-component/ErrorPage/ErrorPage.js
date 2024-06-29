import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Error from '../../components/404/Error'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import { useParams } from 'react-router-dom';
const ErrorPage =() => {
    const slug = useParams();

    return(
        <Fragment>
            <Navbar/>
            {/* <PageTitle pageTitle={slug} pagesub={slug}/>  */}
            <Error props = {slug} />
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default ErrorPage;



