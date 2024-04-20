import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./style/styles.css";
import IntroductionVideoPage from "./IntroductionVideoPage";
import { Link } from "react-router-dom";

const Hero = ({ introductionVideos }) => {
    const [mainIndex, setMainIndex] = useState(0);
    const items = introductionVideos.result || []; // Eğer introductionVideos.result tanımlı değilse, items boş dizi olarak atanır.
  
    localStorage.setItem("introductionVideo",items[0].introductionVideoUrl || []);
    
    const slideNext = () => {
      if (mainIndex < items.length - 1) {
        setMainIndex(mainIndex + 1);
    localStorage.setItem("introductionVideo",items[mainIndex].introductionVideoUrl || []);
    var result = localStorage.getItem("introductionVideo")
        console.log(result)
}
    };
  
    const slidePrev = () => {
      if (mainIndex > 0) {
        setMainIndex(mainIndex - 1);
    localStorage.setItem("introductionVideo",items[mainIndex].introductionVideoUrl || []);
    var result = localStorage.getItem("introductionVideo")
    console.log(result)
      }
    };
  
    return (
      <div className="carousel">
        <Link to={`/course-single/${items[mainIndex].courseId}`}>
        <IntroductionVideoPage introductionVideoUrl={items[mainIndex].introductionVideoUrl}></IntroductionVideoPage>
        </Link>

        <p className="index">{`${mainIndex + 1}/${items.length}`}</p>
        <div className="btn-prev" onClick={slidePrev}>
          &lang;
        </div>
        <div className="btn-next" onClick={slideNext}>
          &rang;
        </div>
      </div>
    );
  };
  
export default Hero;
