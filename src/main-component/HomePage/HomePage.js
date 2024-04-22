import React, {Fragment, useEffect, useState} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero from '../../components/hero/hero';
import About from '../../components/about/about';
import CategorySection from '../../components/CategorySection/CategorySection';
import CourseSection from '../../components/CourseSection/CourseSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import TeamSection from '../../components/TeamSection/TeamSection';
import ChooseSection from '../../components/ChooseSection/ChooseSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import Newslatter from '../../components/Newslatter/Newslatter';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';
import { useGetCourseIntroductionVideosQuery } from '../../api/courseApi';
import IsLoading from '../../components/Loading/IsLoading';

const HomePage =() => {
    const {data,isLoading} = useGetCourseIntroductionVideosQuery(null);
    const [introductionVideos,setIntroductionVideos] = useState();


    useEffect(()=>{
        if (data) {
            setIntroductionVideos(data)
            
        }
    },[data])
    console.log(data);



    if (isLoading) {
        return (
           <IsLoading></IsLoading>
        )
    }
    if (!introductionVideos) {
        return <div>Veri yükleniyor...</div>;
      }

    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-4'}/>
            <Hero introductionVideos = {introductionVideos} />
            {/* <About/> */}
            {/* <CategorySection/> */}
            <CourseSection/>
            {/* <Testimonial/> */}
            <TeamSection pbClass={'pb-big'}/>
            <ChooseSection/>
            {/* <BlogSection/> */}
            <Newslatter/>
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage;