import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comments from "../Comment/Comments";
import { useCreateCourseProgressMutation, useGetCourseProgressesMutation, useUpdateCourseProgressMutation } from "../../api/courseProgressApi";

export default function VideoPage({ videoId, videoRef, courseId, userId, onData }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [progresess, setProgresess] = useState([]);
  const [updateProgress] = useUpdateCourseProgressMutation();
  const [createProgress] = useCreateCourseProgressMutation();
  const [getCourseProgress] = useGetCourseProgressesMutation();
  const [whereToStay,setWhereToStay] = useState();

  useEffect(() => {
    const videoElement = videoRef.current;
  
    const getCourseModel = {
      UserId: userId,
      courseId: courseId,
    };
  
    const getProgressiveDuration = async (totalDuration) => {
      const response = await getCourseProgress(getCourseModel);
      console.log("trigger 1",response)
      if (response.data.result.completeResult) {
        const videoProgress = response.data.result.completeResult.filter((x) => x.videoId === videoId);
      console.log("trigger videoProgress", videoProgress[0]?.lastWatchedTime);
      setWhereToStay((totalDuration*videoProgress[0]?.lastWatchedTime)/100)

      }
      else 
      {
setWhereToStay(0)
      }
     
      return whereToStay; 
    };
  
    const handleLoadedMetadata = async () => {
      console.log("Video duration:", videoElement.duration);
      
      const lastWatchedTime = await getProgressiveDuration(videoElement.duration); 
      console.log("getProgressiveDuration", lastWatchedTime);
      if (lastWatchedTime !== undefined) {
        videoElement.currentTime = lastWatchedTime; 
        
      }
    };
  
    if (videoElement) {
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  
      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [videoRef, userId, courseId, videoId]);
  
  


  useEffect(() => {

    console.log("trigger videoId",videoId)
    async function fetchData() {
      try {
        const getCourseModel = {
          UserId: userId,
          courseId: courseId
        };

        if (userId.length !== 0 ) {
          const response = await getCourseProgress(getCourseModel);
      console.log("trigger 2",response)

          onData(response);
          console.log("")
          if (response.data.completeResult !== undefined) {
          const videoProgress = response.data.result.completeResult.filter((x) => x.videoId === videoId);
          console.log("trigger videoProgress",videoProgress[0].lastWatchedTime)
          const hasProgress = videoProgress.length > 0;

          if (!hasProgress) {
            console.log("trigger hasProgress",hasProgress)
            const createModel = {
              UserId: userId,
              CourseId: courseId,
              VideoId: videoId
            };
            const createResponse = await createProgress(createModel);
            console.log(createResponse)
          }
          }else {
            const createModel = {
              UserId: userId,
              CourseId: courseId,
              VideoId: videoId
            };
            console.log("trigger create progress")
            const createResponse = await createProgress(createModel);
            console.log("trigger create progress",createResponse)
          }
        }
      } catch (error) {
        console.error("Error fetching course progress:", error);
      }
    }

    fetchData();

    const videoElement = videoRef.current;

    const handleVideoEnd = async () => {
      var updateFormData = new FormData();
      updateFormData.append("UserId", userId);
      updateFormData.append("CourseId", courseId);
      updateFormData.append("VideoId", videoId);
      updateFormData.append("LastWatchedTime", 100);
      updateFormData.append("IsCompleteVideo", true);

      await updateProgress(updateFormData).then((response) => {
      });
      const response = await getCourseProgress(getCourseModel);
      console.log("trigger 3",response)

      onData(response);
    };

    if (videoElement) {
      const interval = setInterval(async () => {
        const currentVideoTime = videoElement.currentTime;
        setCurrentTime(currentVideoTime);
        const percentage = (currentVideoTime / videoElement.duration) * 100;
        var updateFormData = new FormData();
        updateFormData.append("UserId", userId);
        updateFormData.append("CourseId", courseId);
        updateFormData.append("VideoId", videoId);
        updateFormData.append("LastWatchedTime", percentage.toFixed(2));

        await updateProgress(updateFormData).then((response) => {
        });
      }, 5000);

      videoElement.addEventListener('ended', handleVideoEnd);
      
      return () => {
        clearInterval(interval);
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [videoId, userId, videoRef]); 
























  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  return (
    <div className="col col-xl-9 col-lg-8 col-12 flex flex-col gap-4">
      <div className="rounded-2xl shadow-2xl p-2 flex flex-col gap-4 order-1 md:!order-none">
        <div className="flex justify-between p-2">
          <h1 className="font-bold text-black sm:text-2xl text-base">
            Yazılım, Kodlama, Internet Konseptleri 1
          </h1>

          <Link
            onClick={ClickHandler}
            className="theme-btn text-sm sm:text-xl"
            to="/"
          >
            Back To Home
          </Link>
        </div>

        <div className="p-2">
          <video
            className="w-100 rounded-2xl"
            ref={videoRef}
            muted
            controls
            controlsList="nodownload"
          >
            <source type="video/mp4" />
          </video>
        </div>
      </div>

      <div className="hidden rounded-2xl shadow-md bg-gray-200 order-3 md:!order-none md:block">
        <Comments videoDetail={videoId} />
      </div>

      <div className="star-rating" style={{ gridArea: "right" }}></div>
    </div>
  );
}
