import React, { Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import PageTitle from "../../components/pagetitle/PageTitle";
import About from "../../components/about/about";
import CategorySection from "../../components/CategorySection/CategorySection";
import CourseSection from "../../components/CourseSection/CourseSection";
import FunFact2 from "../../components/FunFact2/FunFact2";
import Newslatter from "../../components/Newslatter/Newslatter";
import Scrollbar from "../../components/scrollbar/scrollbar";
import TeamSection from "../../components/TeamSection/TeamSection";
import Footer from "../../components/footer/Footer";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    startTransition(() => {
      i18n.changeLanguage(lng);
    });
  };
  return (
    <Fragment>
      <Navbar />
      <PageTitle pageTitle={t("About Us")} pagesub={t("About")} />
      <About />
      <CategorySection />
      <CourseSection />
      <FunFact2 />
      <TeamSection />
      <Newslatter />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
};
export default AboutPage;
