import React, { Fragment, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import { useParams } from 'react-router-dom';
import IsLoading from '../../components/Loading/IsLoading';
import { instructorApi, useGetCourseDetailQuery } from '../../api/instructorApi';
import { useDownloadMaterialFileMutation } from '../../api/materialApi';
import JSZip, { remove } from 'jszip';
import { useGetWatchVideoUrlMutation, useRemoveVideoAsyncMutation } from '../../api/videoApi';
import VideoPage from '../LessonPage/VideoPage';
import { CiCircleRemove } from "react-icons/ci";
import { useRemoveSectionAsyncMutation } from '../../api/sectionApi';
import { useDispatch } from 'react-redux';
function InstructorsCourseDetail() {
    const Dispatch = useDispatch();
    const { slug } = useParams();
    const { data, isLoading } = useGetCourseDetailQuery(slug);
    const [downloadFile] = useDownloadMaterialFileMutation();
    const [watchingVideo] = useGetWatchVideoUrlMutation();
    const [removeVideoAsync] = useRemoveVideoAsyncMutation();
    const [removeSectionAsync] = useRemoveSectionAsyncMutation();
    const [chooseVideo,setChooseVideo] = useState(false);
    const [sections, setSections] = useState([]);


    useEffect(() => {
        if (data && data.result[0] && data.result[0].sections) {
            setSections(data.result[0].sections);
            console.log(sections)
        }
    }, [data]);

    if (isLoading) {
        return <IsLoading />;
    }
    
    const handleClickWatchingVideo = async (publicVideoId) => {
       await watchingVideo(publicVideoId).then((response) => {
        // window.open(response.data.result,'_blank')
        localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
        setChooseVideo(true)
       })
    }

    const closeVideo = () => {
        setChooseVideo(false)
    }

    const removeItem = async (itemId,itemName) => {
        var answer = window.confirm("Are you sure want to delete?");

        if (itemName == "video") {
            if (answer) {
                //some code
               await removeVideoAsync(itemId).then((response) => {
                    console.log("trigger response handle remove click")
                    console.log(response)
                })
                console.log("trigger yes")
                Dispatch(instructorApi.util.invalidateTags(["instructor"]))

            }
            else {
                console.log("trigger no")
                //some code
            }
        }
        else if(itemName == "section")
        {
                await removeSectionAsync(itemId).then((response) => {
                    console.log("trigger response section")
                    console.log(response)
                })
                Dispatch(instructorApi.util.invalidateTags(["instructor"]))
        }

        
    }

    const clickDownloadFile = async (fileUrl) => {
        var materialModel = {
            fileUrl:fileUrl,
            type:1
        }


        await downloadFile(materialModel).then((response) => {
            if (response.data.isSuccess) {

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
                        <Accordion.Item eventKey={key}>
                         
                            <Accordion.Header style={{ display: 'flex', alignItems: 'center', width: '100%' }}>{section.sectionName} <button style={{ marginLeft: 'auto' }} onClick={()=>removeItem(section.sectionId,"section")} className='btn btn-danger' >Remove Section</button> </Accordion.Header>
                            {
                                section.videos.map((video,key) => (
                                    <Accordion.Body>
                                    <a width="100%" controls>
                                            {/* <source src={section.publicVideoId} type="video/mp4" /> */}
                                            <strong><a> {video.title} - <button onClick={()=>handleClickWatchingVideo(video.publicVideoId)}>Watching Video</button> <a onClick={()=>removeItem(video.publicVideoId,"video")} ><CiCircleRemove color='red' /></a>  </a></strong>
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
