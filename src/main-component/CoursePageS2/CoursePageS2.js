import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CategorySection from '../../components/CategorySection/CategorySection';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import IsLoading from '../../components/Loading/IsLoading';
import { useGetAllCategoriesQuery } from '../../api/categoryApi';
import { useTranslation } from 'react-i18next';

const CoursePageS2 = () => {


    const {data,isLoading} = useGetAllCategoriesQuery();
    const {t} = useTranslation();
    if (isLoading) {
        return (
            <IsLoading></IsLoading>
        )
    }

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={t('Course')} pagesub={t('Course')} />
            <CategorySection categories={data} cClass={'bg-white'}/>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePageS2;
