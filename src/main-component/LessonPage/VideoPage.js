import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Comments from "../Comment/Comments";
import { useCreateCourseProgressMutation, useDownloadCertificateMutation, useGetCourseProgressesMutation, useUpdateCourseProgressMutation } from "../../api/courseProgressApi";
import { useCheckAppropriateCertificateMutation } from "../../api/courseProgressApi";
export default function VideoPage({ videoId, videoRef, courseId, userId, onData}) {


  const [currentTime, setCurrentTime] = useState(0);
  const [progresess, setProgresess] = useState([]);
  const [updateProgress] = useUpdateCourseProgressMutation();
  const [createProgress] = useCreateCourseProgressMutation();
  const [getCourseProgress] = useGetCourseProgressesMutation();
  const [whereToStay,setWhereToStay] = useState();
  const [hasProgress, setHasProgress] = useState(false);
  const [checkCertificate] = useCheckAppropriateCertificateMutation();
  const [isClicked, setIsClicked] = useState(false);
  const [isCertificateReady, setIsCertificateReady] = useState(null);
  const [downloadCertificate] = useDownloadCertificateMutation();
  useEffect(() => {
    const videoElement = videoRef.current;

    const getProgressiveDuration = async (totalDuration) => {
      const response = await getCourseProgress({ UserId: userId, CourseId: courseId });
      if (response?.data?.result?.completeResult) {
        const videoProgress = response.data.result.completeResult.find((x) => x.videoId === videoId);
        if (videoProgress?.lastWatchedTime !== undefined) {
          return (totalDuration * videoProgress.lastWatchedTime) / 100;
        }
      }
      return 0;
    };

    const handleLoadedMetadata = async () => {
      if (videoElement) {
        const lastWatchedTime = await getProgressiveDuration(videoElement.duration);
        if (lastWatchedTime !== undefined) {
          videoElement.currentTime = lastWatchedTime;
        }
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

    console.log("trigger use effect")

    async function fetchData() {
      try {
        setHasProgress(false);
        const getCourseModel = { UserId: userId, CourseId: courseId };
        if (userId.length !== 0) {
          const response = await getCourseProgress(getCourseModel);
          console.log("trigger response",response)
          onData(response)
          if (response.data.result.completeResult) {
            console.log("trigger has response -1")
            const videoProgress = response.data.result.completeResult.find((x) => x.videoId === videoId);
            console.log("trigger videoProgress progress-0",videoProgress)

            if (videoProgress) {
              console.log("trigger has progress-1",hasProgress)
              setHasProgress(true); 
            } else if (!hasProgress) { 
              console.log("trigger has progress-2",hasProgress)

              const createModel = { UserId: userId, CourseId: courseId, VideoId: videoId };
              console.log("trigger createModel",createModel)
              await createProgress(createModel);
              setHasProgress(true); 
            }
          } else {
            console.log("trigger has response -2",videoId)

            const createModel = { UserId: userId, CourseId: courseId, VideoId: videoId };
            await createProgress(createModel);
            setHasProgress(true); 
          }
          console.log("trigger has response -3",videoId)

        }
      } catch (error) {
        console.error("Error fetching course progress:", error);
      }
    }

    fetchData();

    const videoElement = videoRef.current;

    const handleVideoEnd = async () => {
      const updateFormData = new FormData();
      updateFormData.append("UserId", userId);
      updateFormData.append("CourseId", courseId);
      updateFormData.append("VideoId", videoId);
      updateFormData.append("LastWatchedTime", 100);
      updateFormData.append("IsCompleteVideo", true);
      await updateProgress(updateFormData);
    };

    if (videoElement) {
      const interval = setInterval(async () => {
        const currentVideoTime = videoElement.currentTime;
        const percentage = (currentVideoTime / videoElement.duration) * 100;
        const updateFormData = new FormData();
        updateFormData.append("UserId", userId);
        updateFormData.append("CourseId", courseId);
        updateFormData.append("VideoId", videoId);
        updateFormData.append("LastWatchedTime", percentage.toFixed(2));
        await updateProgress(updateFormData);
      }, 5000);

      videoElement.addEventListener('ended', handleVideoEnd);
      return () => {
        clearInterval(interval);
        videoElement.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [videoId, userId, videoRef]); // Add hasProgress to dependencies







  const certificateControl = async () => {
    setIsClicked(true); // Butona tıklandığında durumu güncelle
    const model = {
      UserId: userId,
      CourseId: courseId,
    };
    try {
      const response = await checkCertificate(model);
      console.log("trigger response model", response);
      setIsCertificateReady(response.data.isSuccess); // Sertifikanın hazır olup olmadığını güncelle
    } catch (error) {
      console.error("Certificate control failed:", error);
    }
  };



  
  const downloadPdf = async () => {
    const model = {
      UserId: userId,
      CourseId: courseId,
    };
  
    
    try {

      const response = await downloadCertificate(model)
      console.log("response",response)
      // Backend'den PDF içeriğini almak için istek yap
      // const response = await dispatch(downloadCertificate(model));
  
      // Eğer response bir hata içeriyorsa kontrol et
      // if (!response || !response.data || !response.data.pdf) {
      //   throw new Error('PDF indirme başarısız oldu.');
      // }
  
      const pdfBase64 = response.data.pdf; // Base64 string
  
      // Base64 string'i byte dizisine çevir
      const byteCharacters = atob(pdfBase64); // Base64 string'i çöz
      const byteNumbers = new Array(byteCharacters.length);
  
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const pdfBlob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      // İndirme bağlantısını oluştur
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'certificate.pdf'; // İndirme ismi
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Oluşturulan URL'yi serbest bırak
      URL.revokeObjectURL(pdfUrl);
  
    } catch (error) {
      console.error('Hata:', error);
    }
  }
  






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
          <button onClick={ClickHandler} className="theme-btn text-sm sm:text-xl">
  <Link to="/">Back To Home</Link>
</button>


{!isClicked ? (
        // Buton henüz tıklanmadıysa bu buton görünsün
        <button onClick={certificateControl} className="theme-btn text-sm sm:text-xl">
          Check Certificate
        </button>
      ) : (
        // Sertifika durumu sonucuna göre butonlar
        isCertificateReady ? (
          <button onClick={downloadPdf}  className="theme-btn text-sm sm:text-xl bg-green-500 text-white">
           Your Certificate Ready
          </button>
        ) : (
          <button className="theme-btn text-sm sm:text-xl bg-red-500 text-white">
            Education is not over
          </button>
        )
      )}
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
