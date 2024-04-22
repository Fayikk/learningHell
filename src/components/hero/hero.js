import React, { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import "./style/styles.css";
import IntroductionVideoPage from "./IntroductionVideoPage";
import { Link } from "react-router-dom";

const Hero = ({ introductionVideos }) => {
  const [mainIndex, setMainIndex] = useState(0);
  const items = introductionVideos.result || [];

  useEffect(() => {
    if (items[mainIndex]) {
      localStorage.setItem("introductionVideo", items[mainIndex].introductionVideoUrl || []);
      
    }
  }, [mainIndex, items]);

  const slideNext = () => {
    if (mainIndex < items.length - 1) {
      setMainIndex(mainIndex + 1);
    }
  };

  const slidePrev = () => {
    if (mainIndex > 0) {
      setMainIndex(mainIndex - 1);
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-inner">
        <div className="container-fluid">
          <div className="hero-content">
            <div className="carousel">
            <div className="item">

              {
                items.length > 0 ? (
                  <Link to={`/course-single/${ items[mainIndex].courseId}`}>
                  <IntroductionVideoPage introductionVideoUrl={items[mainIndex].introductionVideoUrl} />
                </Link>
                ) : (
                  ""
                )
              }
         
</div>
              <p className="index">{`${mainIndex + 1}/${items.length}`}</p>
              <div className="controls">
                <div className="btn-prev" onClick={slidePrev}>
                  &lang;
                </div>
                <div className="btn-next" onClick={slideNext}>
                  &rang;
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
