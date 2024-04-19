import React, { Fragment, useEffect, useState } from 'react';
import video from '../../images/video/html.mp4'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useGetSectionSubDetailsQuery } from '../../api/sectionApi';
import { useGetWatchVideoUrlMutation } from '../../api/videoApi';
import VideoPage from './VideoPage';

const LessonPage = () => {

    const {sectionId} = useParams();
    const [expanded, setExpanded] = React.useState(false);
    const {data,isLoading} = useGetSectionSubDetailsQuery(sectionId);
    const [videos,setVideos] = useState([]);
    const [selectedVideo,setSelectedVideo] = useState();
    var willSelectedVideo = "";

    const [decryptVideoUrl] = useGetWatchVideoUrlMutation()
    useEffect(() => {
        if (data) {
            setVideos(data.result.videos || []); 
        } 
    }, [data]);

    if (isLoading) {
        return (
            <div><span>...isLoading</span></div>
        )
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const changeVideo = async (videoId) => {
        const videoUrl = videos.find(video => video.videoId === videoId);
        if (videoUrl) {
            const response = await decryptVideoUrl(videoUrl.publicVideoId);
            
            localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
        } else {
            console.error("Video not found!");
        }
    }
    

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <Fragment>
            <section className="wpo-lesson-section">
                <h2 className="hidden">hidden</h2>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-xl-3 col-lg-4 col-12">
                            <div className="wpo-lesson-sidebar">
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                            {/* <AccordionSummary
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                            >
                                                <Typography>1. Course Intrduction <span>1/6</span></Typography>
                                            </AccordionSummary> */}
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                              
                                              
                                                    <ul  className="item">

                                                    {
                                                               videos.map((video,key) => (

                                                                    <li key={key} ><Link onClick={()=>changeVideo(video.videoId)} to={''} ><span>1.1<i
                                                                    className="fi flaticon-play-button"></i> {video.title} </span> <span> {video.duration.toString(2)} min<i className="fa fa-check-circle"
                                                                        aria-hidden="true"></i></span></Link></li>
                                                                        ))
                                                                    }

                                                        {/* <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i
                                                            className="fi flaticon-play-button"></i>Introduction of HTML
                                                            Editors</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Basic</span> <span>15 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Style</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Start</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.6<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Oparator</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li> */}
                                                       
                                                    </ul>

                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className="col col-xl-9 col-lg-8 col-12">
                            <div className="video-area">
                                <div className="video-heading">
                                    <h2>1.1 Introduction of Language</h2>
                                    <Link onClick={ClickHandler} className="theme-btn" to="/">Back To Home</Link>
                                </div>                            
                              <VideoPage></VideoPage>
                                <div className="video-details">
                                    <h2>About Lesson</h2>
                                     <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire</p>
                                </div>
                                <div className="video-details-pagination">
                                    <ul>
                                        <li><Link onClick={ClickHandler} to="/lesson">Previews</Link></li>
                                         <li><Link onClick={ClickHandler} to="/lesson">Next</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
};
export default LessonPage;
