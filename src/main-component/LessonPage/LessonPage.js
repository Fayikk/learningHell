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
import './style/lessonPage.css'


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
            if (videos == []) {
                localStorage.removeItem("willSelectedVideo")
            }
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
        if (videoUrl) {
            await decryptVideoUrl(videoUrl.publicVideoId).then((response) => {
                localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
                console.log(response)
            }).catch((err) => console.error(err));
            
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
                                              
                                              

                                                    {
                                                               videos.map((video,key) => (

                                                                <a key={key} className="video-item" >
                                                                <Link onClick={() => changeVideo(video.videoId)} to={""} className="video-link">
                                                                    <span className="video-info">
                                                                        {videoCounter + key + 1} 
                                                                        <i className="fi flaticon-play-button"></i> 
                                                                        {video.title}
                                                                    </span>
                                                                </Link>
                                                            </a>
                                                            
                                                                        ))
                                                   }

                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <VideoPage></VideoPage>

                       
                    </div>
                </div>
            </section>
        </Fragment>
    )
};
export default LessonPage;
