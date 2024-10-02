import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Comments from "../Comment/Comments";
import StarRating from "./StarRating";

export default function VideoPage({ videoId,videoRef }) {



  console.log("trigger videoId",videoId)
  console.log("trigger videoRef",videoRef)



  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };



  useState(()=>{
  },[videoRef])


  return (
    <div className="col col-xl-9 col-lg-8 col-12 flex flex-col gap-4  ">
      <div className=" rounded-2xl shadow-2xl p-2 flex flex-col gap-4 order-1 md:!order-none">
        <div className="flex justify-between p-2">
          <h1 className="font-bold text-black sm:text-2xl text-base ">
            Yazılım, Kodlama, Internet Konseptleri 1
          </h1>

          <Link
            onClick={ClickHandler}
            className="theme-btn text-sm sm:text-xl "
            to="/"
          >
            Back To Home
          </Link>
        </div>

        <div className="p-2">
 


          <video
            className="w-100 rounded-2xl"
            loop
            autoPlay
            ref={videoRef}
            muted
            controls
            controlsList="nodownload"
          >
            <source
              type="video/mp4"
            />
          </video>
        </div>
      </div>

      <div className=" hidden rounded-2xl shadow-md bg-gray-200 order-3 md:!order-none md:block  ">
        <Comments videoDetail={videoId} />
      </div>
      <div className="star-rating" style={{ gridArea: "right" }}></div>
    </div>
  );
}
