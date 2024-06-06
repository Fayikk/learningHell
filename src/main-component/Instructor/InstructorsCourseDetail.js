import React, { Fragment, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { useParams } from 'react-router-dom';
import IsLoading from '../../components/Loading/IsLoading';
import { useGetCourseDetailQuery } from '../../api/instructorApi';
import { useDownloadMaterialFileMutation } from '../../api/materialApi';
import JSZip from 'jszip';
import { useGetWatchVideoUrlMutation } from '../../api/videoApi';
import { useNavigate } from 'react-router-dom';
import VideoPage from '../LessonPage/VideoPage';
function InstructorsCourseDetail() {
    const { slug } = useParams();
    const { data, isLoading } = useGetCourseDetailQuery(slug);
    const [downloadFile] = useDownloadMaterialFileMutation();
    const [watchingVideo] = useGetWatchVideoUrlMutation();
    const [chooseVideo,setChooseVideo] = useState(false);
    const [sections, setSections] = useState([]);

    console.log("trigger instructor course details");
    console.log(data);

    useEffect(() => {
        if (data && data.result[0] && data.result[0].sections) {
            setSections(data.result[0].sections);
            console.log("trigger");
            console.log(sections);
        }
        console.log("trigger inner use effect");
    }, [data]);

    if (isLoading) {
        return <IsLoading />;
    }
    
    const handleClickWatchingVideo = async (publicVideoId) => {
       await watchingVideo(publicVideoId).then((response) => {
        console.log(response)
        console.log("trigger watvhing response video url")
        // window.open(response.data.result,'_blank')
        localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
        setChooseVideo(true)
       })
    }

    const closeVideo = () => {
        setChooseVideo(false)
    }


    const clickDownloadFile = async (fileUrl) => {
        var materialModel = {
            fileUrl:fileUrl,
            type:1
        }


        await downloadFile(materialModel).then((response) => {
            console.log("trigger download file response")
            console.log(response)
            if (response.data.isSuccess) {
                console.log("trigger blob download file")
                console.log( response.data.result)

                // const blob = await response.data.result.blob();
                // const arrayBuffer = await  blob.arrayBuffer();

                // Create a new zip file
                const zip = new JSZip()
                zip.file("file.pdf", response.data.result);

                // Generate the zip file and trigger the download
                zip.generateAsync({ type: "blob" })
                    .then(function (zipBlob) {
                        const url = window.URL.createObjectURL(zipBlob);
                        const a = document.createElement('a');
                        a.style.display = 'none';
                        a.href = url;
                        a.download = 'download.zip'; // The name of the zip file
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                    });
            }
        })
    }


    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Instructor'} pageSub={'CourseDetail'} />
            {
    chooseVideo ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%', margin: '0 auto' }}>
            <VideoPage />
            <button onClick={closeVideo}>Close Video</button>
        </div>
    ) : ("")
}

            <Accordion>
       
                      
                {sections.length > 0 ? (
                    sections.map((section, key) => (
                        <Accordion.Item eventKey={key} key={key}>
                         
                            <Accordion.Header>{section.sectionName}</Accordion.Header>
                            {
                                section.videos.map((video,key) => (
                                    <Accordion.Body>
                                    <a width="100%" controls>
                                            {/* <source src={section.publicVideoId} type="video/mp4" /> */}
                                            <strong><a> {video.title} - <button onClick={()=>handleClickWatchingVideo(video.publicVideoId)}>Watching Video</button></a></strong>
                                            <hr></hr>
                                            <div style={{position:"relative"}} >
                                                <a> {video.materials.length > 0 ? (video.materials.map((material,key) => (
                                                    <a> {material.name} - <button onClick={()=>clickDownloadFile(material.fileUrl)} >download</button>  </a> 
                                                ))) : ("material is not found")} </a>
                                            </div>
                                        </a>
                                      <br></br>
                                      <hr style={{backgroundColor:"red",height:"5px"}} ></hr>
                                    </Accordion.Body>
                                ))
                            }
                            
                           
                        </Accordion.Item>
                    ))
                ) : (
                    <p>No sections available.</p>
                )}
            </Accordion>
            <Footer />
            <Scrollbar />
        </Fragment>
    );
}

export default InstructorsCourseDetail;
