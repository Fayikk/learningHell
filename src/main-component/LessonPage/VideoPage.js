import React from 'react'
import { Link } from 'react-router-dom'
export default function VideoPage() {
      const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

  return (

    <div className="col col-xl-9 col-lg-8 col-12">
    <div className="video-area">
        <div className="video-heading">
            <Link onClick={ClickHandler} className="theme-btn" to="/">Back To Home</Link>
        </div> 

        <div>
          <video className="w-100" loop autoPlay  muted controls key={localStorage.getItem('willSelectedVideo')} >
                                <source
                                            src={JSON.parse(localStorage.getItem('willSelectedVideo'))}
                                            type="video/mp4"
                                        />
                                   
                                </video>
    </div>

        <div className="video-details">
            <h2>About Lesson</h2> 
             <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire</p>
        </div>
    </div>
</div>




  )
}
