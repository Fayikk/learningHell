import React, { Fragment, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar.js';
import PageTitle from '../../components/pagetitle/PageTitle.js'
import BlogList from '../../components/BlogList/BlogList.js'
import Scrollbar from '../../components/scrollbar/scrollbar.js'
import Footer from '../../components/footer/Footer.js';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import IsLoading from '../../components/Loading/IsLoading.js';

const MyCourses = () => {
    const { t } = useTranslation();
    const authState = useSelector((state) => state.authStore);

    useEffect(() => {
    }, [authState]);

    if (!authState) {
        return (
            <IsLoading />
        );
    }

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={t('My Courses')} pagesub={t('Courses')} />
            <BlogList blLeft={'d-none'} nameIdentifier={authState} blRight={'col-lg-10 offset-lg-1'} />
            <Footer />
            <Scrollbar />
        </Fragment>
    );
};
export default MyCourses;

// Check that the nameIdentifier is being set correctly in your Redux state.
