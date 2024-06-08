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
import JSZip from 'jszip';
import { useChangeVideoAsncMutation, useGetWatchVideoUrlMutation, useRemoveVideoAsyncMutation } from '../../api/videoApi';
import VideoPage from '../LessonPage/VideoPage';
import { CiCircleRemove } from "react-icons/ci";
import { useAddSectionAsyncMutation, useRemoveSectionAsyncMutation } from '../../api/sectionApi';
import { useDispatch } from 'react-redux';
import CustomModal from '../CustomComponents/CustomModal';
import InstructorAuth from '../../Wrappers/HoC/InstructorAuth';



function InstructorsCourseDetail() {
    const dispatch = useDispatch();
    const { slug } = useParams();
    const { data, isLoading } = useGetCourseDetailQuery(slug);
    const [downloadFile] = useDownloadMaterialFileMutation();
    const [watchingVideo] = useGetWatchVideoUrlMutation();
    const [removeVideoAsync] = useRemoveVideoAsyncMutation();
    const [removeSectionAsync] = useRemoveSectionAsyncMutation();
    const [changeVideoAsync] = useChangeVideoAsncMutation();

    const [chooseVideo, setChooseVideo] = useState(false);
    const [sections, setSections] = useState([]);
    const [modal, isShowModal] = useState(false);
    const [videoDetail,setVideoDetail] = useState({
        publicVideoId:"",
        sectionId:""
    });


    useEffect(() => {
        if (data && data.result[0] && data.result[0].sections) {
            setSections(data.result[0].sections);
        }
    }, [data]);

    if (isLoading) {
        return <IsLoading />;
    }

    const handleClickWatchingVideo = async (publicVideoId) => {
        await watchingVideo(publicVideoId).then((response) => {
            localStorage.setItem('willSelectedVideo', JSON.stringify(response.data.result));
            setChooseVideo(true);
        });
    };

    const closeVideo = () => {
        setChooseVideo(false);
    };

    const removeItem = async (itemId, itemName) => {
        var answer = window.confirm("Are you sure want to delete?");

        if (itemName === "video") {
            if (answer) {
                await removeVideoAsync(itemId).then((response) => {
                });
                dispatch(instructorApi.util.invalidateTags(["instructor"]));
            }
        } else if (itemName === "section") {
            await removeSectionAsync(itemId).then((response) => {
            });
            dispatch(instructorApi.util.invalidateTags(["instructor"]));
        }
    };

    const handleChangeVideoAsync = () => {
        isShowModal(!modal);
    };

    const clickDownloadFile = async (fileUrl) => {
        var materialModel = {
            fileUrl: fileUrl,
            type: 1,
        };

        await downloadFile(materialModel).then((response) => {
            if (response.data.isSuccess) {
                const zip = new JSZip();
                zip.file("file.pdf", response.data.result);

                zip.generateAsync({ type: "blob" }).then(function (zipBlob) {
                    const url = window.URL.createObjectURL(zipBlob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'download.zip';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                });
            }
        });
    };

    const handleFromChildData = async (event) => {


        const formData = new FormData();
        const typeFile = event.file.target.files[0].type.split("/");
        if (typeFile[1] !== 'mp4') {
            return alert("Please just mp4 format")
        }
        formData.append("File",event.file.target.files[0])
        formData.append("Title",event.title)
        formData.append("SectionId",videoDetail.sectionId)
       const fileName = videoDetail.publicVideoId;

        await changeVideoAsync({fileName,formData}).then((response) => {
            console.log("trigger use change video")
            console.log(response)
            if (response.data.isSuccess) {
                    dispatch(instructorApi.util.invalidateTags(["instructor"]));
                
            }
            else {

            }
            
        })

    };





    return (
        <div>
            
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Instructor'} pageSub={'CourseDetail'} />
            {chooseVideo ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '60%', margin: '0 auto' }}>
                    <VideoPage />
                    <button onClick={closeVideo}>Close Video</button>
                </div>
            ) : (
                ""
            )}
            {modal ? (
                <CustomModal props={modal} onData={handleFromChildData} />
            ) : (
                ""
            )}
            <Accordion>
                {sections.length > 0 ? (
                    sections.map((section, key) => (
                        <Accordion.Item eventKey={key} key={key}>
                            <Accordion.Header style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {section.sectionName} 
                                <button style={{ marginLeft: 'auto' }} onClick={() => removeItem(section.sectionId, "section")} className='btn btn-danger'>
                                    Remove Section
                                </button>
                            </Accordion.Header>
                            {section.videos.map((video, key) => (
                                <Accordion.Body key={key}>
                                    <a>
                                        <strong>
                                            <a> 
                                                {video.title} 
                                                <button onClick={() => handleClickWatchingVideo(video.publicVideoId)}>Watching Video</button>
                                                <button className='btn btn-primary' onClick={() => {
                                                        setVideoDetail({ publicVideoId: video.publicVideoId, sectionId: section.sectionId });
                                                        handleChangeVideoAsync();
                                                    }}>Change Video</button> 
                                                <a onClick={() => removeItem(video.publicVideoId, "video")}>  
                                                    <CiCircleRemove color='red'>Remove</CiCircleRemove>
                                                </a>   
                                            </a>
                                        </strong>
                                        <hr />
                                        <div style={{ position: "relative" }}>
                                            <a> 
                                                {video.materials.length > 0 ? (
                                                    video.materials.map((material, key) => (
                                                        <a key={key}> 
                                                            {material.name} 
                                                            <button onClick={() => clickDownloadFile(material.fileUrl)}>download</button>  
                                                        </a> 
                                                    ))
                                                ) : (
                                                    "material is not found"
                                                )}
                                            </a>
                                        </div>
                                    </a>
                                    <br />
                                    <hr style={{ backgroundColor: "red", height: "5px" }} />
                                </Accordion.Body>
                            ))}
                        </Accordion.Item>
                    ))
                ) : (
                    <>
                   
                    <p>No sections available.</p>
                    </>
                )}
            </Accordion>
            <Footer />
            <Scrollbar />
        </Fragment>
        </div>
    );
}

export default InstructorAuth(InstructorsCourseDetail);
