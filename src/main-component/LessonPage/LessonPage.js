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
import IsLoading from '../../components/Loading/IsLoading';
const LessonPage = () => {

    const {sectionId} = useParams();
    const [expanded, setExpanded] = React.useState(false);
    const {data,isLoading} = useGetSectionSubDetailsQuery(sectionId);
    const [videos,setVideos] = useState([]);
    const [videoCounter,setVideoCounter] = useState(0)

    const [decryptVideoUrl] = useGetWatchVideoUrlMutation()
    useEffect(() => {
        if (data) {
            setVideos(data.result.videos || []); 
        } 
    }, [data]);

    if (isLoading) {
        return (
            <IsLoading></IsLoading>
        )
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const changeVideo = async (videoId) => {
        const videoUrl = videos.find(video => video.videoId === videoId);
        console.log(videoUrl)
        if (videoUrl) {
            const response = await decryptVideoUrl(videoUrl.publicVideoId);
            
            localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
        } else {
            console.error("Video not found!");
        }
    }
    
    const formatDuration = (duration) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 1) * 100); // Extract milliseconds
    
        const formatTime = (time) => (time < 10 ? `0${time}` : time);
    
        return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    };

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

                                                                    <li key={key} ><Link onClick={()=>changeVideo(video.videoId)} style={{color:'white'}} to={''} ><span> {videoCounter + key + 1} <i
                                                                    className="fi flaticon-play-button"></i> {video.title} </span> <span> {formatDuration(video.duration)} min<i className="fa fa-check-circle"
                                                                        aria-hidden="true"></i></span></Link></li>
                                                                        ))
                                                   }
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
};
export default LessonPage;
