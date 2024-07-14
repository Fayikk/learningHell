import React from 'react';
import { Link } from 'react-router-dom';
import Comments from '../Comment/Comments';
import StarRating from './StarRating';

export default function VideoPage({ videoId }) {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div className="col col-xl-9 col-lg-8 col-12">
      <div className="video-area">
        <div className="video-heading">
          <Link onClick={ClickHandler} className="theme-btn" to="/">
            Back To Home
          </Link>
        </div>

        <div>
          <video
            className="w-100"
            loop
            autoPlay
            muted
            controls
            controlsList="nodownload"
            key={localStorage.getItem('willSelectedVideo')}
          >
            <source
              src={JSON.parse(localStorage.getItem('willSelectedVideo'))}
              type="video/mp4"
            />
          </video>
        </div>

        <div className="video-details">
          <div className="comments">
            <Comments videoDetail={videoId} />
          </div>
          <div className="star-rating" style={{gridArea:"right"}}>
           
          </div>
        </div>
      </div>
    </div>
  );
}
